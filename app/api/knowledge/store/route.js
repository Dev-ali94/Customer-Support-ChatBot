export const runtime = "nodejs"
import { db } from "@/db/client"
import { knowledge_source } from "@/db/schema"
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
                type = formData.get("type")
                if (!file) {
                    return NextResponse.json({ error: "File is required" }, { status: 400 })
                }
                const fileContent = await file.text()
                const line = fileContent.split("\n").filter((line) => line.trim() !== "")
                const headers = line[0]?.split(",").map((h) => h.trim())
                let formatedContent = ""
                const markdown = await summarizedMarkDown(fileContent)
                formatedContent = markdown

                await db.insert(knowledge_source).values({
                    user_email: user.email,
                    type: "file",
                    name: file.name,
                    status: "active",
                    source_url: file.name,
                    content: formatedContent,
                    meta_data: JSON.stringify({
                        file_name: file.name,
                        file_size: file.size,
                        rowCount: line.length - 1,
                        headers: headers,
                    }),
                })
                return NextResponse.json({ success: true }, { status: 200 })
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
            await db.insert(knowledge_source).values({
                user_email: user.email,
                type: "website",
                name: body.source_url,
                status: "active",
                source_url: body.source_url,
                content: markdown,
            })

        } else if (type === "text") {
            let content = body.content
            if (body.content.length > 500) {
                const markdown = await summarizedMarkDown(body.content)
                content = markdown
            }
            await db.insert(knowledge_source).values({
                user_email: user.email,
                type: "text",
                name: body.title,
                status: "active",
                content: content,
            })

        }
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("Knowledge store error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error", stack: error.stack },
            { status: 500 }
        )
    }
}

