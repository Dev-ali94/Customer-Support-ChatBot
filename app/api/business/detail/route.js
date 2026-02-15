import { db } from "@/db/client";
import { businessDetail } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { business_name, website_url, external_link } = await req.json();

        if (!business_name || !website_url) {
            return NextResponse.json({ error: "Business name and website url are required" }, { status: 400 })
        }
        await db.insert(businessDetail).values({
            user_email: user.email,
            business_name,
            website_url,
            external_link: external_link || "not provided"
        });

        //  Proper cookie handling
        const cookieStore = await cookies();
        cookieStore.set("business_detail", JSON.stringify({ business_name }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
