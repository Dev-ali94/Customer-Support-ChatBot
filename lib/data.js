import { Building, Globe2Icon, Link2Icon } from "lucide-react"

const steps = [
    {
        id: "name",
        label: "Business Name",
        icon: Building,
        question: "What is the name of your business.",
        description: "This name will be used for your chatbot.",
        placeholder: "e.g,My Business",
        type: "text",
        field: "business_name"
    },
    {
        id: "website",
        label: "website",
        icon: Globe2Icon,
        question: "What is the url of your website?",
        description: "This url will be used for your chatbot for train it.",
        placeholder: "e.g,https://www.mywebsite.com",
        type: "url",
        field: "website_url"

    },
    {
        id: "link",
        label: "Extra Content",
        icon: Link2Icon,
        question: "Any other link to add?",
        description: "Add any other link or document to train your chatbot like Notion link or any other google docs.",
        placeholder: "e.g,https://www.notion.so/",
        type: "textarea",
        badge: "Optional",
        field: "external_link"

    }
]
export default steps



export const content = {
    data: "You are a data summarization engine for an AI chatbot. Your task: Convert input website markdown, text, or CSV files into a clean, dense summary suitable for LLM context. Strict rules: output only plain text, write as one continuous paragraph, remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content. Remove repetition and marketing language. Keep only factual, informational content that helps answer customer support questions. Do not copy sentences verbatim unless absolutely necessary. Compress aggressively while preserving meaning. The final output must be under 2000 words. The result will be stored as long-term context for a chatbot."
};
