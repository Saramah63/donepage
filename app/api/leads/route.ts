import { NextResponse } from "next/server";
import { upsertLead } from "@/app/lib/leads";
import { getProjectById } from "@/app/lib/project-store";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = body?.projectId?.trim() || "";
    const token = body?.token?.trim() || "";

    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing project access" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Invalid project access" }, { status: 403 });
    }

    const email = typeof project.answers?.contactEmail === "string" ? project.answers.contactEmail.trim() : "";
    if (!email) {
      return NextResponse.json({ error: "Project email missing" }, { status: 400 });
    }

    const lead = await upsertLead({
      email,
      draftId: project.id,
      verified: true,
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Lead capture failed" },
      { status: 500 }
    );
  }
}
