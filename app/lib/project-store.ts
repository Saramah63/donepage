import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import {
  getPersistentKV as getKV,
  setPersistentKV as setKV,
} from "@/app/lib/persistent-kv";
import type { DraftContent } from "@/app/lib/draft-content";

export type ProjectPlan = "launch" | "growth";
export type ProjectStatus =
  | "received"
  | "instant_ready"
  | "in_production"
  | "preview_ready"
  | "awaiting_feedback"
  | "approved"
  | "published";

export type ProjectRecord = {
  id: string;
  plan: ProjectPlan;
  status: ProjectStatus;
  templateId: "A" | "B" | "C";
  paymentStatus: "unpaid" | "paid";
  publishStatus: "draft" | "approved" | "publishing" | "published";
  publishTarget?: "subdomain" | "custom_domain" | null;
  dnsStatus: "not_started" | "pending" | "verified";
  revisionsAllowed: number;
  revisionsUsed: number;
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
  draftContent?: DraftContent | null;
  basicSeo: boolean;
  priorityDelivery: boolean;
  humanEtaDate: string;
  accessToken: string;
  answers: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type RevisionRequest = {
  id: string;
  projectId: string;
  message: string;
  section?: string | null;
  createdAt: string;
};

export type ProjectEvent = {
  id: string;
  projectId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

const memoryProjects = new Map<string, ProjectRecord>();
const memoryRevisions = new Map<string, RevisionRequest[]>();
const memoryEvents = new Map<string, ProjectEvent[]>();

const PROJECT_KEY_PREFIX = "project:";
const PROJECT_TOKEN_PREFIX = "project:token:";
const PROJECT_INDEX_KEY = "project:index";
const REVISION_PREFIX = "project:revisions:";
const EVENT_PREFIX = "project:events:";

const projectKey = (id: string) => `${PROJECT_KEY_PREFIX}${id}`;
const tokenKey = (token: string) => `${PROJECT_TOKEN_PREFIX}${token}`;
const revisionsKey = (projectId: string) => `${REVISION_PREFIX}${projectId}`;
const eventsKey = (projectId: string) => `${EVENT_PREFIX}${projectId}`;

function makeToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeProject(input: ProjectRecord): ProjectRecord {
  return {
    ...input,
    templateId: (input as any).templateId || "A",
    paymentStatus: (input as any).paymentStatus || "unpaid",
    publishStatus: (input as any).publishStatus || "draft",
    publishTarget: (input as any).publishTarget ?? null,
    dnsStatus: (input as any).dnsStatus || "not_started",
  };
}

export function getPlanConfig(plan: ProjectPlan) {
  return plan === "growth"
    ? { revisionsAllowed: 3, days: 2, basicSeo: true, priorityDelivery: true }
    : { revisionsAllowed: 1, days: 5, basicSeo: false, priorityDelivery: false };
}

export async function createProject(input: {
  plan: ProjectPlan;
  status: ProjectStatus;
  templateId?: "A" | "B" | "C";
  paymentStatus: "unpaid" | "paid";
  publishStatus: "draft" | "approved" | "publishing" | "published";
  publishTarget?: "subdomain" | "custom_domain" | null;
  dnsStatus: "not_started" | "pending" | "verified";
  revisionsAllowed: number;
  revisionsUsed: number;
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
  draftContent?: DraftContent | null;
  basicSeo: boolean;
  priorityDelivery: boolean;
  humanEtaDate: string;
  accessToken: string;
  answers: Record<string, unknown>;
}) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.create({
      data: {
        plan: input.plan,
        status: input.status,
        templateId: input.templateId ?? "A",
        paymentStatus: input.paymentStatus,
        publishStatus: input.publishStatus,
        publishTarget: input.publishTarget ?? null,
        dnsStatus: input.dnsStatus,
        revisionsAllowed: input.revisionsAllowed,
        revisionsUsed: input.revisionsUsed,
        previewUrl: input.previewUrl,
        publishedUrl: input.publishedUrl ?? null,
        domain: input.domain ?? null,
        draftContent: input.draftContent ?? null,
        basicSeo: input.basicSeo,
        priorityDelivery: input.priorityDelivery,
        humanEtaDate: input.humanEtaDate,
        accessToken: input.accessToken,
        answers: input.answers,
      },
    })) as ProjectRecord;
  }

  const id = crypto.randomUUID();
  const record: ProjectRecord = {
    id,
    plan: input.plan,
    status: input.status,
    templateId: input.templateId ?? "A",
    paymentStatus: input.paymentStatus,
    publishStatus: input.publishStatus,
    publishTarget: input.publishTarget ?? null,
    dnsStatus: input.dnsStatus,
    revisionsAllowed: input.revisionsAllowed,
    revisionsUsed: input.revisionsUsed,
    previewUrl: input.previewUrl,
    publishedUrl: input.publishedUrl ?? null,
    domain: input.domain ?? null,
    draftContent: input.draftContent ?? null,
    basicSeo: input.basicSeo,
    priorityDelivery: input.priorityDelivery,
    humanEtaDate: input.humanEtaDate,
    accessToken: input.accessToken,
    answers: input.answers,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  memoryProjects.set(id, record);
  try {
    const list = (await getKV<string[]>(PROJECT_INDEX_KEY)) ?? [];
    const nextList = [id, ...list.filter((item) => item !== id)];
    await setKV(projectKey(id), record);
    await setKV(tokenKey(record.accessToken), id);
    await setKV(PROJECT_INDEX_KEY, nextList);
  } catch {
    // KV fallback is handled inside persistent-kv
  }
  return record;
}

export async function getProjectById(id: string) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.findUnique({ where: { id } })) as
      | ProjectRecord
      | null;
  }
  const fromKV = await getKV<ProjectRecord>(projectKey(id));
  if (fromKV) return normalizeProject(fromKV);
  const fromMem = memoryProjects.get(id);
  return fromMem ? normalizeProject(fromMem) : null;
}

export async function getProjectByToken(token: string) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.findFirst({
      where: { accessToken: token },
    })) as ProjectRecord | null;
  }
  const id = await getKV<string>(tokenKey(token));
  if (id) {
    const found = await getKV<ProjectRecord>(projectKey(id));
    if (found) return normalizeProject(found);
  }
  for (const record of memoryProjects.values()) {
    if (record.accessToken === token) return normalizeProject(record);
  }
  return null;
}

export async function listProjects() {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.findMany({
      orderBy: { createdAt: "desc" },
    })) as ProjectRecord[];
  }
  const ids = (await getKV<string[]>(PROJECT_INDEX_KEY)) ?? [];
  const items = await Promise.all(ids.map((id) => getKV<ProjectRecord>(projectKey(id))));
  return items.filter(Boolean).map((p) => normalizeProject(p as ProjectRecord));
}

export async function updateProject(id: string, patch: Partial<ProjectRecord>) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.update({
      where: { id },
      data: { ...patch },
    })) as ProjectRecord;
  }
  const existing =
    (await getKV<ProjectRecord>(projectKey(id))) ?? memoryProjects.get(id);
  if (!existing) return null;
  const next = normalizeProject({ ...existing, ...patch, updatedAt: nowIso() });
  memoryProjects.set(id, next);
  try {
    await setKV(projectKey(id), next);
  } catch {
    // KV fallback handled in persistent-kv
  }
  return next;
}

export async function addRevisionRequest(input: {
  projectId: string;
  message: string;
  section?: string | null;
}) {
  const prismaAny = prisma as any;
  if (prismaAny?.revisionRequest) {
    return (await prismaAny.revisionRequest.create({
      data: {
        projectId: input.projectId,
        message: input.message,
        section: input.section ?? null,
      },
    })) as RevisionRequest;
  }
  const record: RevisionRequest = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    message: input.message,
    section: input.section ?? null,
    createdAt: nowIso(),
  };
  const list =
    (await getKV<RevisionRequest[]>(revisionsKey(input.projectId))) ??
    memoryRevisions.get(input.projectId) ??
    [];
  const nextList = [record, ...list];
  memoryRevisions.set(input.projectId, nextList);
  try {
    await setKV(revisionsKey(input.projectId), nextList);
  } catch {
    // KV fallback handled in persistent-kv
  }
  return record;
}

export async function listRevisions(projectId: string) {
  const prismaAny = prisma as any;
  if (prismaAny?.revisionRequest) {
    return (await prismaAny.revisionRequest.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    })) as RevisionRequest[];
  }
  const list = await getKV<RevisionRequest[]>(revisionsKey(projectId));
  if (list) return list;
  return memoryRevisions.get(projectId) ?? [];
}

export async function createEvent(input: {
  projectId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown> | null;
}) {
  const prismaAny = prisma as any;
  if (prismaAny?.projectEvent) {
    return (await prismaAny.projectEvent.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        message: input.message,
        metadata: input.metadata ?? null,
      },
    })) as ProjectEvent;
  }
  const record: ProjectEvent = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    type: input.type,
    message: input.message,
    metadata: input.metadata ?? null,
    createdAt: nowIso(),
  };
  const list =
    (await getKV<ProjectEvent[]>(eventsKey(input.projectId))) ??
    memoryEvents.get(input.projectId) ??
    [];
  const nextList = [record, ...list];
  memoryEvents.set(input.projectId, nextList);
  try {
    await setKV(eventsKey(input.projectId), nextList);
  } catch {
    // KV fallback handled in persistent-kv
  }
  return record;
}

export async function listProjectEvents(projectId: string, limit = 20) {
  const prismaAny = prisma as any;
  if (prismaAny?.projectEvent) {
    return (await prismaAny.projectEvent.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as ProjectEvent[];
  }
  const list = await getKV<ProjectEvent[]>(eventsKey(projectId));
  const out = list ?? memoryEvents.get(projectId) ?? [];
  return out.slice(0, limit);
}

export function makeAccessToken() {
  return makeToken();
}
