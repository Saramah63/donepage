// app/api/versions/route.ts
import { NextResponse } from "next/server";
import {
  getDraftBySlug,
  getPublishedBySlug,
  listVersionsBySlug,
} from "@/app/lib/answers-store";

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
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const [versions, draft, published] = await Promise.all([
      listVersionsBySlug(slug),
      getDraftBySlug(slug),
      getPublishedBySlug(slug),
    ]);

    return NextResponse.json({
      ok: true,
      slug,
      versions: versions.slice().reverse(), // newest first
      pointers: {
        draftVersion: draft?.version ?? null,
        publishedVersion: published?.version ?? null,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load versions" },
      { status: 500 }
    );
  }
}
