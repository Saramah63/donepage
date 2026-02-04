// app/api/rollback/route.ts
import { NextResponse } from "next/server";
import { rollbackToDraftBySlug } from "@/app/lib/answers-store";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { slug?: string; version?: number }
      | null;

    const slug = sanitizeSlug(body?.slug ?? "");
    const version = Number(body?.version);

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (!Number.isFinite(version) || version <= 0) {
      return NextResponse.json({ error: "Missing version" }, { status: 400 });
    }

    const res = await rollbackToDraftBySlug(slug, version);

    return NextResponse.json({
      ok: true,
      slug,
      newDraftVersion: res.version,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Rollback failed" },
      { status: 500 }
    );
  }
}
