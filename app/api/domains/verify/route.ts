import { NextResponse } from "next/server";
import { sanitizeDomain, getDomainMapping } from "@/app/lib/domain-store";
import { resolve4, resolveCname } from "node:dns/promises";

export const runtime = "nodejs";

const VERCEL_CNAME = "cname.vercel-dns.com";
const VERCEL_A = "76.76.21.21";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("domain") || "";
    const domain = sanitizeDomain(raw);

    if (!domain) {
      return NextResponse.json({ error: "Missing domain" }, { status: 400 });
    }

    const mapping = await getDomainMapping(domain);

    let cname: string[] = [];
    let a: string[] = [];

    try {
      cname = await resolveCname(domain);
    } catch {}

    try {
      a = await resolve4(domain);
    } catch {}

    const cnameVerified = cname.some(
      (c) => c.replace(/\.$/, "").toLowerCase() === VERCEL_CNAME
    );
    const aVerified = a.includes(VERCEL_A);

    return NextResponse.json({
      domain,
      mapped: Boolean(mapping?.slug),
      slug: mapping?.slug || null,
      verified: Boolean(mapping?.verifiedAt),
      verifiedEmail: mapping?.verifiedEmail || null,
      dns: {
        cname,
        a,
        verified: cnameVerified || aVerified,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Verify failed" },
      { status: 500 }
    );
  }
}
