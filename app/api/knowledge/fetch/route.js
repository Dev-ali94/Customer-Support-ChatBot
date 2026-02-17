import { NextResponse } from "next/server"

export async function GET(req) {
    return NextResponse.json({ message: "Knowledge fetch endpoint" }, { status: 200 })
}