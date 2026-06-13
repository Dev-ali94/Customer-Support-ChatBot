import scalekit from "@/lib/scalekit";
import { user as User } from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const cookieStore = await cookies();
    const savedState = cookieStore.get("sk_state")?.value;

    console.log("Returned State:", state);
    console.log("Saved State:", savedState);

    if (!code) {
      return NextResponse.json(
        {
          error: "Missing authorization code",
        },
        {
          status: 400,
        }
      );
    }

    // Validate state
    if (!savedState || savedState !== state) {
      return NextResponse.json(
        {
          error: "Invalid state",
        },
        {
          status: 401,
        }
      );
    }

    const redirectUrl = process.env.SCALEKIT_REDIRECT_URL;

    const authResult = await scalekit.authenticateWithCode(
      code,
      redirectUrl
    );

    const { user, idToken } = authResult;

    const claims = await scalekit.validateToken(idToken);

    const organizationId =
      claims.organization_id ||
      claims.org_id ||
      claims.oid ||
      "";

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "Organization ID not found",
        },
        {
          status: 401,
        }
      );
    }

    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, user.email));

    if (existingUser.length === 0) {
      await db.insert(User).values({
        email: user.email,
        name: user.name || "",
        organization_id: organizationId,
        created_at: new Date(),
      });
    }

    const response = NextResponse.redirect(new URL("/", req.url));

    response.cookies.set(
      "user_session",
      JSON.stringify({
        email: user.email,
        organization_id: organizationId,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    // Remove state cookie after successful login
    response.cookies.delete("sk_state");

    return response;
  } catch (error) {
    console.error("ScaleKit Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}