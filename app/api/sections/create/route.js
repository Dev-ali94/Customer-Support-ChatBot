import { NextResponse } from "next/server"
import { isAuthorized } from "../../../../lib/isAuthorized"
import { db } from "@/db/client"
import { sections } from "@/db/schema"

export async function POST(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json()
        const { name, description, tone, allowedTopics, blockedTopics, sourceId } = body
        if (!name || !description || !tone) {
            return NextResponse.json({ error: "Missing requied field" }, { status: 400 })
        }
        if (!sourceId || !Array.isArray(sourceId) || sourceId.length === 0) {
            return NextResponse.json({ error: "At least one source is required." }, { status: 400 })
        }
        const section = await db.insert(sections).values({
            user_email: user.email,
            name,
            description,
            tone,
            source_ids: sourceId,
            allowed_topics: allowedTopics || null,
            blocked_topics: blockedTopics || null,
            status: "active",
        })
        return NextResponse.json({ message: "Section created successfully", section }, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })


    }
}