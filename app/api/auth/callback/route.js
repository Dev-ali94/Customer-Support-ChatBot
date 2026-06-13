import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import scalekit from "@/lib/scalekit";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    const cookieStore = await cookies();

    console.log("Returned State:", returnedState);
    console.log("Cookies:", cookieStore.getAll());

    const savedState = cookieStore.get("sk_state")?.value;

    if (!savedState) {
      return NextResponse.json(
        { error: "sk_state cookie not found" },
        { status: 401 }
      );
    }

    if (savedState !== returnedState) {
      return NextResponse.json(
        { error: "Invalid state" },
        { status: 401 }
      );
    }

    const authResult = await scalekit.authenticateWithCode(
      code,
      process.env.SCALEKIT_REDIRECT_URL
    );

    return NextResponse.json(authResult);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.response?.data || err.message,
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}