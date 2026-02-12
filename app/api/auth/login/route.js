import scalekit from "@/lib/scalekit";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const state = crypto.randomBytes(16).toString("hex");
        (await cookies()).set("sk_state", state, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });
        const redirectUrl = process.env.SCALEKIT_REDIRECT_URL;
        const options = { scopes: ["openid", "profile", "email", "offline_access"], state };
        const authUrl = scalekit.getAuthorizationUrl(redirectUrl, options);
        const response = NextResponse.redirect(authUrl);
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
