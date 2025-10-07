import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      [x: string]: string;
      UserID: number;
      UserCode: string;
      fristName?: string;
      lastName?: string;
      Email?: string;
      access_token?: string;
      img_profile?: string;
      role_id?: number;
      branchid?: number;
    };
  }
  interface User {
    UserID: number;
    UserCode: string;
    fristName?: string;
    lastName?: string;
    Email?: string;
    access_token: string;
    img_profile?: string;
    role_id?: number;
    branchid?: number;
    accessTokenExpires?: number;
  }

  interface JWT { 
    UserID: number;
    UserCode: string;
    fristName?: string;
    lastName?: string;
    Email?: string;
    access_token?: string;
    img_profile?: string;
    role_id?: number;
  }
}
