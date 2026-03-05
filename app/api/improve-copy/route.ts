import { NextResponse } from "next/server";
import { getProjectById } from "@/app/lib/project-store";
import { sanitizeText } from "@/app/lib/draft-validate";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  fields?: Array<"headline" | "subheadline" | "benefits" | "cta">;
};

function improveHeadline(text: string) {
  const base = sanitizeText(text, 80);
  if (!base) return "";
  return base.length < 20 ? `Professional solutions for ${base}` : base;
}

function improveSubheadline(text: string) {
  const base = sanitizeText(text, 200);
  if (!base) return "";
  return base;
}

function improveBenefit(text: string) {
  return sanitizeText(text, 140);
}

function improveCta(text: string) {
  const base = sanitizeText(text, 40);
  if (!base) return "Book a free consultation";
  return base;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();
    const fields = body?.fields || [];

    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const draft = project.draftContent as any;
    const result: Record<string, any> = {};

    if (fields.includes("headline")) {
      result.headline = improveHeadline(draft?.hero?.headline || "");
    }
    if (fields.includes("subheadline")) {
      result.subheadline = improveSubheadline(draft?.hero?.subheadline || "");
    }
    if (fields.includes("benefits")) {
      const list = (draft?.benefits || []).slice(0, 6);
      result.benefits = list.map((b: any) => improveBenefit(b?.description || ""));
    }
    if (fields.includes("cta")) {
      result.ctaText = improveCta(draft?.hero?.ctaText || draft?.cta?.buttonText || "");
    }

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
