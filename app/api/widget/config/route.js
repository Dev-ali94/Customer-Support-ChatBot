import { db } from "@/db/client"
import { chatbotData } from "@/db/schema"
import { eq } from "drizzle-orm"
import { BanknoteIcon } from "lucide-react"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { widget_id } = await req.json()
        if (!widget_id) {
            return NextResponse.json({ error: "widget id not provided" }, { status: 400 })
        }
        const [bot] = db.select().from(chatbotData).where(eq(chatbotData.id, widget_id)).limit(1)
        if (!bot) {
            return NextResponse.json({ error: "Widget not found" }, { status: 400 })
        }
    } catch (error) {

    }
}