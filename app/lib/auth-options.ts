// app/lib/auth-options.ts
import GitHub from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
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
