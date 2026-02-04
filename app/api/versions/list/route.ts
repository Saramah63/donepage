import { NextResponse } from "next/server";
import { listVersions, resolveEditToken } from "@/app/lib/answers-store";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = sanitizeSlug(url.searchParams.get("slug") || "");
    const token = url.searchParams.get("token") || "";

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const st = await listVersions(slug);
    return NextResponse.json({ ok: true, ...st });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load versions" },
      { status: 500 }
    );
  }
}
