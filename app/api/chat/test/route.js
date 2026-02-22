import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { openRouter, summarizedConversation } from "@/lib/openAi";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/isAuthorized";

export async function POST(req) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let { messages, knowledge_source_ids } = await req.json();

        if (!Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
        }

        let context = "";

        // Fetch knowledge sources
        if (knowledge_source_ids && knowledge_source_ids.length > 0) {
            const sources = await db
                .select({ content: knowledge_source.content })
                .from(knowledge_source)
                .where(inArray(knowledge_source.id, knowledge_source_ids));

            context = sources.map(s => s.content).filter(Boolean).join("\n\n");

            // Approximate token trimming: summarize older messages if too many
            if (messages.length > 20) { // roughly limit last 20 messages
                const recentMessages = messages.slice(-10);
                const olderMessages = messages.slice(0, -10);
                if (olderMessages.length > 0) {
                    const summary = await summarizedConversation(olderMessages);
                    context = `PREVIOUS CONVERSATION SUMMARY:\n${summary}\n\n` + context;
                    messages = recentMessages;
                }
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
Context Role: ${context || "No context provided"}`;

        // Call GPT-OSS
        const completion = await openRouter.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        const reply = completion.choices[0]?.message?.content?.trim() || "";

        // Optionally, you can log token usage
        const totalTokens = completion.usage?.total_tokens || 0;
        console.log(`GPT-OSS reply tokens used: ${totalTokens}`);

        return NextResponse.json({ response: reply });
    } catch (error) {
        console.error("Error in /api/chat/test:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}