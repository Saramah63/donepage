// app/lib/auth-options.ts
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Email from "next-auth/providers/email";
import { prisma } from "@/app/lib/prisma";

const emailServer = process.env.RESEND_API_KEY
  ? {
      host: "smtp.resend.com",
      port: 465,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    }
  : process.env.EMAIL_SERVER;

const emailEnabled =
  Boolean(process.env.DATABASE_URL) &&
  Boolean(emailServer) &&
  Boolean(process.env.EMAIL_FROM) &&
  Boolean(prisma);

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    ...(emailEnabled
      ? [
          Email({
            server: emailServer,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
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
