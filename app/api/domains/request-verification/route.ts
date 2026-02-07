import { NextResponse } from "next/server";
import crypto from "crypto";
import { sanitizeDomain, getDomainMapping } from "@/app/lib/domain-store";

export const runtime = "nodejs";

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    throw new Error("Missing RESEND_API_KEY or EMAIL_FROM");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Email send failed");
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "KV is not configured" },
        { status: 500 }
      );
    }
    const body = (await req.json().catch(() => null)) as
      | { domain?: string; email?: string }
      | null;

    const domain = sanitizeDomain(body?.domain ?? "");
    const email = (body?.email ?? "").trim();

    if (!domain) {
      return NextResponse.json({ error: "Missing domain" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const mapping = await getDomainMapping(domain);
    if (!mapping?.slug) {
      return NextResponse.json(
        { error: "Domain must be connected before verification" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(24).toString("hex");
    const key = `domainVerify:${token}`;

    // Store verification request (expires in 1 day)
    const { kv } = await import("@vercel/kv");
    await kv.set(
      key,
      { domain, email, createdAt: Date.now() },
      { ex: 60 * 60 * 24 }
    );

    const link = `${getBaseUrl()}/api/domains/confirm?token=${token}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">
        <h2>Verify domain ownership</h2>
        <p>Click the button below to verify <strong>${domain}</strong> for Donepage.</p>
        <p>
          <a href="${link}" style="display:inline-block;padding:10px 16px;background:#0ea5e9;color:#fff;border-radius:6px;text-decoration:none;">
            Verify Domain
          </a>
        </p>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `;

    const adminEmail = `admin@${domain}`;
    const recipients = Array.from(new Set([adminEmail, email]));

    for (const recipient of recipients) {
      await sendEmail(recipient, `Verify ${domain} for Donepage`, html);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Verification request failed" },
      { status: 500 }
    );
  }
}
