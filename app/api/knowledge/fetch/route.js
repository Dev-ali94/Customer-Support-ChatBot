import { db } from "@/db/client"
import { knowledge_source } from "@/db/schema"
import { isAuthorized } from "@/lib/isAuthorized"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req) {
    const user = await isAuthorized()
    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    const sources = await db.select().from(knowledge_source).where(eq(knowledge_source.user_email, user.email))
    return NextResponse.json({ success: true, sources }, { status: 200 })
}