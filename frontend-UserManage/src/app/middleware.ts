// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // ตรวจสอบ Token จาก Cookie หรือ Authorization Header
  const url = new URL(req.url);   // รับ URL จาก request
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // ตรวจสอบ Token จาก Cookie หรือ Authorization Header
  const user = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if ((!user || !user.accesstoken) && pathname !== '/login') {
    searchParams.set('redirect', pathname);
    return NextResponse.redirect(new URL(`/login?${searchParams.toString()}`, req.url)); // ถ้าไม่มี Token ให้ redirect ไปยังหน้า login
  } else {
    return NextResponse.next();
  }
}

export const config = {
  // Matcher เพื่อให้ Middleware ทำงานกับทุกหน้าในแอปพลิเคชัน Next.js
  matcher: ['/menu/:path*', '/home/:path*', '/'],
};
