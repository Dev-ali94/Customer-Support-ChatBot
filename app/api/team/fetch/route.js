import { db } from "@/db/client";
import { team_member } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(params) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const teamMemberdata = await db.select({
            id: team_member.id,
            name: team_member.name,
            user_email: team_member.user_email,
            role: team_member.role,
            status: team_member.status,
            createdAt: team_member.created_at,
        }).from(team_member).where(eq(team_member.organization_id, user.organization_id))
        return NextResponse.json({ team: teamMemberdata }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}