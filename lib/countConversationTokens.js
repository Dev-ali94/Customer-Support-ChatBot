export function countConversationTokens(messages) {
    if (!Array.isArray(messages)) {
        return 0;
    }

    const text = messages
        .map((message) => {
            if (typeof message?.content === "string") {
                return message.content;
            }

            // Handle cases where content is an array
            if (Array.isArray(message?.content)) {
                return message.content
                    .map((item) =>
                        typeof item === "string"
                            ? item
                            : item?.text || ""
                    )
                    .join(" ");
            }

            return "";
        })
        .join(" ");

    // Approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}