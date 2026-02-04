import { NextResponse } from "next/server";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import {
  isSlugTaken,
  saveDraftVersion,
  publishVersion,
  setEditTokenForSlug,
} from "@/app/lib/answers-store";
import crypto from "crypto";

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

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

function makeEditToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      slug?: string;
      answers?: QuestionnaireAnswers;
    } | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const answers = body?.answers;

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!answers || !answers.serviceType || !answers.targetAudience) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    // slug availability
    const taken = await isSlugTaken(slug);
    if (taken) {
      return NextResponse.json(
        { error: "Slug taken", code: "SLUG_TAKEN" },
        { status: 409 }
      );
    }

    // create secure edit token
    const editToken = makeEditToken();
    await setEditTokenForSlug(slug, editToken);

    // create version 1 draft then publish it
    const d = await saveDraftVersion(slug, answers, "Initial publish");
    if (!d.ok) throw new Error("Draft create failed");

    const p = await publishVersion(slug, d.version);
    if (!p.ok) throw new Error("Publish failed");

    const base = getBaseUrl();

    const url = `${base}/${slug}`;
    const editUrl = `${base}/edit/${slug}?token=${editToken}`;

    return NextResponse.json({
      ok: true,
      slug,
      url,
      editToken, // optional
      editUrl,   // ✅ share privately
      version: d.version,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Publish failed" },
      { status: 500 }
    );
  }
}
