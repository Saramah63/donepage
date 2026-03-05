import { NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/app/lib/project-store";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  templateId?: "A" | "B" | "C";
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();
    const templateId = body?.templateId;

    if (!projectId || !token || !templateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!["A", "B", "C"].includes(templateId)) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await updateProject(projectId, { templateId });
    return NextResponse.json({ ok: true, project: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
