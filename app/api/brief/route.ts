import { NextResponse } from "next/server";
import { isSlugTaken, saveDraftVersion, setEditTokenForSlug } from "@/app/lib/answers-store";
import { briefToQuestionnaireAnswers } from "@/app/lib/brief-to-answers";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import nodemailer from "nodemailer";
import {
  createOrder,
  getBaseUrl,
  makeAccessToken,
  updateOrder,
  type OrderPlan,
} from "@/app/lib/order-store";

export const runtime = "nodejs";

type BriefBody = {
  paid?: string | number | boolean;
  sessionId?: string;
  plan?: OrderPlan;
  customerEmail?: string;
  customerName?: string;
  businessName?: string;
  websiteGoal?: string;
  targetAudience?: string;
  mainOffer?: string;
  problemSolved?: string;
  desiredCTA?: string;
  brandColors?: string;
  domain?: string;
  deadline?: "normal" | "urgent";
  hostingAddOn?: boolean;
  fullAnswers?: QuestionnaireAnswers;
};

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

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function createUniqueDraftSlug(businessName: string) {
  const base = sanitizeSlug(businessName) || "donepage";
  for (let i = 0; i < 12; i += 1) {
    const suffix = Math.random().toString(36).slice(2, 8);
    const candidate = `${base}-${suffix}`;
    // eslint-disable-next-line no-await-in-loop
    const taken = await isSlugTaken(candidate);
    if (!taken) return candidate;
  }
  return `${base}-${Date.now().toString(36).slice(-6)}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as BriefBody | null;

    const paidRaw = String(body?.paid ?? "").toLowerCase();
    const isPaid = paidRaw === "1" || paidRaw === "true";
    const sessionId = (body?.sessionId ?? "").trim();
    const plan = body?.plan === "growth" ? "growth" : "launch";
    const fullAnswers =
      body?.fullAnswers && typeof body.fullAnswers === "object"
        ? (body.fullAnswers as QuestionnaireAnswers)
        : null;

    const customerEmail = (body?.customerEmail ?? fullAnswers?.contactEmail ?? "")
      .trim()
      .toLowerCase();
    const customerName = (body?.customerName ?? "").trim();
    const businessName = (body?.businessName ?? fullAnswers?.businessName ?? "").trim();
    const websiteGoal = (body?.websiteGoal ?? fullAnswers?.primaryGoal ?? "").trim();
    const targetAudience = (body?.targetAudience ?? fullAnswers?.targetAudience ?? "").trim();
    const mainOffer = (
      body?.mainOffer ??
      fullAnswers?.primaryOffer ??
      fullAnswers?.customServices ??
      ""
    ).trim();
    const problemSolved = (body?.problemSolved ?? fullAnswers?.problemStatement ?? "").trim();
    const desiredCTA = (
      body?.desiredCTA ??
      fullAnswers?.ctaPrimaryLabel ??
      (fullAnswers?.bookingLink ? "Book a call" : "")
    ).trim();
    const brandColors = (body?.brandColors ?? "").trim();
    const domain = (body?.domain ?? "").trim();
    const deadline = (body?.deadline ?? "normal").trim();

    if (
      !customerEmail ||
      !businessName ||
      !websiteGoal ||
      !targetAudience ||
      !mainOffer ||
      !problemSolved ||
      !desiredCTA
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const draftSlug = await createUniqueDraftSlug(businessName);
    const accessToken = makeAccessToken();
    const answers =
      fullAnswers ??
      briefToQuestionnaireAnswers({
        businessName,
        websiteGoal,
        targetAudience,
        mainOffer,
        problemSolved,
        desiredCTA,
        customerEmail,
        brandColors,
        domain,
      });

    await saveDraftVersion(draftSlug, answers, "Auto draft from paid brief");
    await setEditTokenForSlug(draftSlug, accessToken);

    const base = getBaseUrl();
    const draftUrl = `${base}/preview?order=__PENDING__&token=${encodeURIComponent(accessToken)}`;

    const order = await createOrder({
      customerEmail,
      customerName: customerName || null,
      businessName,
      plan,
      hostingAddOn: Boolean(body?.hostingAddOn),
      paymentStatus: isPaid ? "paid" : "unpaid",
      fulfillmentStatus: "draft_generated",
      paymentSessionId: sessionId || null,
      draftSlug,
      draftUrl,
      accessToken,
      briefAnswers: {
        websiteGoal,
        targetAudience,
        mainOffer,
        problemSolved,
        desiredCTA,
        brandColors,
        domain,
        deadline,
        fullAnswers: fullAnswers ?? null,
      },
      draftGeneratedAt: new Date().toISOString(),
    });

    const privatePreviewUrl = `${base}/preview?order=${encodeURIComponent(
      order.id
    )}&token=${encodeURIComponent(accessToken)}`;

    await updateOrder(order.id, {
      draftUrl: privatePreviewUrl,
      fulfillmentStatus: isPaid ? "qa_pending" : "draft_generated",
    });

    console.log("order_created", { orderId: order.id, plan, paymentSessionId: sessionId });
    console.log("draft_generated", { orderId: order.id, draftSlug });

    try {
      const from = process.env.EMAIL_FROM;
      const transport = buildTransport();
      if (from && transport) {
        await transport.sendMail({
          from,
          to: "saramah63@gmail.com",
          subject: `New Donepage Brief - ${businessName}`,
          text: [
            `Order: ${order.id}`,
            `Plan: ${plan}`,
            `Customer: ${customerName || "N/A"} <${customerEmail}>`,
            `Business: ${businessName}`,
            `Goal: ${websiteGoal}`,
            `Offer: ${mainOffer}`,
            `Problem: ${problemSolved}`,
            `CTA: ${desiredCTA}`,
            `Draft: ${privatePreviewUrl}`,
            `Admin: ${getBaseUrl()}/admin`,
          ].join("\n"),
        });
      }
    } catch {}

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      draftSlug,
      draftUrl: privatePreviewUrl,
      previewUrl: `/preview?order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(accessToken)}`,
      accessToken,
      checkoutUrl: `/api/checkout?plan=${plan}&order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(accessToken)}`,
      paymentStatus: isPaid ? "paid" : "unpaid",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to submit brief" },
      { status: 500 }
    );
  }
}
