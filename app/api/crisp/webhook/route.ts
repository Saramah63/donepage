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

function isAuthorized(req: Request) {
  const expected = process.env.CRISP_WEBHOOK_SECRET;
  if (!expected) return true;
  const token =
    req.headers.get("x-crisp-signature") ||
    req.headers.get("x-webhook-secret") ||
    req.headers.get("authorization");
  if (!token) return false;
  if (token.startsWith("Bearer ")) return token.slice(7) === expected;
  return token === expected;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as any;
    if (!body) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
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

    const event = body?.event || "message";
    const sessionId = body?.data?.session_id || body?.session_id || "unknown";
    const fromName =
      body?.data?.user?.nickname ||
      body?.data?.user?.email ||
      body?.data?.user?.phone ||
      "Visitor";
    const fromEmail = body?.data?.user?.email || "";
    const messageText =
      body?.data?.content ||
      body?.data?.message ||
      body?.data?.data?.content ||
      "";

    const subject = `Crisp: ${event} · ${fromName}`;
    const text = [
      `Event: ${event}`,
      `Session: ${sessionId}`,
      `From: ${fromName}${fromEmail ? ` <${fromEmail}>` : ""}`,
      "",
      "Message:",
      messageText || "(no content)",
    ].join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <h2 style="margin:0 0 8px;">Crisp message received</h2>
        <p style="margin:0 0 12px;color:#555;">Event: <strong>${event}</strong></p>
        <div style="margin:0 0 12px;">
          <div><strong>From:</strong> ${fromName}${fromEmail ? ` &lt;${fromEmail}&gt;` : ""}</div>
          <div><strong>Session:</strong> ${sessionId}</div>
        </div>
        <div style="padding:12px;border:1px solid #eee;border-radius:8px;background:#fafafa;">
          ${messageText ? messageText.replace(/\n/g, "<br/>") : "(no content)"}
        </div>
      </div>
    `.trim();

    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
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
