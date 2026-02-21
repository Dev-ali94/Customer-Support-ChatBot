import { db } from "@/db/client";
import { chatbotData } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: "401" })
        }
        const [existingChatBotData] = await db.select().from(chatbotData).where(eq(chatbotData.user_email, user.email))
        if (!existingChatBotData) {
            const [newChatBotData] = await db.insert(chatbotData).values({
                user_email: user.email
            }).returning()
            return NextResponse.json({ data: newChatBotData }, { status: 201 })
        }
        return NextResponse.json({ data: existingChatBotData }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })

    }
}