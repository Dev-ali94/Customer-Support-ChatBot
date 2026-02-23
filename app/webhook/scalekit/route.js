export async function POST(req) {
    try {
        const body = await req.json()
        const headers = Object.fromEntries(req.headers.entries())
        const secret = process.env.SCALEKIT_WEBHOOK_SECRET

        try {
            scalekit.verifyWebhookPayload(secret, body, headers)
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid webhook signature" },
                { status: 400 }
            )
        }

        const event = body   // ✅ FIXED (no JSON.parse)

        switch (event.type) {
            case "user.organization_membership_created":
                const param = event.data
                await db.update(team_member)
                    .set({ status: "active" })
                    .where(eq(team_member.user_email, param.user.email))
                break

            default:
                console.log("Unhandled event type", event.type) // also fixed typo
        }

        return NextResponse.json({ success: true }, { status: 201 })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}