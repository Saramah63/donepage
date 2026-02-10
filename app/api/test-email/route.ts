import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function buildTransport() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: apiKey,
    },
  });
}

export async function POST(req: Request) {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (process.env.NODE_ENV === "production") {
      if (!adminToken) {
        return NextResponse.json({ error: "Missing ADMIN_TOKEN" }, { status: 500 });
      }
      const header = req.headers.get("authorization") || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (token !== adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = (await req.json().catch(() => null)) as { to?: string } | null;
    const to = (body?.to ?? "").trim();
    if (!to) return NextResponse.json({ error: "Missing to" }, { status: 400 });

    const from = process.env.EMAIL_FROM;
    if (!from) return NextResponse.json({ error: "Missing EMAIL_FROM" }, { status: 500 });

    const transport = buildTransport();
    if (!transport) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const info = await transport.sendMail({
      from,
      to,
      subject: "Donepage test email",
      text: "Your Donepage email setup is working.",
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to send test email" },
      { status: 500 }
    );
  }
}
