import { NextResponse } from "next/server";
import { getProjectById, getProjectByToken, listRevisions } from "@/app/lib/project-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") || "").trim();
    const projectId = (searchParams.get("projectId") || "").trim();
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const project = projectId
      ? await getProjectById(projectId)
      : await getProjectByToken(token);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const revisions = await listRevisions(project.id);

    return NextResponse.json({
      ok: true,
      project,
      revisions,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
