import { db } from "@/db/client"
import { conversation, knowledge_source, message } from "@/db/schema"
import { countConversationTokens } from "@/lib/countConversationTokens"
import { openRouter, summarizedConversation } from "@/lib/openAi"
import { eq, inArray } from "drizzle-orm"
import { jwtVerify } from "jose"
import { NextResponse } from "next/server"

export async function POST(req) {
    const authHeader = req.headers.get("Authorization")
    const token = authHeader?.split(" ")[1]
    console.log(token);

    if (!token) {
        return NextResponse.json({ error: "Missing session token" }, { status: 401 })
    }
    let sessionId
    let widgetId
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        sessionId = payload.sessionId
        widgetId = payload.widget_id
        console.log(sessionId);
        console.log(widgetId);


        if (!widgetId || !sessionId) {
            throw new Error("Ivalid payload")
        }
    } catch (error) {
        console.error("Token verfication failed", error);
        return NextResponse.json({ error: "Invalid or expired session token " }, { status: 401 })
    }
    let { messages, knowledge_source_id } = await req.json()
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
        console.log("no new user message detected");
    }
    try {
        const [existingConv] = await db.select().from(conversation).where(eq(conversation.id, sessionId)).limit(1)
        if (!existingConv) {
            const forwardedFor = req.headers.get("x-forwarded-for")
            const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "UnKnown IP"
            const visitorName = `#Visitor(${ip})`
            await db.insert(conversation).values({
                id: sessionId,
                widgetId,
                chatbot_id: widgetId,
                visitor_ip: ip,
                name: visitorName,
            })
            const previousMessages = messages.slice(0, - 1)
            if (previousMessages.length > 0) {
                for (const msg of previousMessages) {
                    await db.insert(message).values({
                        conversation_id: sessionId,
                        role: msg.role,
                        content: msg.content
                    })
                }

            }
        }
        if (lastMessage && lastMessage.role === "user") {
            await db.insert(message).values({
                conversation_id: sessionId,
                role: "user",
                content: lastMessage.content
            })
        }
    } catch (error) {
        console.error("Database presences error ", error);
        return NextResponse.json({ error: "Invalid or expired session token " }, { status: 401 })
    }
    let context = ""
    if (knowledge_source_id && knowledge_source_id > 0) {
        try {
            const sources = await db.select({ content: knowledge_source.content }).from(knowledge_source).where(inArray(knowledge_source.id, knowledge_source_id))
            context = sources.map((s) => s.content).filter(Boolean).join("\n\n")
        } catch (error) {
            console.error("Rag retrial error");
        }

    }
    const tokenCount = countConversationTokens(messages)
    if (tokenCount > 6000) {
        const recentMessages = messages.slice(-10)
        const olderMessages = messages.slice(0, -10)
        if (olderMessages.length > 0) {
            const summary = await summarizedConversation(olderMessages)
            context = `PREVIOUS CONVERSTION SUMMARY:\n${summary}\n\n` + context
            messages = recentMessages
        }
    }
    // System prompt
    const systemPrompt = `You are a friendly chatbot named "Alien."
Rules:
1. Always be human-friendly and conversational.
2. Keep all responses extremely short (1–2 sentences max).
3. If asked your name, explain it briefly in a friendly way.
4. If asked your role, explain you are a helpful chatbot briefly.
5. Never answer rude, boring, or unrelated questions; instead, steer the conversation naturally.
6. Mirror the user’s tone and words when appropriate to keep the conversation engaging.
7. Always guide the conversation like a friendly companion.
8. If context is provided, use it to answer questions. If no relevant info is in context, respond naturally without making things up.
Context Role: ${context || "No context provided"}`
    try {
        const completion = await openRouter.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });
        const reply = completion.choices[0]?.message?.content?.trim() || "";
        try {
            await db.insert(message).values({
                conversation_id: sessionId,
                role: "assistant",
                content: reply
            })
        } catch (error) {
            console.error('DataBase presetence error', error)

        }
        return NextResponse.json({ response: reply });
    } catch (error) {
        console.error("OpenRouter Error", error)
        return NextResponse.json({ response: "An error occured" }, { status: 500 })
    }

}