import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import scalekit from "@/lib/scalekit";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    const cookieStore = await cookies();
    const savedState = cookieStore.get("sk_state")?.value;

    console.log("savedState:", savedState);
    console.log("returnedState:", returnedState);

    // ✅ STATE CHECK (safe)
    if (savedState && savedState !== returnedState) {
      return NextResponse.json({ error: "Invalid state" }, { status: 401 });
    }

    const redirectUrl = `${req.nextUrl.origin}/api/auth/callback`;

    const authResult = await scalekit.authenticateWithCode(
      code,
      redirectUrl
    );

    const scalekitUser = authResult.user;

    // 🔥 IMPORTANT: correct organization extraction
    const organizationId =
      authResult.organization?.id ||
      authResult.memberships?.[0]?.organizationId ||
      null;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID not found from Scalekit" },
        { status: 400 }
      );
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, scalekitUser.email))
      .limit(1);

    // ✅ INSERT OR UPDATE USER
    if (existingUser.length === 0) {
      await db.insert(user).values({
        email: scalekitUser.email,
        name: scalekitUser.name || "",
        image: scalekitUser.image || "",
        organization_id: organizationId,
      });
    } else {
      await db
        .update(user)
        .set({
          name: scalekitUser.name,
          image: scalekitUser.image,
          organization_id: organizationId, // keep updated
        })
        .where(eq(user.email, scalekitUser.email));
    }

    // ✅ SESSION COOKIE
    const dashboardUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(dashboardUrl);

    response.cookies.set("user_session", JSON.stringify(scalekitUser), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.delete("sk_state");

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}