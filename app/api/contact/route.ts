import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendMail } from "@/app/lib/mail";

export const runtime = "nodejs";

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
    const to = process.env.CONTACT_TO || "saramah63@gmail.com";

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
      if (!from) {
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
        const result = await sendMail({
          from,
          to,
          subject,
          text,
          replyTo: fromEmail || undefined,
        });
        if (result.ok) {
          messageId = result.messageId;
        } else {
          deliveryWarning = "Email delivery is not configured. Message saved to inbox database.";
        }
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
