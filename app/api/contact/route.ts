import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/app/lib/prisma";

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
      | {
          name?: string;
          email?: string;
          company?: string;
          reason?: string;
          message?: string;
        }
      | null;

    const message = (body?.message ?? "").trim();
    const fromEmail = (body?.email ?? "").trim();
    const name = (body?.name ?? "").trim();
    const company = (body?.company ?? "").trim();
    const reason = (body?.reason ?? "").trim();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const from = process.env.EMAIL_FROM;
    const to = process.env.CONTACT_TO || "hello@donepage.co";

    if (prisma) {
      await prisma.contactMessage
        .create({
          data: {
            source: "contact_form",
            email: fromEmail || null,
            message,
            payload: body as any,
          },
        })
        .catch(() => {});
    }

    let messageId: string | null = null;
    let deliveryWarning: string | null = null;

    try {
      const transport = buildTransport();
      if (!from || !transport) {
        deliveryWarning = "Email delivery is not configured. Message saved to inbox database.";
      } else {
        const subject = reason ? `Donepage Contact (${reason})` : "Donepage Contact";
        const text = [
          `Name: ${name || "not provided"}`,
          `Email: ${fromEmail || "not provided"}`,
          `Company: ${company || "not provided"}`,
          `Reason: ${reason || "not provided"}`,
          "",
          message,
        ].join("\n");
        const info = await transport.sendMail({
          from,
          to,
          subject,
          text,
          replyTo: fromEmail || undefined,
        });
        messageId = info.messageId;
      }
    } catch (e: any) {
      deliveryWarning =
        e?.message || "Email delivery failed. Message saved to inbox database.";
    }

    return NextResponse.json({
      ok: true,
      messageId,
      warning: deliveryWarning,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to send" },
      { status: 500 }
    );
  }
}
