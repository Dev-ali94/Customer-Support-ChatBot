import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import scalekit from "@/lib/scalekit";
import { db } from "@/db/client";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const cookieStore = await cookies();
    const savedState = cookieStore.get("sk_state")?.value;

    if (savedState && savedState !== returnedState) {
      return NextResponse.json({ error: "Invalid state" }, { status: 401 });
    }
    const redirectUrl = `${req.nextUrl.origin}/api/auth/callback`;
    const authResult = await scalekit.authenticateWithCode(code, redirectUrl);
    const { user, idToken } = authResult;
    const claims = await scalekit.validateToken(idToken);
    const organizationId =
      claims.organization_id || claims.org_id || claims.oid || null;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID not found" },
        { status: 400 },
      );
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, user.email))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }
    if (existingUser.length === 0) {
      await db.insert(userTable).values({
        email: user.email,
        name: user.name || "",
        image: user.image || "",
        organization_id: organizationId,
      });
    }

    const dbUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, user.email))
      .limit(1);


    const dashboardUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(dashboardUrl);

    // Store DB user (contains organization_id)
    response.cookies.set("user_session", JSON.stringify(dbUser[0]), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.delete("sk_state");

    return response;
  } catch (error) {
    console.error("Internal server error on callback", error);
    return NextResponse.json(
      {error: error.message || "Internal Server Error"},
      { status: 500 }
    );
  }
}
