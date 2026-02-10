import { NextResponse } from "next/server";
import { getProposal } from "@/app/lib/proposal-store";
import { getAnswersBySlug } from "@/app/lib/answers-store";
import { defaultProposal } from "@/app/lib/proposal-store";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = sanitizeSlug(searchParams.get("slug") || "");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const answers = await getAnswersBySlug(slug);
    if (!answers) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const base =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const previewLink = `${base.replace(/\/$/, "")}/preview/${slug}?mode=draft`;
    const proposalLink = `${base.replace(/\/$/, "")}/proposal/${slug}`;

    const saved = await getProposal(slug);
    const proposal = saved ?? defaultProposal(answers.answers ?? answers, previewLink, proposalLink);

    return NextResponse.json({ proposal });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Fetch failed" },
      { status: 500 }
    );
  }
}
