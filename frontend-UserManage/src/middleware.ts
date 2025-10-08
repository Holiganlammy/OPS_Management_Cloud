import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, searchParams } = req.nextUrl;

  // ✅ ถ้ายังไม่ได้ login
  if (
    !token &&
    !['/login', '/forget_password', '/reset-password'].includes(pathname)
  ) {
    const redirectTo = `${pathname}${req.nextUrl.search}`;
    const loginUrl = new URL(`/login`, req.url);
    loginUrl.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ ตรวจสอบ role และ type
  if (token) {
    const roleId = Number(token.role_id);
    const typeInUrl = searchParams.get('type');
    
    // 🔒 กำหนด role ที่เป็น user และ admin
    const userRoles = [2, 5, 7];
    const adminRoles = [1, 3, 4, 6];
    
    // 🔍 เช็คว่า role_id เป็น user หรือ admin
    let correctType: string;
    
    if (userRoles.includes(roleId)) {
      correctType = 'user';
    } else if (adminRoles.includes(roleId)) {
      correctType = 'admin';
    } else {
      // ถ้า role_id ไม่อยู่ในทั้งสองกลุ่ม (กรณีมี role_id ใหม่)
      correctType = 'user'; // default เป็น user
    }

    console.log('🔍 Debug:', { roleId, typeInUrl, correctType });

    // 🚫 ถ้า type ใน URL ไม่ตรงกับ role_id → บังคับ redirect ไปที่ type ที่ถูกต้อง
    if (typeInUrl && typeInUrl !== correctType) {
      const url = new URL(req.url);
      url.searchParams.set('type', correctType);
      return NextResponse.redirect(url);
    }

    // ✅ ถ้าไม่มี type ให้เติมตาม role_id
    if (!typeInUrl) {
      const url = new URL(req.url);
      url.searchParams.set('type', correctType);
      return NextResponse.redirect(url);
    }
  }

  // ✅ ผ่านทุกอย่าง → ไปต่อ
  return NextResponse.next();
}

export const config = {
  matcher: ['/fa_control/:path*'],
};