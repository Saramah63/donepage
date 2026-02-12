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
    auth: { user: "resend", pass: apiKey },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; message?: string }
      | null;

    const message = (body?.message ?? "").trim();
    const fromEmail = (body?.email ?? "").trim();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const from = process.env.EMAIL_FROM;
    const to = process.env.CONTACT_TO || "hello@donepage.co";
    if (!from) {
      return NextResponse.json({ error: "Missing EMAIL_FROM" }, { status: 500 });
    }

    const transport = buildTransport();
    if (!transport) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const subject = "Donepage Chat Fallback";
    const text = `From: ${fromEmail || "no email provided"}\n\n${message}`;

    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: fromEmail || undefined,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to send" },
      { status: 500 }
    );
  }
}
