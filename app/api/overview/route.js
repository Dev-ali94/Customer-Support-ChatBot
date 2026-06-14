import { db } from "@/db/client";
import { chatbotData, conversation, knowledge_source, message, sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { count, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "UnAuthorized" }, { status: 401 })
        }
        const bots = await db
            .select()
            .from(chatbotData)
            .where(eq(chatbotData.user_email, user.email))
        const botsId = bots?.map((b) => b.id)
        const ks = await db
            .select({
                type: knowledge_source.type,
                count: count()
            })
            .from(knowledge_source)
            .where(eq(knowledge_source.user_email, user.email))
            .groupBy(knowledge_source.type)
        const knowledgeStatus = {
            website: 0,
            uploads: 0,
            text: 0,
            total: 0
        }
        ks.forEach((k) => {
            if (k.type === "website") knowledgeStatus.website += k.count;
            if (k.type === "text") knowledgeStatus.text += k.count;
            else knowledgeStatus.uploads += k.count;
            knowledgeStatus.total += k.count

        })

        const selectedSection = await db
            .select()
            .from(sections)
            .where(eq(sections.user_email, user.email))
        const sectionStatus = {
            total: selectedSection.length,
            list: selectedSection.map((s) => ({
                name: s.name,
                sourceCount: s.source_ids.length,
                tone: s.tone
            }))
        }
        const [totalSection] = await db.select({ value: count() }).from(sections).where(eq(sections.user_email, user.email))
        sectionStatus.total = totalSection.value
        let recentChat = []
        let totalConversation = 0
        if (botsId.length > 0) {
            const rawConvs = await db
                .select()
                .from(conversation)
                .where(inArray(conversation.chatbot_id, botsId))
                .orderBy(desc(conversation.created_at))
                .limit(5)
            totalConversation = rawConvs.length
            recentChat = await Promise.all(rawConvs.map(async (c) => {
                const [lastMsg] = await db.select().from(message).where(eq(message.conversation_id, c.id)).orderBy(desc(message.created_at)).limit(1)
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
                    title: c.name,
                    snippet: lastMsg?.content || "New Conversation",
                    time: timeDisaply,
                }
            }))
            if (totalConversation > 0 && totalConversation < 5) {

            } else if (totalConversation === 5) {
                const [t] = await db
                    .select({ value: count() })
                    .from(conversation)
                    .where(inArray(conversation.chatbot_id, botsId))
                totalConversation = t.value

            }
        }
        return NextResponse.json({
            botId: botsId[0],
            knowledge: knowledgeStatus,
            sections: sectionStatus,
            chats: recentChat,
            counts: {
                knowledge: knowledgeStatus.total,
                sections: sectionStatus.total,
                conversation: totalConversation
            }
        })
    } catch (error) {
        console.error("Error on fetching dashboard overiw data", error)
    }
}