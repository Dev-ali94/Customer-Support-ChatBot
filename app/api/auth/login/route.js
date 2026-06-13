import scalekit from "@/lib/scalekit";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const redirectUrl = process.env.SCALEKIT_REDIRECT_URL;

    const options = {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
    };

    const authUrl = scalekit.getAuthorizationUrl(redirectUrl, options);

    // Create response first
    const response = NextResponse.redirect(authUrl);

    // Set cookie on the response
    response.cookies.set("sk_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    });

    console.log("Generated state:", state);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}