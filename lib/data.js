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