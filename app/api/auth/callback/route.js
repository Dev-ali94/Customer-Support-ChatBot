import scalekit from "@/lib/scalekit";
import { user as User } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";

export async function GET(req) {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    if (error) {
        return NextResponse.json({ error: errorDescription }, { status: 401 });
    }
    if (!code) {
        return NextResponse.json({ error: "No authorization code" }, { status: 400 });
    }
    try {
        const redirectUrl = process.env.SCALEKIT_REDIRECT_URL;
        const authResult = await scalekit.authenticateWithCode(code, redirectUrl);
        const { user, idToken } = authResult;
        const claims = await scalekit.validateToken(idToken);
        const organizationId = claims.organization_id || claims.org_id || claims.oid || "";

        if (!organizationId) {
            return NextResponse.json({ error: "No organization id found" }, { status: 401 })
        }

        // ✅ Correct email comparison
        const userExist = await db.select().from(User).where(eq(User.email, user.email));

        if (userExist.length === 0) {
            await db.insert(User).values({
                email: user.email,
                name: user.name || "",
                organization_id: organizationId,
                created_at: new Date(),
            });
        }
        const response = NextResponse.redirect(new URL("/", req.url));

        const userSession = {
            email: user.email,
            organization_id: organizationId,
        };

        response.cookies.set("user_session", JSON.stringify(userSession), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
