import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

// ✅ Cache menus ชั่วคระว (optional - ใช้ Map แทน Redis)
const menuCache = new Map<number, { paths: string[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 นาที

async function fetchUserAccessiblePaths(userId: number, token: string = "") {
  // ✅ ตรวจสอบ cache ก่อน
  const cached = menuCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[RBAC] 📦 Using cached paths for user ${userId}`);
    return cached.paths;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Apps_List_Menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ UserID: userId }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[RBAC] ❌ Fetch menu fail for user ${userId}, status: ${res.status}`);
      return [];
    }

    const menus = await res.json();
    const accessiblePaths = (menus || [])
      .filter((m: any) => m.path !== null && m.path !== undefined && m.path !== "")
      .map((m: any) => m.path);

    // ✅ เก็บใน cache
    menuCache.set(userId, {
      paths: accessiblePaths,
      timestamp: Date.now()
    });

    console.log(`[RBAC] ✅ User ${userId} accessible paths (${accessiblePaths.length}):`, accessiblePaths);
    return accessiblePaths;
  } catch (err) {
    console.error("[RBAC] Middleware fetch error:", err);
    return [];
  }
}

function isPathAllowed(requestPath: string, allowedPaths: string[]): boolean {
  const cleanRequestPath = requestPath.split("?")[0];

  for (const allowedPath of allowedPaths) {
    const cleanAllowedPath = allowedPath.split("?")[0];

    if (cleanRequestPath === cleanAllowedPath || 
        cleanRequestPath.startsWith(cleanAllowedPath + "/")) {
      return true;
    }
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // ✅ หน้าที่ไม่ต้อง login - ตรวจเร็วที่สุด
  const publicPaths = ["/login", "/forget_password", "/reset-password", "/unauthorized", "/"];
  
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  // ✅ ไม่มี token → redirect ทันที
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("expired", "true");
    return NextResponse.redirect(loginUrl);
  }

  const userId = token.UserID || token.userid || token.sub;

  if (!userId) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ ดึง path (จาก cache ถ้ามี)
  const allowedPaths = await fetchUserAccessiblePaths(Number(userId), String(token.access_token || ""));

  if (allowedPaths.length === 0) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const isAllowed = isPathAllowed(pathname, allowedPaths);

  if (!isAllowed) {
    console.warn(`[AUDIT] ❌ User ${userId} DENIED access to ${pathname}`);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/fa_control/:path*",
    "/smart/:path*",
    "/reservations/:path*",
  ],
};