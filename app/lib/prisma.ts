import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __donepagePrisma: PrismaClient | undefined;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const prisma = hasDatabaseUrl
  ? global.__donepagePrisma ??
    new PrismaClient({
      log: ["error"],
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  global.__donepagePrisma = prisma;
}
