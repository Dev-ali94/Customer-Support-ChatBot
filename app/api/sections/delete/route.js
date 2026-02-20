import { db } from "@/db/client"
import { sections } from "@/db/schema"
import { isAuthorized } from "@/lib/isAuthorized"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(req) {
    try {
        const user = await isAuthorized()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({ error: "Missing section id" }, { status: 400 })
        }

        // Check if section exists AND belongs to user
        const section = await db
            .select()
            .from(sections)
            .where(eq(sections.id, id))

        if (!section.length) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 })
        }

        // Delete section
        await db
            .delete(sections)
            .where(eq(sections.id, id))

        return NextResponse.json(
            { message: "Section deleted successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}