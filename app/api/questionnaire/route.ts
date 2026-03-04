import { NextResponse } from "next/server";
import { addBusinessDays, formatYmdISO } from "@/app/lib/business-days";
import {
  createProject,
  getPlanConfig,
  makeAccessToken,
  type ProjectPlan,
} from "@/app/lib/project-store";
import type { DraftContent } from "@/app/lib/draft-content";

export const runtime = "nodejs";

type Body = {
  plan?: ProjectPlan;
  answers?: Record<string, unknown>;
};

function getBaseUrl(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ??
    new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const plan = (body?.plan || "") as ProjectPlan;
    if (!plan || !["launch", "growth"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const answers = (body?.answers && typeof body.answers === "object") ? body.answers : null;
    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const config = getPlanConfig(plan);
    const eta = addBusinessDays(new Date(), config.days, "Europe/Helsinki");
    const humanEtaDate = formatYmdISO(eta);
    const token = makeAccessToken();

    const base = getBaseUrl(req);

    const draftContent: DraftContent = {
      answers: answers as any,
      overrides: {},
    };

    const project = await createProject({
      plan,
      status: "instant_ready",
      paymentStatus: "unpaid",
      publishStatus: "draft",
      publishTarget: null,
      dnsStatus: (answers as any)?.domain ? "pending" : "not_started",
      revisionsAllowed: config.revisionsAllowed,
      revisionsUsed: 0,
      previewUrl: "",
      publishedUrl: null,
      domain: (answers as any)?.domain ?? null,
      draftContent,
      basicSeo: config.basicSeo,
      priorityDelivery: config.priorityDelivery,
      humanEtaDate,
      accessToken: token,
      answers,
    });

    const previewUrl = `${base}/preview/${project.id}?token=${encodeURIComponent(token)}`;
    const portalUrl = `${base}/portal?token=${encodeURIComponent(token)}`;
    const submittedUrl = `${base}/submitted?plan=${plan}&projectId=${project.id}&token=${encodeURIComponent(token)}&eta=${encodeURIComponent(humanEtaDate)}`;

    await createProjectUpdate(project.id, { previewUrl });

    return NextResponse.json({
      ok: true,
      projectId: project.id,
      token,
      previewUrl,
      portalUrl,
      submittedUrl,
      eta: humanEtaDate,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Submission failed" },
      { status: 500 }
    );
  }
}

async function createProjectUpdate(id: string, patch: Record<string, unknown>) {
  const { updateProject } = await import("@/app/lib/project-store");
  await updateProject(id, patch as any);
}
