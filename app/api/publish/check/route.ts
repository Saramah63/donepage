import { NextResponse } from "next/server";
import { getProjectById } from "@/app/lib/project-store";
import { smartPublishCheck } from "@/app/lib/draft-validate";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
};

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
    const result = smartPublishCheck(project.draftContent as any);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
