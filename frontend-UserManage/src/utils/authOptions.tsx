// utils/authOptions.ts
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        response: { label: "Response", type: "json" },
        responseLogin: { label: "Response Login", type: "json" },
        responseCondition: { label: "Response Condition", type: "text" },
      },

      async authorize(credentials): Promise<User | null> {
        try {
          if (credentials?.response) {
            type OTPResponse = {
              access_token: string;
              user: {
                userid?: string;
                UserID: string;
                UserCode: string;
                fristName: string;
                lastName: string;
                Email: string;
                img_profile: string;
                role_id: number;
                branchid: number;
                depid: number;
              };
            };
            
            if (!credentials?.response) return null;
            
            const parsedResponse = JSON.parse(credentials.response) as OTPResponse;
            const user = parsedResponse.user;
            const token = parsedResponse.access_token;

            return {
              id: user.userid?.toString() ?? "",
              UserID: parseInt(user.UserID),
              UserCode: user.UserCode,
              fristName: user.fristName,
              lastName: user.lastName,
              Email: user.Email,
              access_token: token,
              img_profile: user.img_profile,
              role_id: user.role_id,
              branchid: user.branchid,
              depid: user.depid,
              accessTokenExpires: Date.now() + 60 * 60 * 1000,
            };
          }

          if (credentials?.responseCondition === 'pass' && credentials?.responseLogin) {
            type ResponseLogin = {
              access_token: string;
              user: {
                userid?: string;
                UserID: string;
                UserCode: string;
                fristName: string;
                lastName: string;
                Email: string;
                img_profile: string;
                role_id: number;
                branchid: number;
                depid: number;
              };
            };
            
            const parsedResponse = JSON.parse(credentials.responseLogin) as ResponseLogin;
            const user = parsedResponse.user;
            const token = parsedResponse.access_token;

            return {
              id: user.userid?.toString() ?? "",
              UserID: parseInt(user.UserID),
              UserCode: user.UserCode,
              fristName: user.fristName,
              lastName: user.lastName,
              Email: user.Email,
              access_token: token,
              img_profile: user.img_profile,
              role_id: user.role_id,
              branchid: user.branchid,
              depid: user.depid,
            };
          }

          throw new Error("INVALID_CREDENTIALS");
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.UserID = user.UserID;
        token.UserCode = user.UserCode;
        token.fristName = user.fristName;
        token.lastName = user.lastName;
        token.Email = user.Email;
        token.access_token = user.access_token;
        token.img_profile = user.img_profile;
        token.role_id = user.role_id;
        token.branchid = user.branchid;
        token.depid = user.depid;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }

      // ⭐ เมื่อมีการเรียก update() จาก client
      if (trigger === "update" && token.UserCode) {
        try {
          console.log("🔄 Refreshing user data from backend...");
          
          const response = await fetch(
            `${API_URL}/GetUserWithRoles?UserCode=${token.UserCode}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
              const userData = result.data[0];
              
              // อัพเดตข้อมูลใน token
              token.fristName = userData.fristName;
              token.lastName = userData.lastName;
              token.Email = userData.Email;
              token.img_profile = userData.img_profile;
              token.role_id = userData.role_id;
              token.branchid = userData.branchid;
              token.depid = userData.depid;
              
              console.log("✅ User data refreshed successfully");
            }
          }
        } catch (error) {
          console.error("❌ Error refreshing user data:", error);
          // ไม่ throw error เพื่อไม่ให้ session หลุด
        }
      }

      // ตรวจสอบ token expiry
      if (token.accessTokenExpires && Date.now() > (token.accessTokenExpires as number)) {
        console.log("⚠️ Token expired, logging out...");
        return {} as any; // Return empty object แทน null
      }
      
      return token;
    },

    async session({ session, token }) {
      if (!token || Object.keys(token).length === 0) {
        return session;
      }

      if (typeof token === 'object') {
        session.user = {
          ...(session.user || {}),
          UserID: token.UserID as number,
          UserCode: token.UserCode as string,
          fristName: token.fristName as string,
          lastName: token.lastName as string,
          Email: token.Email as string,
          access_token: token.access_token as string,
          img_profile: token.img_profile as string,
          role_id: token.role_id as number,
          branchid: token.branchid as number,
          depid: token.depid as number,
        };
      }
      
      return session;
    },
  },

  events: {
    async signOut(message) {
      console.log("User signed out:", message);
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },
};