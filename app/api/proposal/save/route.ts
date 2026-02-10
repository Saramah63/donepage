import { NextResponse } from "next/server";
import { resolveEditToken, getAnswersBySlug } from "@/app/lib/answers-store";
import { saveProposal } from "@/app/lib/proposal-store";
import type { ProposalData } from "@/app/lib/proposal-store";

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
    const body = (await req.json().catch(() => null)) as
      | { slug?: string; token?: string; proposal?: ProposalData }
      | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const token = (body?.token ?? "").trim();
    const proposal = body?.proposal;

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!token && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }
    if (!proposal) return NextResponse.json({ error: "Missing proposal" }, { status: 400 });

    if (token) {
      const ok = await resolveEditToken(slug, token);
      if (!ok.ok) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // ensure slug exists
    const answers = await getAnswersBySlug(slug);
    if (!answers) return NextResponse.json({ error: "Slug not found" }, { status: 404 });

    const saved = await saveProposal(slug, proposal);
    return NextResponse.json({ ok: true, proposal: saved });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Save failed" },
      { status: 500 }
    );
  }
}
