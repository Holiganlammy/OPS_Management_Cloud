// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

// 👇 เปลี่ยน cache key จาก userId เป็น userId + roleId
const menuCache = new Map<string, { paths: string[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// 👇 เปลี่ยม function signature เพิ่ม roleId
async function fetchUserAccessiblePaths(
  userId: number, 
  roleId: number, // 👈 เพิ่ม
  token: string = ""
) {
  // 👇 สร้าง cache key จาก userId + roleId
  const cacheKey = `${userId}-${roleId}`;
  const cached = menuCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[RBAC] 📦 Using cached paths for user ${userId} (role ${roleId})`);
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
      
      if (res.status === 401) {
        console.error(`[AUTH] ❌ Token expired for user ${userId}`);
        return null;
      }
      
      return [];
    }

    const menus = await res.json();
    
    const accessiblePaths = (menus || [])
      .filter((m: any) => m.path !== null && m.path !== undefined && m.path !== "")
      .map((m: any) => m.path);

    // 👇 cache ด้วย key ใหม่
    menuCache.set(cacheKey, {
      paths: accessiblePaths,
      timestamp: Date.now()
    });

    console.log(`[RBAC] ✅ User ${userId} (role ${roleId}) accessible paths (${accessiblePaths.length}):`, accessiblePaths);
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
    return NextResponse.redirect(loginUrl);
  }

  const userId = token.UserID || token.userid || token.sub;
  const roleId = token.role_id; // 👈 เพิ่ม - ดึง role_id จาก token

  if (!userId) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 👇 ส่ง roleId เข้าไปด้วย
  const allowedPaths = await fetchUserAccessiblePaths(
    Number(userId), 
    Number(roleId), // 👈 เพิ่ม
    String(token.access_token || "")
  );

  if (allowedPaths === null) {
    console.log("[AUTH] ❌ Token expired (401 from API)");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "api_401");
    return NextResponse.redirect(loginUrl);
  }

  if (allowedPaths.length === 0) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const isAllowed = isPathAllowed(pathname, allowedPaths);

  if (!isAllowed) {
    console.warn(`[RBAC] ❌ User ${userId} (role ${roleId}) DENIED access to ${pathname}`);
    console.warn(`[RBAC] Allowed paths:`, allowedPaths);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  console.log(`[RBAC] ✅ User ${userId} (role ${roleId}) ALLOWED to access ${pathname}`);
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