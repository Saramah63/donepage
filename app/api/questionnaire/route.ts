import { NextResponse } from "next/server";
import { addBusinessDays, formatYmdISO } from "@/app/lib/business-days";
import { getVerifiedEmailFromCookie } from "@/app/lib/email-verification";
import {
  createProject,
  createEvent,
  getPlanConfig,
  makeAccessToken,
  type ProjectPlan,
} from "@/app/lib/project-store";
import type { DraftContent } from "@/app/lib/draft-content";
import { buildInstantDraft } from "@/app/lib/instant-draft";

export const runtime = "nodejs";

type Body = {
  plan?: ProjectPlan;
  answers?: Record<string, unknown>;
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function mapAudience(input: string) {
  const value = input.toLowerCase();
  if (value.includes("enterprise") || value.includes("corporate")) return "enterprise";
  if (value.includes("agency") || value.includes("company") || value.includes("business")) return "small-business";
  if (value.includes("consultant") || value.includes("coach") || value.includes("freelancer")) return "freelancers";
  return "individuals";
}

function mapGoal(input: string) {
  const value = input.toLowerCase();
  if (value.includes("buy")) return "packages";
  if (value.includes("apply")) return "credibility";
  if (value.includes("message")) return "leads";
  return "calls";
}

function normalizeAnswers(input: Record<string, unknown>) {
  const primaryOffer = textValue(input.primaryOffer);
  const targetAudience = textValue(input.targetAudience);
  const outcomeStatement = textValue(input.outcomeStatement);
  const problemStatement = textValue(input.problemStatement);
  const trustFactor = textValue(input.trustFactor);
  const desiredAction = textValue(input.desiredAction);
  const tone = textValue(input.tone);
  const businessName = textValue(input.businessName);
  const clientName = textValue(input.clientName);
  const contactEmail = textValue(input.contactEmail);

  return {
    ...input,
    language: textValue(input.language) || "English",
    businessName,
    clientName,
    contactEmail,
    primaryOffer,
    targetAudience,
    outcomeStatement,
    problemStatement,
    trustFactor,
    desiredAction,
    tone,
    serviceType: "consulting",
    targetAudienceType: mapAudience(targetAudience),
    businessStage: "established",
    primaryGoal: mapGoal(desiredAction),
    primaryGoals: [mapGoal(desiredAction)],
    experienceLevel: "expert",
    pricingApproach: tone === "premium" ? "premium" : "competitive",
    keyDifferentiator: "results",
    includeAbout: "no",
    proofLine: trustFactor,
    niche: targetAudience,
    processStep1: "Structured intake",
    processStep2: "AI draft + expert refinement",
    processStep3: "Launch-ready page",
    ctaPrimaryLabel:
      desiredAction === "send_message"
        ? "Send a message"
        : desiredAction === "buy"
        ? "Buy now"
        : desiredAction === "apply"
        ? "Apply now"
        : "Book a call",
  };
}

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

    const verifiedEmail = await getVerifiedEmailFromCookie();
    if (!verifiedEmail) {
      return NextResponse.json({ error: "Email verification required." }, { status: 403 });
    }
    const normalizedAnswers = normalizeAnswers(answers);
    (normalizedAnswers as any).contactEmail = verifiedEmail;

    const config = getPlanConfig(plan);
    const eta = addBusinessDays(new Date(), config.days, "Europe/Helsinki");
    const humanEtaDate = formatYmdISO(eta);
    const token = makeAccessToken();

    const base = getBaseUrl(req);

    const email = String((normalizedAnswers as any)?.contactEmail || "").trim();
    const booking = String((normalizedAnswers as any)?.bookingLink || "").trim();
    const ctaLink = email ? `mailto:${email}` : booking ? `https://${booking.replace(/^https?:\/\//, "")}` : "";
    const draftContent: DraftContent = buildInstantDraft({
      offer: String((normalizedAnswers as any)?.primaryOffer || ""),
      audience: String((normalizedAnswers as any)?.targetAudience || ""),
      outcome: String((normalizedAnswers as any)?.outcomeStatement || ""),
      problem: String((normalizedAnswers as any)?.problemStatement || ""),
      trust: String((normalizedAnswers as any)?.trustFactor || ""),
      cta: String((normalizedAnswers as any)?.desiredAction || ""),
      tone: String((normalizedAnswers as any)?.tone || ""),
      answers: normalizedAnswers as any,
      plan,
      ctaLink,
    });

    const project = await createProject({
      plan,
      status: "instant_ready",
      paymentStatus: "unpaid",
      publishStatus: "draft",
      publishTarget: null,
      dnsStatus: (normalizedAnswers as any)?.domain ? "pending" : "not_started",
      revisionsAllowed: config.revisionsAllowed,
      revisionsUsed: 0,
      previewUrl: "",
      publishedUrl: null,
      domain: (normalizedAnswers as any)?.domain ?? null,
      draftContent,
      basicSeo: config.basicSeo,
      priorityDelivery: config.priorityDelivery,
      humanEtaDate,
      accessToken: token,
      answers: normalizedAnswers,
    });

    await createEvent({
      projectId: project.id,
      type: "project_created",
      message: "Project created from questionnaire submission.",
      metadata: { plan },
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
