// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

const menuCache = new Map<number, { paths: string[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchUserAccessiblePaths(userId: number, token: string = "") {
  const cached = menuCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[RBAC] 📦 Using cached paths for user ${userId}`);
    return cached.paths;
  }

  try {
    const res = await fetch(`${process.env.Localhost_API}/Apps_List_Menu`, {
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
      
      // 401 = token หมดอายุ
      if (res.status === 401) {
        console.error(`[AUTH] ❌ Token expired for user ${userId}`);
        return null; // return null เพื่อบอกว่า token หมดอายุ
      }
      
      return [];
    }

    const menus = await res.json();
    
    const accessiblePaths = (menus || [])
      .filter((m: any) => m.path !== null && m.path !== undefined && m.path !== "")
      .map((m: any) => m.path);

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

    if (cleanRequestPath === cleanAllowedPath) {
      return true;
    }

    if (cleanAllowedPath.endsWith("/*")) {
      const basePath = cleanAllowedPath.slice(0, -2);
      if (cleanRequestPath === basePath || cleanRequestPath.startsWith(basePath + "/")) {
        return true;
      }
    }
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/forget_password", "/reset-password", "/unauthorized", "/"];
  
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

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

  const allowedPaths = await fetchUserAccessiblePaths(Number(userId), String(token.access_token || ""));

  // ถ้า allowedPaths = null แปลว่า token หมดอายุ
  if (allowedPaths === null) {
    console.log("[AUTH] ❌ Token expired (401 from API)");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("expired", "true");
    loginUrl.searchParams.set("reason", "api_401");
    return NextResponse.redirect(loginUrl);
  }

  if (allowedPaths.length === 0) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const isAllowed = isPathAllowed(pathname, allowedPaths);

  if (!isAllowed) {
    console.warn(`[RBAC] ❌ User ${userId} DENIED access to ${pathname}`);
    console.warn(`[RBAC] Allowed paths:`, allowedPaths);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  console.log(`[RBAC] ✅ User ${userId} ALLOWED to access ${pathname}`);
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