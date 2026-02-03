import { NextResponse } from "next/server";
import { saveAnswersBySlug } from "@/app/lib/answers-store";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

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
  if (appUrl) return appUrl.replace(/\/+$/, ""); // remove trailing slash

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      slug?: string;
      answers?: QuestionnaireAnswers;
    } | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const answers = body?.answers;

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (!answers || !answers.serviceType || !answers.targetAudience) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    await saveAnswersBySlug(slug, answers);

    const base = getBaseUrl();

    return NextResponse.json({
      ok: true,
      slug,
      url: `${base}/${slug}`,
    });
  } catch (e: any) {
    // Keep message but avoid leaking secrets
    return NextResponse.json(
      { error: e?.message ?? "Publish failed" },
      { status: 500 },
    );
  }
}
