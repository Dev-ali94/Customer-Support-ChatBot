export const runtime = "nodejs"

import { isAuthorized } from "@/lib/isAuthorized"
import { summarizedMarkDown } from "@/lib/openAi"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const contentType = req.headers.get("content-type") || ""
        let type
        let body = {}

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData()
            type = formData.get("type")

            if (type === "file") {
                const file = formData.get("file")
                if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 })

                const fileContent = await file.text()
                console.log("Raw file content preview:", fileContent.slice(0, 500))

                const markdown = await summarizedMarkDown(fileContent)
                console.log("Summarized Markdown Response:", markdown)

                return NextResponse.json({ success: true, markdown }, { status: 200 })
            }
        } else {
            body = await req.json()
            type = body.type
        }

        if (type === "website") {
            if (!body.source_url) {
                return NextResponse.json({ error: "Website URL is required" }, { status: 400 })
            }

            const zenUrl = new URL("https://api.zenrows.com/v1/")
            zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY)
            zenUrl.searchParams.set("url", body.source_url)
            zenUrl.searchParams.set("response_type", "markdown")

            const res = await fetch(zenUrl.toString(), {
                headers: { "User-Agent": "Mozilla/5.0" },
            })
            const html = await res.text()
            if (!html || res.status !== 200) {
                return NextResponse.json({ error: "ZenRows failed", status: res.status, body: html?.slice(0, 500), }, { status: 502 })
            }
            const markdown = await summarizedMarkDown(html)
            console.log(markdown);

            return NextResponse.json({ success: true }, { status: 200 })
        }
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    } catch (error) {
        console.error("Knowledge store error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error", stack: error.stack },
            { status: 500 }
        )
    }
}

