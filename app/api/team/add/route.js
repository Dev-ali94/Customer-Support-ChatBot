import { db } from "@/db/client";
import { team_member } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    const user = await isAuthorized();

    if (!user) {
      console.error("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !name) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 },
      );
    }

    if (!user.organization_id) {
      console.error(" Missing organization_id in session");
      return NextResponse.json(
        { error: "Missing organization_id" },
        { status: 400 },
      );
    }

    const existingInvite = await db
      .select()
      .from(team_member)
      .where(eq(team_member.user_email, email));

    if (existingInvite.length > 0) {
      console.error("User already invited:", email);

      return NextResponse.json(
        { error: "User already invited" },
        { status: 409 },
      );
    }


    const scalekitResponse = await scalekit.user.createUserAndMembership(
      user.organization_id,
      {
        email,
        userProfile: {
          firstName: name,
          lastName: "",
        },
        sendInvitationEmail: true,
      },
    );

    const invitedUser =
      scalekitResponse?.invitedUser ||
      scalekitResponse?.InvitedUser ||
      scalekitResponse?.user ||
      null;

    await db.insert(team_member).values({
      user_email: email,
      name,
      organization_id: user.organization_id,
    });

     const dashboardUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(dashboardUrl);


    return response
  } catch (error) {
    console.error("🔥 Team Add Error:", error.message);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
