import scalekit from "@/lib/scalekit";
import { db } from "@/db/client";
import { user as User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    const cookieStore = await cookies();
    const savedState = cookieStore.get("sk_state")?.value;

    console.log("Returned State:", returnedState);
    console.log("Saved State:", savedState);
    console.log("All Cookies:", cookieStore.getAll());

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    if (!savedState) {
      return NextResponse.json(
        { error: "sk_state cookie not found" },
        { status: 401 }
      );
    }

    if (savedState !== returnedState) {
      return NextResponse.json(
        { error: "Invalid state" },
        { status: 401 }
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
        { error: "Organization ID not found" },
        { status: 401 }
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

    response.cookies.set({
      name: "user_session",
      value: JSON.stringify({
        email: user.email,
        organization_id: organizationId,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.delete("sk_state");

    return response;
  } catch (err) {
    console.error("ScaleKit Error:", err);

    console.error("Status:", err?.response?.status);
    console.error("Data:", err?.response?.data);

    return NextResponse.json(
      {
        error: err?.response?.data || err.message,
      },
      {
        status: err?.response?.status || 500,
      }
    );
  }
}