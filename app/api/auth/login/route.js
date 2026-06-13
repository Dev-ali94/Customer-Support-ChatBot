import { NextResponse } from "next/server";
import crypto from "crypto";
import scalekit from "@/lib/scalekit";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const redirectUrl = process.env.SCALEKIT_REDIRECT_URL;

    const authUrl = scalekit.getAuthorizationUrl(redirectUrl, {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
    });

    console.log("Generated state:", state);

    const response = NextResponse.redirect(authUrl);

    response.cookies.set({
      name: "sk_state",
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}