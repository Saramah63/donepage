import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { getProjectById, listRevisionSuggestions } from "@/app/lib/project-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = (url.searchParams.get("projectId") || "").trim();
    const token = (url.searchParams.get("token") || "").trim();
    if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

    const project = await getProjectById(projectId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!isAdminAuthorized(req, url.searchParams) && token !== project.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const suggestions = await listRevisionSuggestions(projectId);
    return NextResponse.json({ suggestions });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
