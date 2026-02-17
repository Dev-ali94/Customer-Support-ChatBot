import OpenAI from "openai"
import { content } from "./data.js"

export const openRouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
})

export async function summarizedMarkDown(markDown) {
    try {
        const completion = await openRouter.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: `${content.data}` },
                { role: "user", content: markDown },
            ],
        })
        const responseContent = completion.choices[0].message.content?.trim() || ""
        console.log("Summarized Markdown Response:", responseContent)
        return responseContent
    } catch (error) {
        console.error("Error in summarizedMarkDown:", error)
        throw new Error("Error occur")
    }
}



