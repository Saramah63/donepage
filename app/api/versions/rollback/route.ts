import { NextResponse } from "next/server";
import { resolveEditToken, rollbackToVersion } from "@/app/lib/answers-store";

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
    const body = (await req.json().catch(() => null)) as {
      slug?: string;
      token?: string;
      version?: number;
      publishAlso?: boolean;
    } | null;

    const slug = sanitizeSlug(body?.slug || "");
    const token = body?.token || "";

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsedV = body?.version ? Number(body.version) : 0;
    const version = Number.isFinite(parsedV) ? parsedV : 0;
    if (version <= 0) {
      return NextResponse.json({ error: "Missing version" }, { status: 400 });
    }
    const r = await rollbackToVersion(slug, version, !!body?.publishAlso);

    return NextResponse.json({
      ok: true,
      version: r.version,
      pointers: r.state.pointers,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Rollback failed" },
      { status: 400 }
    );
  }
}
