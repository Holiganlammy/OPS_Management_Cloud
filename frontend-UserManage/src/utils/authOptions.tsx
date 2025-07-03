import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials): Promise<User | null> {
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const contentType = res.headers.get("content-type") || "";
          if (!res.ok || !contentType.includes("application/json")) {
            console.error("Login API error:", res.status, await res.text());
            return null;
          }

          const response = await res.json();
          console.log("Login response:", response);

          const user = response.user;
          const token = response.access_token;

          if (user && token) {
            return {
              id: user.userid?.toString() ?? "",
              userid: parseInt(user.userid),
              UserCode: user.UserCode,
              fristName: user.fristName,
              lastName: user.lastName,
              Email: user.Email,
              access_token: token,
              img_profile: user.img_profile,
            };
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userid = user.userid;
        token.UserCode = user.UserCode;
        token.fristName = user.fristName;
        token.lastName = user.lastName;
        token.Email = user.Email;
        token.access_token = user.access_token;
        token.img_profile = user.img_profile;
      }
      return token;
    },

    async session({ session, token }) {
      if (typeof token === 'object') {
        session.user = {
          ...(session.user || {}),
          userid: token.userid as number,
          UserCode: token.UserCode as string,
          fristName: token.fristName as string,
          lastName: token.lastName as string,
          Email: token.Email as string,
          access_token: token.access_token as string,
          img_profile: token.img_profile as string,
        };
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },
};
