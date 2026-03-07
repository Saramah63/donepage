import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { getProjectById, listProjectEvents } from "@/app/lib/project-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = (searchParams.get("projectId") || "").trim();
    const token = (searchParams.get("token") || "").trim();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = isAdminAuthorized(req, searchParams);
    if (!isAdmin && project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const events = await listProjectEvents(projectId, 50);
    return NextResponse.json({ ok: true, events });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
