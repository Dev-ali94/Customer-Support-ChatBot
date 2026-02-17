


async function testStore() {
    try {
        const response = await fetch('http://localhost:3000/api/knowledge/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'website',
                source_url: 'https://example.com' // Simple example URL
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

testStore();
