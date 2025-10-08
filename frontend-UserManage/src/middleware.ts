import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Type สำหรับ decoded JWT payload
interface JWTPayload {
  userId: number;
  username: string;
  role: number;
  iat?: number;
  exp?: number;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, searchParams } = req.nextUrl;

  if (
    !token &&
    !['/login', '/forget_password', '/reset-password'].includes(pathname)
  ) {
    const redirectTo = `${pathname}${req.nextUrl.search}`;
    const loginUrl = new URL(`/login`, req.url);
    loginUrl.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  if (token && token.access_token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token.access_token as string);
      const roleId = Number(decoded.role);
      
      const typeInUrl = searchParams.get('type');
      const userRoles = [2, 5, 7];
      const adminRoles = [1, 3, 4, 6];
      
      let correctType: string;
      
      if (userRoles.includes(roleId)) {
        correctType = 'user';
      } else if (adminRoles.includes(roleId)) {
        correctType = 'admin';
      } else {
        correctType = 'user'; // default เป็น user
      }

      console.log('🔍 Debug:', { roleId, typeInUrl, correctType });

      if (typeInUrl && typeInUrl !== correctType) {
        const url = new URL(req.url);
        url.searchParams.set('type', correctType);
        return NextResponse.redirect(url);
      }

      if (!typeInUrl) {
        const url = new URL(req.url);
        url.searchParams.set('type', correctType);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('❌ Error decoding JWT:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/fa_control/:path*'],
};