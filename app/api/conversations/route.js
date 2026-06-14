import { db } from "@/db/client";
import { chatbotData, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { desc, eq, inArray } from "drizzle-orm";
import { time } from "drizzle-orm/mysql-core";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "UnAuthorized" }, { status: 401 })
        }
        const bots = await db.select().from(chatbotData).where(eq(chatbotData.user_email, user.email))
        if (bots.length === 0) {
            return NextResponse.json({ conversations: [] })
        }
        const botId = bots.map((b) => b.id)
        const convs = await db
            .select()
            .from(conversation)
            .where(inArray(conversation.chatbot_id, botId))
            .orderBy(desc(conversation.created_at))
        const data = await Promise.all(convs.map(async (c) => {
            const [lastMsg] = await db
                .select()
                .from(message)
                .where((eq(message.conversation_id, c.id)))
                .orderBy(desc(message.created_at))
                .limit(1)
            let timeDisaply = ""
            const ts = lastMsg?.created_at || c.created_at
            if (ts) {
                const date = new Date(ts)
                const now = new Date()
                const diffMs = now.getTime() - date.getTime()
                const diffMin = Math.floor(diffMs / 60000)
                const diffHr = Math.floor(diffMin / 60)
                if (diffMin < 60) timeDisaply = `${diffMin}min ago`
                else if (diffHr < 24) timeDisaply = `${diffHr}hours ago`
                else timeDisaply = date.toLocaleDateString()
            }
            return {
                id: c.id,
                user: c.name || "",
                lastMessage: lastMsg?.content || "Start Conversation",
                status: "active",
                time: timeDisaply,
                visitor_ip: c.visitor_ip,


            }
        }))
        return NextResponse.json({ conversations: data })
    } catch (error) {
        console.error("Conversation fetch error", error);
    }
}