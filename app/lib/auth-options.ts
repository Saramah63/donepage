// app/lib/auth-options.ts
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Email({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        const host = target.host.toLowerCase();
        const isProd = host === "donepage.co";
        const isPreview = host.endsWith(".vercel.app");
        if (isProd || isPreview) return target.toString();
      } catch {
        // fall through to baseUrl
      }
      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      // token.sub set by provider
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = token.sub;
      return session;
    },
  },
};
