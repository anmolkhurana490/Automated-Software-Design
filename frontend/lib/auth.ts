import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { googleAuthAPI, loginAPI } from "@/features/auth/repositories";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const response = await loginAPI({
            email: credentials.email as string,
            password: credentials.password as string,
          });
          const { user, access_token } = response;

          return {
            ...user,
            accessToken: access_token,
          }
        } catch (error: any) {
          // throw new Error(error.message || "Login failed");
          return null;
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      if (account?.provider === "google" && account.user) {
        token.user = account.user;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      return session;
    },

    async signIn({ account, user }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await googleAuthAPI(account.id_token);

          (user as any).user = {
            ...res.user,
            accessToken: res.access_token,
          };

          return true;
        }
        catch (error: any) {
          // console.error("Google auth failed:", error.message);
          throw new Error(error.message || "Google authentication failed");
        }
      }

      return true;
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    // signUp: "/auth/signup",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);