import { db } from "@/db/client";
import { team_member } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 401}
      );
    }

    // ✅ FIX: check duplicate invite by EMAIL being invited
    const existingInvite = await db
      .select()
      .from(team_member)
      .where(eq(team_member.user_email, email));

    if (existingInvite.length > 0) {
      return NextResponse.json(
        { error: "Invitation already sent to this user" },
        { status: 402}
      );
    }

    // ✅ Ensure organization exists
    if (!user.organization_id) {
      return NextResponse.json(
        { error: "Missing organization ID" },
        { status: 403 }
      );
    }

    // ✅ Scalekit call (safe handling)
    let scalekitResponse;

    try {
      scalekitResponse = await scalekit.user.createUserAndMembership(
        user.organization_id,
        {
          email,
          userProfile: {
            firstName: name || "",
            lastName: name || "",
          },
          sendInvitationEmail: true,
        }
      );
    } catch (scalekitError) {
      console.error("❌ Scalekit error:", scalekitError);

      return NextResponse.json(
        {
          error: "Failed to invite user via Scalekit",
          message: scalekitError?.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Scalekit response:", scalekitResponse);

    // ✅ Safe extraction (no crash)
    const invitedUser =
      scalekitResponse?.invitedUser ||
      scalekitResponse?.InvitedUser ||
      scalekitResponse?.user ||
      null;

    // ✅ Save in DB
    await db.insert(team_member).values({
      user_email: email,
      name: name,
      organization_id: user.organization_id,
    });

    return NextResponse.json({
      success: true,
      invitedUser,
    });
  } catch (error) {
    console.error("🔥 API error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}