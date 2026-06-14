import { db } from "@/db/client";
import { chatbotData, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { id: conversatioId } = await params
        const [conv] = await db.select().from(conversation).where(eq(conversation.id, conversatioId))
        if (!conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }
        const [bot] = await db.select().from(chatbotData).where(and(eq(chatbotData.id, conv.chatbot_id), eq(chatbotData.user_email, user.email)))
        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 })
        }
        const msg = await db.select().from(message).where(eq(message.conversation_id, conversatioId)).orderBy(asc(message.created_at))
        return NextResponse.json({ messages: msg })
    } catch (error) {
        console.error("messages fetch error", error);

    }
}