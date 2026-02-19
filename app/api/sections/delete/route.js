import { isAuthorized } from "@/lib/isAuthorized";
import { sections } from "@/db/schema.js"
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
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
        const section = await db.select().from("sections").where(eq(sections.user_email, user.email))
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 })
        }
        const response = db.delete("sections").where(eq(sections.id, id))
        return NextResponse.json({ message: "Section deleted successfully" }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}