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


// // middleware.ts
// import { getToken } from "next-auth/jwt";
// import { withAuth } from "next-auth/middleware";
// import { NextRequest, NextResponse } from 'next/server';
// import { jwtDecode } from 'jwt-decode';

// interface JWTPayload {
//   userId: number;
//   username: string;
//   role: number;
//   iat?: number;
//   exp?: number;
// }
// export default withAuth(
//   async function middleware(req :NextRequest) {
//     const token = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });
    
//     const path = req.nextUrl.pathname;
//     if (token && token.access_token) {
//       const decoded = jwtDecode<JWTPayload>(token.access_token as string);
//       const roleId = Number(decoded.role);

//       const ALLOWED_ADMIN_ROLES = [1, 3, 4, 6];


//       if (path.includes("/administrator")) {
//         if (!token?.role_id || !ALLOWED_ADMIN_ROLES.includes(roleId)) {
//           console.warn(
//             `[AUDIT] Unauthorized admin access attempt by user ${token?.sub} (role: ${token?.role_id}) to ${path}`
//           );
//           return NextResponse.redirect(new URL("/unauthorized", req.url));
//         }
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token, // ต้อง login ก่อน
//     },
//   }
// );

// // Match ทุก path ที่มี /administrator
// export const config = {
//   matcher: [
//     "/:path*/administrator/:path*",  // ตรง pattern นี้จะครอบคลุมทุก path ที่มี /administrator
//   ],
// };
