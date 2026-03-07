import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import {
  createEvent,
  getProjectById,
  getRevisionSuggestionById,
  updateProject,
  updateRevisionSuggestionStatus,
} from "@/app/lib/project-store";

export const runtime = "nodejs";

function applySuggestionToDraft(draft: any, suggestion: any) {
  const next = { ...(draft || {}) };
  const section = suggestion.section;
  const field = suggestion.field;
  const value = suggestion.suggestedValue;

  if (section === "hero") {
    next.hero = { ...(next.hero || {}) };
    next.hero[field] = value;
    return next;
  }

  if (section === "cta") {
    next.cta = { ...(next.cta || {}) };
    next.cta[field] = value;
    return next;
  }

  if (section === "contact") {
    next.contact = { ...(next.contact || {}) };
    next.contact[field] = value;
    return next;
  }

  if (section === "benefits") {
    const match = field.match(/benefits\[(\d+)\]\.(title|description)/);
    const idx = match ? Number(match[1]) : 0;
    const key = match ? match[2] : "description";
    const list = Array.isArray(next.benefits) ? [...next.benefits] : [];
    list[idx] = { ...(list[idx] || { title: "", description: "" }), [key]: value };
    next.benefits = list;
    return next;
  }

  if (section === "faq") {
    const match = field.match(/faq\[(\d+)\]\.(question|answer)/);
    const idx = match ? Number(match[1]) : 0;
    const key = match ? match[2] : "question";
    const list = Array.isArray(next.faq) ? [...next.faq] : [];
    list[idx] = { ...(list[idx] || { question: "", answer: "" }), [key]: value };
    next.faq = list;
    return next;
  }

  return next;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const isJson = req.headers.get("content-type")?.includes("application/json");
    const body = isJson ? ((await req.json().catch(() => null)) as any) : null;
    const form = !isJson ? await req.formData().catch(() => null) : null;
    const projectId = (body?.projectId || form?.get("projectId") || "").toString().trim();
    const suggestionId = (body?.suggestionId || form?.get("suggestionId") || "").toString().trim();
    const token = (body?.token || form?.get("token") || "").toString().trim();

    if (!projectId || !suggestionId) {
      return NextResponse.json({ error: "Missing projectId/suggestionId" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!isAdminAuthorized(req, url.searchParams) && token !== project.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const suggestion = await getRevisionSuggestionById(suggestionId);
    if (!suggestion) return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });

    const updatedDraft = applySuggestionToDraft(project.draftContent, suggestion);
    await updateProject(projectId, { draftContent: updatedDraft });
    await updateRevisionSuggestionStatus(suggestionId, "accepted");
    await createEvent({
      projectId,
      type: "ai_revision_applied",
      message: "AI revision suggestion applied.",
      metadata: { suggestionId },
    });

    return NextResponse.json({ ok: true, draftContent: updatedDraft });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
