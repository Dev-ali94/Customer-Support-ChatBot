import { db } from "@/db/client";
import { chatbotData, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "UnAuthorizred" }, { status: 401 })
        }
        const { id: conversationid } = await params
        const { content } = await req.json()
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }
        const [conv] = await db.select().from(conversation).where(eq(conversation.id, conversationid))
        if (!conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }
        const [bot] = await db.select().from(chatbotData).where(and(eq(chatbotData.id, conv.chatbot_id), eq(chatbotData.user_email, user.email)))
        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 })
        }
        await db.insert(message).values({
            conversation_id: conversationid,
            role: "assistant",
            content: content
        })
        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error("Error on replaying ", error);


    }
}