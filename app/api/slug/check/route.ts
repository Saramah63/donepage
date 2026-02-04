import { NextResponse } from "next/server";
import { slugExists } from "@/app/lib/answers-store";

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
    const url = new URL(req.url);
    const slug = sanitizeSlug(url.searchParams.get("slug") || "");

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const exists = await slugExists(slug);

    return NextResponse.json({
      ok: true,
      slug,
      available: !exists,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Check failed" },
      { status: 500 }
    );
  }
}
