import { NextResponse } from "next/server";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { resolveEditToken, saveDraftVersion } from "@/app/lib/answers-store";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      slug?: string;
      token?: string;
      answers?: QuestionnaireAnswers;
      note?: string;
    } | null;

    const slug = (body?.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
    const token = body?.token || "";
    const answers = body?.answers;

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!answers) return NextResponse.json({ error: "Missing answers" }, { status: 400 });

    const r = await saveDraftVersion(slug, answers, body?.note);
    return NextResponse.json({
      ok: true,
      version: r.version,
      pointers: r.state.pointers,
      versions: r.state.versions,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Save draft failed" },
      { status: 500 }
    );
  }
}
