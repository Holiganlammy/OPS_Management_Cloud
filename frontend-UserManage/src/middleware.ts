import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

  // ตรวจสอบ Token จาก Cookie หรือ Authorization Header
  const user = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if ((!user || !user.accesstoken) && pathname !== '/login') {
    searchParams.set('redirect', pathname);
    return NextResponse.redirect(new URL(`/login?${searchParams.toString()}`, req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/menu/:path*', '/home/:path*','/'],
};
