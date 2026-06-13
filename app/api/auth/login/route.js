import { NextResponse } from "next/server";
import crypto from "crypto";
import scalekit from "@/lib/scalekit";

export async function GET(request) {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    const origin = new URL(request.url).origin;
    const redirectUrl = `${origin}/api/auth/callback`;

    const authUrl = scalekit.getAuthorizationUrl(redirectUrl, {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
    });

    const response = NextResponse.redirect(authUrl);

    response.cookies.set("sk_state", state, {
      httpOnly: true,
      secure: origin.startsWith("https:"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });
    console.log("Generated state:", state);

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}