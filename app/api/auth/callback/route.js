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

    if (!code) {
      console.error("❌ Missing authorization code");
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get("sk_state")?.value;

    if (savedState && savedState !== returnedState) {
      console.error("❌ Invalid state", { savedState, returnedState });
      return NextResponse.json({ error: "Invalid state" }, { status: 401 });
    }

    const redirectUrl = `${req.nextUrl.origin}/api/auth/callback`;

    // 🔐 Authenticate with Scalekit
    const authResult = await scalekit.authenticateWithCode(code, redirectUrl);

    console.log("✅ Scalekit authResult:", JSON.stringify(authResult, null, 2));

    const { users, idToken } = authResult;

    if (!idToken) {
      console.error("❌ Missing idToken from Scalekit response");
      return NextResponse.json(
        { error: "Authentication failed: missing idToken" },
        { status: 500 }
      );
    }

    // 🔍 Validate token
    const tokenData = scalekit.validateToken(idToken);

    console.log("🔐 Token validation output:", JSON.stringify(tokenData, null, 2));

    // Some SDKs wrap claims differently
    const claims = tokenData?.claims || tokenData?.payload || tokenData;

    console.log("📦 Extracted claims:", claims);

    const organizationId =
      claims?.organization_id ||
      claims?.organizationId ||
      claims?.org_id ||
      claims?.oid;

    if (!organizationId) {
      console.error("❌ Organization ID missing in token");
      console.error("Available claim keys:", Object.keys(claims || {}));

      return NextResponse.json(
        {
          error: "Organization ID not found from Scalekit",
          debug: {
            claims,
          },
        },
        { status: 400 }
      );
    }

    console.log("🏢 Organization ID found:", organizationId);

    // ✅ Check existing user
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, users.email))
      .limit(1);

    // ✅ Insert user if not exists
    if (existingUser.length === 0) {
      console.log("🆕 Creating new user:", users.email);

      await db.insert(user).values({
        email: users.email,
        name: users.name || "",
        image: users.image || "",
        organization_id: organizationId,
      });
    } else {
      console.log("👤 User already exists:", users.email);
    }

    // 🔁 Redirect to dashboard
    const dashboardUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(dashboardUrl);

    response.cookies.set("user_session", JSON.stringify(users), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.delete("sk_state");

    console.log("✅ Authentication flow completed successfully");

    return response;
  } catch (err) {
    console.error("🔥 Callback error:", err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}