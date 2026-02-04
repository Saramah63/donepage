import { NextResponse } from "next/server";
import { resolveEditToken, publishVersion } from "@/app/lib/answers-store";

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

    const parsedV = body?.version ? Number(body.version) : null;
    const version = Number.isFinite(parsedV) && (parsedV as number) > 0 ? (parsedV as number) : undefined;
    const r = await publishVersion(slug, version);

    return NextResponse.json({
      ok: true,
      version: r.version,
      pointers: r.state.pointers,
      versions: r.state.versions,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Publish failed" },
      { status: 400 }
    );
  }
}
