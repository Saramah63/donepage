import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

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
  revisionsAllowed: number;
  revisionsUsed: number;
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
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

const memoryProjects = new Map<string, ProjectRecord>();
const memoryRevisions = new Map<string, RevisionRequest[]>();

function makeToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function nowIso() {
  return new Date().toISOString();
}

export function getPlanConfig(plan: ProjectPlan) {
  return plan === "growth"
    ? { revisionsAllowed: 3, days: 2, basicSeo: true, priorityDelivery: true }
    : { revisionsAllowed: 1, days: 5, basicSeo: false, priorityDelivery: false };
}

export async function createProject(input: {
  plan: ProjectPlan;
  status: ProjectStatus;
  revisionsAllowed: number;
  revisionsUsed: number;
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
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
        revisionsAllowed: input.revisionsAllowed,
        revisionsUsed: input.revisionsUsed,
        previewUrl: input.previewUrl,
        publishedUrl: input.publishedUrl ?? null,
        domain: input.domain ?? null,
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
    revisionsAllowed: input.revisionsAllowed,
    revisionsUsed: input.revisionsUsed,
    previewUrl: input.previewUrl,
    publishedUrl: input.publishedUrl ?? null,
    domain: input.domain ?? null,
    basicSeo: input.basicSeo,
    priorityDelivery: input.priorityDelivery,
    humanEtaDate: input.humanEtaDate,
    accessToken: input.accessToken,
    answers: input.answers,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  memoryProjects.set(id, record);
  return record;
}

export async function getProjectById(id: string) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.findUnique({ where: { id } })) as
      | ProjectRecord
      | null;
  }
  return memoryProjects.get(id) ?? null;
}

export async function getProjectByToken(token: string) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.findFirst({
      where: { accessToken: token },
    })) as ProjectRecord | null;
  }
  for (const record of memoryProjects.values()) {
    if (record.accessToken === token) return record;
  }
  return null;
}

export async function updateProject(id: string, patch: Partial<ProjectRecord>) {
  const prismaAny = prisma as any;
  if (prismaAny?.project) {
    return (await prismaAny.project.update({
      where: { id },
      data: { ...patch },
    })) as ProjectRecord;
  }
  const existing = memoryProjects.get(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, updatedAt: nowIso() };
  memoryProjects.set(id, next);
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
  const list = memoryRevisions.get(input.projectId) ?? [];
  list.push(record);
  memoryRevisions.set(input.projectId, list);
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
  return memoryRevisions.get(projectId) ?? [];
}

export function makeAccessToken() {
  return makeToken();
}
