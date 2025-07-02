// app/api/proxy/user/delete/[userid]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/server-session";

export async function PUT(req: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const tokenData = await getSessionToken();
    const token = tokenData?.accessToken || tokenData?.access_token;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userid } = params;

    const res = await fetch(`http://localhost:7777/api/user/delete/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Failed to soft delete user:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
