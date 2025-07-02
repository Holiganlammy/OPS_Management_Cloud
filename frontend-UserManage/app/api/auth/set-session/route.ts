import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/server-session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user, accessToken } = body;

  if (!accessToken || !user) {
    return NextResponse.json(
      { error: "Missing access token or user" },
      { status: 400 }
    );
  }

  const payload = {
    user,
    loginTime: new Date().toISOString(),
  };


  await setSession({ accessToken });
  await setSession(payload, 'session');

  return NextResponse.json({ success: true });
}
