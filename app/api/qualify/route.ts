import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getTemplateByIndustry } from "@/app/lib/qualification/templates";
import { scoreAnswers } from "@/app/lib/qualification/scoring";
import { buildQualificationResult } from "@/app/lib/qualification/decision";
import { checkRateLimit, hashIp } from "@/app/lib/qualification/rate-limit";
import { qualifyBodySchema } from "@/app/lib/qualification/validators";
import type { Answers } from "@/app/lib/qualification/types";

export const runtime = "nodejs";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function getClientIp(req: Request, visitorIp?: string) {
  if (visitorIp) return visitorIp;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function redactFreeText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted_email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[redacted_phone]");
}

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    const parsed = qualifyBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const slug = sanitizeSlug(body.slug);
    if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

    const clientIp = getClientIp(req, body.visitor?.ip);
    const ipHash = hashIp(clientIp);
    const allowed = await checkRateLimit(ipHash);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const answers = body.answers as Answers;
    const template = getTemplateByIndustry(body.context.industry);
    const fitScore = scoreAnswers(template, answers, body.context);
    const keySignals: string[] = [];
    const redFlags: string[] = [];

    for (const q of template.questions) {
      const selected = q.options.find((o) => o.value === answers[q.id]);
      if (!selected) continue;
      if (selected.signal) keySignals.push(selected.signal);
      if (selected.redFlag) redFlags.push(`${q.id}:${selected.value}`);
    }

    const safeAnswers = Object.fromEntries(
      Object.entries(answers).map(([k, v]) => {
        if (typeof v === "string") return [k, redactFreeText(v)];
        if (Array.isArray(v)) return [k, v.map((x) => redactFreeText(x))];
        return [k, v];
      })
    ) as Answers;

    const result = buildQualificationResult({
      score: fitScore,
      answers: safeAnswers,
      context: body.context,
      keySignals,
      redFlags,
    });

    const prismaAny = prisma as any;
    if (prismaAny?.qualificationSession) {
      const consent = Boolean(body.consentToStore);
      await prismaAny.qualificationSession.create({
        data: {
          slug,
          industry: body.context.industry,
          fitScore: result.fitScore,
          leadType: result.leadType,
          buyingStage: result.buyingStage,
          budgetBand: result.budgetBand,
          urgency: result.urgency,
          nextAction: result.nextAction,
          recommendedPackage: result.recommendedPackage,
          rationaleShort: result.rationaleShort,
          keySignals: result.keySignals as any,
          redFlags: result.redFlags as any,
          answers: safeAnswers as any,
          context: body.context as any,
          email: consent ? body.email ?? null : null,
          consentToStore: consent,
          ipHash,
          userAgent: body.visitor?.userAgent || req.headers.get("user-agent") || null,
          status: "completed",
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Qualification failed" },
      { status: 500 }
    );
  }
}
