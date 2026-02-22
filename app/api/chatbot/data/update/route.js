import { db } from "@/db/client";
import { chatbotData } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json()
        const { color, welcome_message } = body
        if (!color || !welcome_message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const [updateChatBotData] = await db.update(chatbotData).set({ color, welcome_message }).where(eq(chatbotData.user_email, user.email)).returning()
        return NextResponse.json({ data: updateChatBotData })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })


    }

}