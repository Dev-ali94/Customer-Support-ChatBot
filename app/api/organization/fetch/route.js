import { db } from "@/db/client";
import { businessDetail } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const [businessDetailRecord] = await db.select().from(businessDetail).where(eq(businessDetail.user_email, user.email))
        const organization = {
            ...(businessDetailRecord),
            id: user.organization_id
        }
        return NextResponse.json({ organization }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}