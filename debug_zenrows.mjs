
import 'dotenv/config';

async function testZenRows() {
    const apiKey = process.env.ZENROWS_API_KEY;
    const targetUrl = "https://ali-imran-sheikh-portfolio.vercel.app/";

    console.log(`Testing ZenRows with URL: ${targetUrl}`);

    const zenUrl = new URL("https://api.zenrows.com/v1/");
    zenUrl.searchParams.set("apikey", apiKey);
    zenUrl.searchParams.set("url", targetUrl);
    zenUrl.searchParams.set("response_type", "markdown");
    zenUrl.searchParams.set("js_render", "true");
    zenUrl.searchParams.set("wait_for", "body"); // Correct selector for body tag
    zenUrl.searchParams.set("premium_proxy", "true");

    try {
        console.time("ZenRows Request");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const res = await fetch(zenUrl.toString(), {
            headers: { "User-Agent": "ChatBot.Ai/1.0" },
            signal: controller.signal
        });
        clearTimeout(timeout);
        console.timeEnd("ZenRows Request");

        console.log("Status:", res.status);
        const html = await res.text();
        console.log("Body Length:", html.length);
        console.log("Body Preview:", html.slice(0, 500));

        if (!res.ok) {
            console.error("ZenRows Error Body:", html);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testZenRows();
