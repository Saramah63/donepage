import { NextResponse } from "next/server";
import {
  addRevisionRequest,
  addRevisionSuggestion,
  createEvent,
  getProjectById,
  updateProject,
} from "@/app/lib/project-store";
import { generateRevisionSuggestionAI } from "@/app/lib/revision-suggestions";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function buildTransport() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: { user: "resend", pass: apiKey },
  });
}

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

    console.log("REVISION: request received", { projectId, section, message });

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

    const revision = await addRevisionRequest({
      projectId,
      message,
      section: section || null,
    });
    console.log("REVISION: saved", revision.id);

    await createEvent({
      projectId,
      type: "revision_requested",
      message: "Revision requested by client.",
      metadata: { section: section || null },
    });

    await updateProject(projectId, {
      revisionsUsed: project.revisionsUsed + 1,
      status: "awaiting_feedback",
    });

    let suggestionReady = false;
    try {
      const suggestionDraft = await generateRevisionSuggestionAI({ project, revision });
      if (suggestionDraft) {
        await addRevisionSuggestion({
          revisionRequestId: revision.id,
          projectId: project.id,
          section: suggestionDraft.section,
          field: suggestionDraft.field,
          originalValue: suggestionDraft.originalValue ?? null,
          suggestedValue: suggestionDraft.suggestedValue,
          reason: suggestionDraft.reason,
        });
        await createEvent({
          projectId: project.id,
          type: "ai_revision_generated",
          message: "AI revision suggestion generated.",
          metadata: { section: suggestionDraft.section, field: suggestionDraft.field },
        });
        suggestionReady = true;
      }
    } catch {
      // ignore suggestion failures
    }

    try {
      console.log("REVISION: sending revision email");
      const clientEmail =
        (project as any)?.answers?.contactEmail ||
        (project as any)?.draftContent?.contact?.email ||
        "not provided";
      const base = (process.env.NEXT_PUBLIC_APP_URL || "https://donepage.co").replace(/\/$/, "");
      const rawPreviewUrl =
        project.previewUrl || `/preview/${project.id}?token=${encodeURIComponent(project.accessToken)}`;
      const previewUrl = rawPreviewUrl.startsWith("http") ? rawPreviewUrl : `${base}${rawPreviewUrl}`;
      const editUrl = `${base}/preview/${project.id}?token=${encodeURIComponent(project.accessToken)}`;

      const from = process.env.EMAIL_FROM;
      const to = process.env.CONTACT_TO || process.env.ADMIN_EMAIL || "saramah63@gmail.com";
      const transport = buildTransport();

      if (!from || !transport) {
        console.error("REVISION: revision email failed", "Email transport not configured");
      } else {
        const subject = "Revision Request — Donepage";
        const text = [
          `Client email: ${clientEmail}`,
          `Plan: ${project.plan}`,
          `Section: ${section || "-"}`,
          "",
          message,
          "",
          `Preview URL: ${previewUrl}`,
          `Direct edit URL: ${editUrl}`,
        ].join("\n");
        const html = `
          <p><strong>Client email:</strong> ${clientEmail}</p>
          <p><strong>Plan:</strong> ${project.plan}</p>
          <p><strong>Section:</strong> ${section || "-"}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Preview URL:</strong> ${previewUrl}</p>
          <p><strong>Direct edit URL:</strong> ${editUrl}</p>
        `;
        const info = await transport.sendMail({ from, to, subject, text, html });
        console.log("REVISION: revision email sent", info?.messageId || "ok");
      }
    } catch (error) {
      console.error("REVISION: revision email failed", error);
      // Do not block revision request if email fails
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
