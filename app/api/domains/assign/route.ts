import { NextResponse } from "next/server";
import { sanitizeDomain, setDomainMapping } from "@/app/lib/domain-store";

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
      | { domain?: string; slug?: string }
      | null;

    const domain = sanitizeDomain(body?.domain ?? "");
    const slug = sanitizeSlug(body?.slug ?? "");

    if (!domain) {
      return NextResponse.json({ error: "Missing domain" }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const mapped = await setDomainMapping(domain, slug);
    if (!mapped) {
      return NextResponse.json({ error: "Failed to map domain" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, domain, slug });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Assign failed" },
      { status: 500 }
    );
  }
}
