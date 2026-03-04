import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __donepagePrisma: PrismaClient | undefined;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const prisma = hasDatabaseUrl
  ? global.__donepagePrisma ??
    new PrismaClient({
      // Avoid noisy transient pool disconnect logs in local dev.
      // Keep error logs in production.
      log: process.env.NODE_ENV === "production" ? ["error"] : [],
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  global.__donepagePrisma = prisma;
}
