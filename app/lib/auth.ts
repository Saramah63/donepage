// app/lib/auth.ts
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "./auth-options";

export async function requireUserId(): Promise<string> {
  const session = (await getServerSession(authOptions)) as Session | null;
  const uid =
    (session as any)?.user?.id ||
    (session as any)?.token?.sub ||
    (session as any)?.user?.email;

  if (!uid) {
    throw new Error("UNAUTHORIZED");
  }
  return String(uid);
}
