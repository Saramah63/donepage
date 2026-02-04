// app/api/republish/route.ts  (Model B)
import { NextResponse } from "next/server";
import { getAnswersBySlug, publishBySlug } from "@/app/lib/answers-store";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

function isValidAnswers(a: any): a is QuestionnaireAnswers {
  return Boolean(a && typeof a === "object" && a.serviceType && a.targetAudience);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | { slug?: string; answers?: QuestionnaireAnswers }
      | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const answers = body?.answers;

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!isValidAnswers(answers)) return NextResponse.json({ error: "Missing answers" }, { status: 400 });

    const existing = await getAnswersBySlug(slug);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    if ((existing as any)?.ownerId && (existing as any).ownerId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    await publishBySlug(slug, answers);

    const base = getBaseUrl();
    return NextResponse.json({ ok: true, slug, url: `${base}/${slug}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Republish failed" }, { status: 500 });
  }
}
