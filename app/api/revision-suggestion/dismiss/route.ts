import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { createEvent, updateRevisionSuggestionStatus } from "@/app/lib/project-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    if (!isAdminAuthorized(req, url.searchParams)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isJson = req.headers.get("content-type")?.includes("application/json");
    const body = isJson ? ((await req.json().catch(() => null)) as any) : null;
    const form = !isJson ? await req.formData().catch(() => null) : null;
    const suggestionId = (body?.suggestionId || form?.get("suggestionId") || "").toString().trim();
    const projectId = (body?.projectId || form?.get("projectId") || "").toString().trim();
    if (!suggestionId || !projectId) {
      return NextResponse.json({ error: "Missing suggestionId/projectId" }, { status: 400 });
    }

    await updateRevisionSuggestionStatus(suggestionId, "dismissed");
    await createEvent({
      projectId,
      type: "ai_revision_dismissed",
      message: "AI revision suggestion dismissed.",
      metadata: { suggestionId },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
