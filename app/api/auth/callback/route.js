import { db } from "@/db/client";
import { team_member } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🚀 /api/team/add HIT");

    const body = await req.json();
    console.log("📩 Request body:", body);

    const { email, name } = body;

    const user = await isAuthorized();
    console.log("👤 Auth user:", user);

    if (!user) {
      console.log("❌ Unauthorized request");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Validate input
    if (!email || !name) {
      console.log("❌ Missing fields:", { email, name });

      return NextResponse.json(
        {
          error: "Missing email or name",
          received: { email, name },
        },
        { status: 420 }
      );
    }

    console.log("📧 Inviting user:", email);

    // ✅ Check duplicate invite (IMPORTANT FIX: check by email param)
    const existingInvite = await db
      .select()
      .from(team_member)
      .where(eq(team_member.user_email, email));

    console.log("🔍 Existing invite result:", existingInvite);

    if (existingInvite.length > 0) {
      console.log("⚠️ Duplicate invite detected");

      return NextResponse.json(
        {
          error: "User already invited",
          email,
        },
        { status: 401 }
      );
    }

    // ✅ Check organization
    console.log("🏢 Organization ID:", user?.organization_id);

    if (!user.organization_id) {
      console.log("❌ Missing organization ID in user session");

      return NextResponse.json(
        {
          error: "Missing organization ID",
          user,
        },
        { status: 410 }
      );
    }

    // ✅ Scalekit call (safe)
    let scalekitResponse;

    try {
      console.log("📡 Calling Scalekit...");

      scalekitResponse =
        await scalekit.user.createUserAndMembership(
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

      console.log(
        "✅ Scalekit response:",
        JSON.stringify(scalekitResponse, null, 2)
      );
    } catch (scalekitError) {
      console.error("🔥 Scalekit ERROR:", scalekitError);

      return NextResponse.json(
        {
          error: "Scalekit invite failed",
          message: scalekitError?.message,
        },
        { status: 500 }
      );
    }

    const invitedUser =
      scalekitResponse?.invitedUser ||
      scalekitResponse?.InvitedUser ||
      scalekitResponse?.user ||
      null;

    // ✅ Save to DB
    console.log("💾 Saving team member...");

    await db.insert(team_member).values({
      user_email: email,
      name,
      organization_id: user.organization_id,
    });

    console.log("✅ Team member saved successfully");

    return NextResponse.json({
      success: true,
      invitedUser,
    });
  } catch (error) {
    console.error("🔥 UNEXPECTED ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}