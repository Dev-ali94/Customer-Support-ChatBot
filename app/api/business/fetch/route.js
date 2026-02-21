import { db } from "@/db/client";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { businessDetail } from "@/db/schema";


export async function GET(req) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const cookieStore = await cookies();
        const business_detail = cookieStore.get("business_detail");
        //  If cookie exists, return it
        if (business_detail?.value) {
            return NextResponse.json({ success: true, source: "cookie", data: JSON.parse(business_detail.value) }, { status: 200 })
        }
        // Otherwise fetch from database
        const record = await db.select().from(businessDetail).where(eq(businessDetail.user_email, user.email));

        if (record.length > 0) {
            cookieStore.set("business_detail", JSON.stringify({ business_name: record[0].business_name }),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                }
            );

            return NextResponse.json({ success: true, source: "database", data: record[0] }, { status: 200 })
        }

        return NextResponse.json(
            { success: false, source: "database", data: null, }, { status: 404 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
