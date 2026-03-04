import { NextResponse } from "next/server";
import {
  addRevisionRequest,
  getProjectById,
  updateProject,
} from "@/app/lib/project-store";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  message?: string;
  section?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();
    const message = (body?.message || "").trim();
    const section = (body?.section || "").trim();

    if (!projectId || !token || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (project.revisionsUsed >= project.revisionsAllowed) {
      return NextResponse.json({ error: "Revision limit reached" }, { status: 400 });
    }

    await addRevisionRequest({
      projectId,
      message,
      section: section || null,
    });

    await updateProject(projectId, {
      revisionsUsed: project.revisionsUsed + 1,
      status: "awaiting_feedback",
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
