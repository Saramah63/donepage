import { NextResponse } from "next/server";
import { setDomainVerified } from "@/app/lib/domain-store";

export const runtime = "nodejs";

async function getTokenData(token: string) {
  const { kv } = await import("@vercel/kv");
  return await kv.get<{ domain: string; email: string }>(`domainVerify:${token}`);
}

export async function GET(req: Request) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "KV is not configured" },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const data = await getTokenData(token);
    if (!data?.domain || !data?.email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const mapped = await setDomainVerified(data.domain, data.email);
    if (!mapped) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, domain: data.domain });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Confirm failed" },
      { status: 500 }
    );
  }
}
