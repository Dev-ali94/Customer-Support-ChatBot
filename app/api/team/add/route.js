import { db } from "@/db/client";
import { team_member } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { email, name } = await req.json()
        if (!email || !name) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }
        const pendingTeamMember = await db.select().from(team_member).where(eq(team_member.user_email, user.email))
        if (pendingTeamMember.length > 0) {
            return NextResponse.json({ error: "You have already sent an invitation to this user" }, { status: 400 })
        }
        const { InvitedUser } = await scalekit.user.createUserAndMembership(user.organization_id, {
            email,
            userProfile: {
                firstName: name || "",
                lastName: name || ""
            },
            sendInvitationEmail: true
        })
        await db.insert(team_member).values({
            user_email: email,
            name: name,
            organization_id: user.organization_id,
        })
        return NextResponse.json({ user: InvitedUser })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

}