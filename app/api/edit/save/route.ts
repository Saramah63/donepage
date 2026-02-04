import { NextResponse } from "next/server";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { resolveEditToken, updateAnswersBySlug } from "@/app/lib/answers-store";

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

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      slug?: string;
      token?: string;
      answers?: QuestionnaireAnswers;
    } | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const token = String(body?.token ?? "");
    const answers = body?.answers;

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
    if (!answers) return NextResponse.json({ error: "Missing answers" }, { status: 400 });

    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // minimal validation (prevent storing junk)
    if (!answers.serviceType || !answers.targetAudience) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    await updateAnswersBySlug(slug, answers);

    return NextResponse.json({ ok: true, slug });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Save failed" },
      { status: 500 }
    );
  }
}
