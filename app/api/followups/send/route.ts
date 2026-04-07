import { NextResponse } from "next/server";
import { sendMail } from "@/app/lib/mail";
import { getProjectById } from "@/app/lib/project-store";
import { listDueFollowupCandidates, markLeadFollowupSent } from "@/app/lib/leads";
import { renderFollowup30MinEmail } from "@/emails/followup-30min";
import { renderFollowup24hEmail } from "@/emails/followup-24h";
import { renderFollowup3dEmail } from "@/emails/followup-3d";

export const runtime = "nodejs";

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

function isAuthorized(req: Request) {
  const configured = process.env.FOLLOWUPS_SECRET?.trim();
  if (!configured) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token === configured;
}

function getPreviewUrl(projectId: string, token?: string | null) {
  if (!projectId || !token) return "";
  return `${getBaseUrl()}/draft/${projectId}?token=${encodeURIComponent(token)}`;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const from = process.env.EMAIL_FROM?.trim() || "Donepage <onboarding@resend.dev>";
    const candidates = await listDueFollowupCandidates();
    const results: Array<{ leadId: string; email: string; stage: string; ok: boolean }> = [];

    for (const candidate of candidates) {
      const lead = candidate.lead;
      const project = lead.draftId ? await getProjectById(lead.draftId) : null;
      const previewUrl = getPreviewUrl(lead.draftId || "", project?.accessToken || null);

      const template =
        candidate.stage === "30m"
          ? renderFollowup30MinEmail(previewUrl)
          : candidate.stage === "24h"
          ? renderFollowup24hEmail(previewUrl)
          : renderFollowup3dEmail(previewUrl);

      const mailResult = await sendMail({
        from,
        to: lead.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      if (mailResult.ok) {
        await markLeadFollowupSent(lead.id, candidate.stage);
      }

      results.push({
        leadId: lead.id,
        email: lead.email,
        stage: candidate.stage,
        ok: mailResult.ok,
      });
    }

    return NextResponse.json({
      ok: true,
      processed: results.length,
      sent: results.filter((item) => item.ok).length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Follow-up send failed" },
      { status: 500 }
    );
  }
}
