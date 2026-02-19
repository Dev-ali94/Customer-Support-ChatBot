import { db } from "@/db/client";
import { isAuthorized } from "@/lib/isAuthorized";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const response = await db.select().from(sections).where(eq(sections.user_email, user.email))
        return NextResponse.json({ message: "Sections fetched successfully", sections: response }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}