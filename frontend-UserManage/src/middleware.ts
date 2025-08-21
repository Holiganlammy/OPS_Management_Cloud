import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = req.nextUrl;

  if (!token && pathname !== '/login' && pathname !== '/forget_password' && pathname !== '/reset-password') {
    const redirectTo = `${pathname}${search}`;
    const loginUrl = new URL(`/login`, req.url);
    loginUrl.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/menu/:path*', '/home/:path*', '/users/:path*'],
};
