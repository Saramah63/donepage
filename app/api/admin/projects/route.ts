import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { listProjects, listProjectEvents, listRevisions } from "@/app/lib/project-store";

export const runtime = "nodejs";

function getEmail(project: any) {
  const fromDraft = project?.draftContent?.contact?.email;
  const fromAnswers = project?.answers?.contactEmail || project?.answers?.email;
  return (fromDraft || fromAnswers || "").toString();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    if (!isAdminAuthorized(req, url.searchParams)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await listProjects();
    const revisionsList = await Promise.all(
      projects.map(async (p) => {
        try {
          const list = await listRevisions(p.id);
          return list;
        } catch {
          return [];
        }
      })
    );
    const eventsList = await Promise.all(
      projects.map(async (p) => {
        try {
          return await listProjectEvents(p.id, 5);
        } catch {
          return [];
        }
      })
    );

    const out = projects.map((p, idx) => ({
      id: p.id,
      email: getEmail(p),
      plan: p.plan,
      paymentStatus: p.paymentStatus,
      status: p.status,
      previewUrl: p.previewUrl || `/preview/${p.id}?token=${encodeURIComponent(p.accessToken)}`,
      publishedUrl: p.publishedUrl || null,
      revisionsCount: revisionsList[idx]?.length || 0,
      revisions: (revisionsList[idx] || []).slice(0, 5),
      events: (eventsList[idx] || []).slice(0, 5),
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ projects: out });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
