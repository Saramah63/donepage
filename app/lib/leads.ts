import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getPersistentKV, setPersistentKV } from "@/app/lib/persistent-kv";

export type LeadRecord = {
  id: string;
  email: string;
  draftId: string | null;
  verified: boolean;
  purchased: boolean;
  followup30mSent: boolean;
  followup24hSent: boolean;
  followup3dSent: boolean;
  createdAt: Date | string;
};

export type FollowupStage = "30m" | "24h" | "3d";

type FollowupCandidate = {
  lead: LeadRecord;
  stage: FollowupStage;
};

const leadKey = (id: string) => `lead:${id}`;
const leadIndexKey = "lead:index";

function nowIso() {
  return new Date().toISOString();
}

function asLeadRecord(input: {
  id: string;
  email: string;
  draftId: string | null;
  verified: boolean;
  purchased: boolean;
  followup30mSent: boolean;
  followup24hSent: boolean;
  followup3dSent: boolean;
  createdAt: Date | string;
}) {
  return {
    id: input.id,
    email: input.email,
    draftId: input.draftId,
    verified: Boolean(input.verified),
    purchased: Boolean(input.purchased),
    followup30mSent: Boolean(input.followup30mSent),
    followup24hSent: Boolean(input.followup24hSent),
    followup3dSent: Boolean(input.followup3dSent),
    createdAt: input.createdAt,
  } satisfies LeadRecord;
}

async function listMemoryLeads() {
  const ids = (await getPersistentKV<string[]>(leadIndexKey)) ?? [];
  const items = await Promise.all(ids.map((id) => getPersistentKV<LeadRecord>(leadKey(id))));
  return items.filter(Boolean) as LeadRecord[];
}

async function storeMemoryLead(lead: LeadRecord) {
  const ids = (await getPersistentKV<string[]>(leadIndexKey)) ?? [];
  const nextIds = [lead.id, ...ids.filter((id) => id !== lead.id)];
  await setPersistentKV(leadKey(lead.id), lead);
  await setPersistentKV(leadIndexKey, nextIds);
}

export async function upsertLead(input: {
  email: string;
  draftId?: string | null;
  verified?: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  const draftId = input.draftId?.trim() || null;
  const verified = Boolean(input.verified);

  if (!email) {
    throw new Error("Missing lead email");
  }

  if (prisma) {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        email: string;
        draftId: string | null;
        verified: boolean;
        purchased: boolean;
        followup30mSent: boolean;
        followup24hSent: boolean;
        followup3dSent: boolean;
        createdAt: Date | string;
      }>
    >(
      Prisma.sql`
        SELECT "id", "email", "draftId", "verified", "purchased", "followup30mSent", "followup24hSent", "followup3dSent", "createdAt"
        FROM "Lead"
        WHERE ${draftId ? Prisma.sql`"draftId" = ${draftId} OR` : Prisma.empty} "email" = ${email}
        ORDER BY "createdAt" DESC
        LIMIT 1
      `
    );

    const existing = rows[0] ?? null;

    if (existing) {
      await prisma.$executeRaw(
        Prisma.sql`
          UPDATE "Lead"
          SET "email" = ${email},
              "draftId" = ${draftId ?? existing.draftId},
              "verified" = ${existing.verified || verified}
          WHERE "id" = ${existing.id}
        `
      );

      return asLeadRecord({
        ...existing,
        email,
        draftId: draftId ?? existing.draftId,
        verified: existing.verified || verified,
      });
    }

    const id = crypto.randomUUID();
    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO "Lead" ("id", "email", "draftId", "verified", "purchased", "followup30mSent", "followup24hSent", "followup3dSent", "createdAt")
        VALUES (${id}, ${email}, ${draftId}, ${verified}, false, false, false, false, CURRENT_TIMESTAMP)
      `
    );

    return asLeadRecord({
      id,
      email,
      draftId,
      verified,
      purchased: false,
      followup30mSent: false,
      followup24hSent: false,
      followup3dSent: false,
      createdAt: nowIso(),
    });
  }

  const all = await listMemoryLeads();
  const existing =
    all.find((lead) => (draftId && lead.draftId === draftId) || lead.email === email) ?? null;

  const lead = existing
    ? asLeadRecord({
        ...existing,
        email,
        draftId: draftId ?? existing.draftId,
        verified: existing.verified || verified,
      })
    : asLeadRecord({
        id: crypto.randomUUID(),
        email,
        draftId,
        verified,
        purchased: false,
        followup30mSent: false,
        followup24hSent: false,
        followup3dSent: false,
        createdAt: nowIso(),
      });

  await storeMemoryLead(lead);
  return lead;
}

export async function markLeadPurchased(input: { email?: string | null; draftId?: string | null }) {
  const email = input.email?.trim().toLowerCase() || null;
  const draftId = input.draftId?.trim() || null;

  if (!email && !draftId) return 0;

  const condition =
    draftId && email
      ? Prisma.sql`"draftId" = ${draftId} OR "email" = ${email}`
      : draftId
      ? Prisma.sql`"draftId" = ${draftId}`
      : Prisma.sql`"email" = ${email!}`;

  if (prisma) {
    return await prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Lead"
        SET "purchased" = true
        WHERE ${condition}
      `
    );
  }

  const all = await listMemoryLeads();
  let updated = 0;
  for (const lead of all) {
    if ((draftId && lead.draftId === draftId) || (email && lead.email === email)) {
      if (!lead.purchased) {
        updated += 1;
        await storeMemoryLead({ ...lead, purchased: true });
      }
    }
  }
  return updated;
}

export async function listDueFollowupCandidates(now = new Date()): Promise<FollowupCandidate[]> {
  const rows = prisma
    ? await prisma.$queryRaw<
        Array<{
          id: string;
          email: string;
          draftId: string | null;
          verified: boolean;
          purchased: boolean;
          followup30mSent: boolean;
          followup24hSent: boolean;
          followup3dSent: boolean;
          createdAt: Date | string;
        }>
      >(
        Prisma.sql`
          SELECT "id", "email", "draftId", "verified", "purchased", "followup30mSent", "followup24hSent", "followup3dSent", "createdAt"
          FROM "Lead"
          WHERE "verified" = true AND "purchased" = false
          ORDER BY "createdAt" ASC
        `
      )
    : await listMemoryLeads();

  const candidates: FollowupCandidate[] = [];
  const nowMs = now.getTime();

  for (const raw of rows) {
    const lead = asLeadRecord(raw);
    if (lead.purchased || !lead.verified) continue;
    const createdAtMs = new Date(lead.createdAt).getTime();
    const ageMs = nowMs - createdAtMs;

    if (ageMs >= 3 * 24 * 60 * 60 * 1000 && !lead.followup3dSent) {
      candidates.push({ lead, stage: "3d" });
      continue;
    }
    if (ageMs >= 24 * 60 * 60 * 1000 && !lead.followup24hSent) {
      candidates.push({ lead, stage: "24h" });
      continue;
    }
    if (ageMs >= 30 * 60 * 1000 && !lead.followup30mSent) {
      candidates.push({ lead, stage: "30m" });
    }
  }

  return candidates;
}

export async function markLeadFollowupSent(id: string, stage: FollowupStage) {
  const field =
    stage === "30m"
      ? Prisma.sql`"followup30mSent" = true`
      : stage === "24h"
      ? Prisma.sql`"followup24hSent" = true`
      : Prisma.sql`"followup3dSent" = true`;

  if (prisma) {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Lead"
        SET ${field}
        WHERE "id" = ${id}
      `
    );
    return;
  }

  const lead = await getPersistentKV<LeadRecord>(leadKey(id));
  if (!lead) return;
  await storeMemoryLead({
    ...lead,
    followup30mSent: stage === "30m" ? true : lead.followup30mSent,
    followup24hSent: stage === "24h" ? true : lead.followup24hSent,
    followup3dSent: stage === "3d" ? true : lead.followup3dSent,
  });
}
