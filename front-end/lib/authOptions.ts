/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              username: user.name,
              profileURL: user.image,
              idToken: account.id_token,
            }),
          });

          if (!res.ok) throw new Error("cannot create user");

          const { accessToken, refreshToken } = await res.json();
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          return true;
        } catch (error) {
          console.error("Google login error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
