import { NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/app/lib/project-store";
import type { DraftContent, DraftOverrides } from "@/app/lib/draft-content";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  patch?: Partial<DraftContent>;
};

const ALLOWED_OVERRIDE_FIELDS: Array<keyof DraftOverrides> = [
  "heroHeadline",
  "heroSubheadline",
  "heroPrimaryCTA",
  "heroSecondaryCTA",
  "ctaHeadline",
  "ctaSubheadline",
  "ctaButtonText",
  "ctaButtonUrl",
  "contactTitle",
  "contactSubtitle",
  "contactEmail",
  "contactPhone",
  "contactWhatsApp",
  "contactBookingLink",
  "benefits",
  "faq",
];

function sanitizeText(value: unknown, max = 240) {
  if (typeof value !== "string") return "";
  const stripped = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return stripped.slice(0, max);
}

function sanitizeOverrides(input: Partial<DraftOverrides> = {}) {
  const out: Partial<DraftOverrides> = {};
  for (const key of ALLOWED_OVERRIDE_FIELDS) {
    if (!(key in input)) continue;
    const value = (input as any)[key];
    if (key === "benefits" && Array.isArray(value)) {
      out.benefits = value.slice(0, 6).map((item: any) => ({
        title: sanitizeText(item?.title, 80),
        description: sanitizeText(item?.description, 180),
      }));
      continue;
    }
    if (key === "faq" && Array.isArray(value)) {
      out.faq = value.slice(0, 6).map((item: any) => ({
        question: sanitizeText(item?.question, 120),
        answer: sanitizeText(item?.answer, 200),
      }));
      continue;
    }
    out[key] = sanitizeText(value, key.includes("Url") ? 500 : 240);
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();
    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const patch = body?.patch ?? {};
    const existing = (project.draftContent as DraftContent | null) ?? {
      answers: project.answers as any,
      overrides: {},
    };
    const nextOverrides = sanitizeOverrides(patch.overrides || {});

    const merged: DraftContent = {
      answers: existing.answers,
      overrides: {
        ...(existing.overrides || {}),
        ...nextOverrides,
      },
    };

    const updated = await updateProject(projectId, { draftContent: merged });
    return NextResponse.json({ ok: true, draftContent: updated?.draftContent ?? merged });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
