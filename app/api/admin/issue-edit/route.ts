import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAnswersBySlug, setEditTokenForSlug } from "@/app/lib/answers-store";

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

export async function POST(req: Request) {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      return NextResponse.json({ error: "Missing ADMIN_TOKEN" }, { status: 500 });
    }

    const header = req.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as { slug?: string } | null;
    const slug = sanitizeSlug(body?.slug ?? "");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const answers = await getAnswersBySlug(slug);
    if (!answers) return NextResponse.json({ error: "Slug not found" }, { status: 404 });

    const editToken = crypto.randomBytes(24).toString("hex");
    await setEditTokenForSlug(slug, editToken);

    const base = getBaseUrl();
    const editUrl = `${base}/edit/${slug}?token=${editToken}`;
    const proposalEditUrl = `${base}/proposal/${slug}/edit?token=${editToken}`;

    return NextResponse.json({ ok: true, editUrl, proposalEditUrl, editToken });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to issue edit link" },
      { status: 500 }
    );
  }
}
