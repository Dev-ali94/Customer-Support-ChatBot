import { db } from "@/db/client";
import { chatbotData, sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token")
    if (!token) {
        return NextResponse.json({ error: "missing token" }, { status: 400 })
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        const widgetId = payload.widget_id
        const ownerEmail = payload.ownerEmail
        const [meta] = await db.select().from(chatbotData).where(eq(chatbotData.id, widgetId)).limit(1)
        if (!meta) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 })
        }
        const userSections = await db.select().from(sections).where(eq(sections.user_email, ownerEmail))
        return NextResponse.json({ metadata: meta, sections: userSections })

    } catch (error) {
        console.error("config fetch Error", error);
        return NextResponse.json({ error: "config Error" }, { status: 500 })
    }
}