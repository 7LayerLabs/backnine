import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  // Check against admin password in environment variable
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (password === adminPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
