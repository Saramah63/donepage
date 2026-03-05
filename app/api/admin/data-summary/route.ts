import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

function isAuthorized(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  return auth.slice(7) === expected;
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!prisma) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured" },
        { status: 500 }
      );
    }

    const prismaAny = prisma as any;
    const safeCountQualification = prismaAny?.qualificationSession?.count().catch(() => 0) ?? 0;
    const safeRecentQualifications = prismaAny?.qualificationSession
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          slug: true,
          fitScore: true,
          leadType: true,
          nextAction: true,
          createdAt: true,
        },
      })
      .catch(() => []);

    const [kvCount, contactCount, qualificationCount, recentContacts, recentQualifications] = await Promise.all([
      prisma.keyValueStore.count(),
      prisma.contactMessage.count(),
      safeCountQualification,
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          source: true,
          email: true,
          message: true,
          createdAt: true,
        },
      }),
      safeRecentQualifications ?? [],
    ]);

    return NextResponse.json({
      ok: true,
      counts: {
        keyValueRows: kvCount,
        contactMessages: contactCount,
        qualificationSessions: qualificationCount,
      },
      recentContacts,
      recentQualifications,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load data summary" },
      { status: 500 }
    );
  }
}
