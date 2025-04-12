// app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(GOOGLE_SCRIPT_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  return NextResponse.json(JSON.parse(text));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const auth = searchParams.get("auth");

  const response = await fetch(`${GOOGLE_SCRIPT_URL}?email=${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth,
      action: "fetch",
      data: { email },
    }),
  });

  const text = await response.text();
  return NextResponse.json(JSON.parse(text));
}
