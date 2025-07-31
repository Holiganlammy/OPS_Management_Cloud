import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        otpCode: { label: "OTP Token", type: "text" },
        usercode: { label: "User Code", type: "text" },
        trustDevice: { label: "Trust Device", type: "checkbox" },
      },

      async authorize(credentials): Promise<User | null> {
        try {
          if (credentials?.otpCode) {
            const res = await fetch(`${API_URL}/verify-otp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
              body: JSON.stringify({ otpCode: credentials.otpCode , usercode: credentials.usercode, trustDevice: credentials.trustDevice }),
            });

            const data = await res.json();
            console.log("OTP verification response:", data);
            if (!res.ok || !data.access_token || !data.user) {
              console.error("OTP verification failed:", data);
              return null;
            }

            const user = data.user;
            const token = data.access_token;

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
            };
          }
          // const res = await fetch(`${API_URL}/login`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(credentials),
          // });

          // const response = await res.json();

          // if (response.error === "MFA_REQUIRED") {
          //   const err = new Error("MFA_REQUIRED");
          //   (err as any).code = "MFA_REQUIRED";
          //   throw err;
          // }

          // if (response.user && response.access_token) {
          //   const user = response.user;
          //   const token = response.access_token;

          //   return {
          //     id: user.userid?.toString() ?? "",
          //     UserID: parseInt(user.UserID),
          //     UserCode: user.UserCode,
          //     fristName: user.fristName,
          //     lastName: user.lastName,
          //     Email: user.Email,
          //     access_token: token,
          //     img_profile: user.img_profile,
          //     role_id: user.role_id,
          //   };
          // }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          if (typeof error === "object" && error !== null && "code" in error && (error as any).code === "MFA_REQUIRED") {
            throw new Error("MFA_REQUIRED");
          }
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.UserID = user.UserID;
        token.UserCode = user.UserCode;
        token.fristName = user.fristName;
        token.lastName = user.lastName;
        token.Email = user.Email;
        token.access_token = user.access_token;
        token.img_profile = user.img_profile;
        token.role_id = user.role_id;
      }
      return token;
    },

    async session({ session, token }) {
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
