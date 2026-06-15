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
    const authResult = await scalekit.authenticateWithCode(code,redirectUrl);
    const {user,idToken} = authResult;
    const claims = await scalekit.validateToken(idToken)
    const organizationId = claims.organization_id || claims.org_id || claims.oid || null

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID not found from Scalekit" },{ status: 400 });
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, user.email))
      .limit(1);

    // 
    if (existingUser.length === 0) {
      await db.insert(userTable).values({
        email: user.email,
        name: user.name || "",
        image: user.image || "",
        organization_id: organizationId,
      });
    } 
    const dashboardUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(dashboardUrl);

    response.cookies.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.delete("sk_state");
    return response;
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message },{ status: 500 });
  }
}  