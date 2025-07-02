import { NextResponse } from "next/server"
import { getSessionToken } from "@/lib/server-session"

export async function GET() {
  try {
    const tokenData = await getSessionToken()
    const token = tokenData?.accessToken || tokenData?.access_token

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 }
      )
    }

    const res = await fetch("http://localhost:7777/api/branch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    console.error("Failed to fetch users:", error)

    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error?.message || error,
      },
      { status: 500 }
    )
  }
}
