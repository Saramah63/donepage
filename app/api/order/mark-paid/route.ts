import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/app/lib/order-store";
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
      | { orderId?: string; sessionId?: string }
      | null;
    const orderId = (body?.orderId ?? "").trim();
    const sessionId = (body?.sessionId ?? "").trim();
    if (!orderId || !sessionId) {
      return NextResponse.json({ error: "Missing orderId/sessionId" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const updated = await updateOrder(order.id, {
      paymentStatus: "paid",
      paymentSessionId: sessionId,
      fulfillmentStatus: order.fulfillmentStatus === "published" ? "published" : "qa_pending",
    });

    try {
      const from = process.env.EMAIL_FROM;
      const transport = buildTransport();
      if (from && transport) {
        await transport.sendMail({
          from,
          to: "saramah63@gmail.com",
          subject: `Payment received - ${order.businessName}`,
          text: [
            `Order: ${order.id}`,
            `Business: ${order.businessName}`,
            `Customer: ${order.customerEmail}`,
            `Plan: ${order.plan}`,
            `Session: ${sessionId}`,
            `Draft: ${order.draftUrl}`,
          ].join("\n"),
        });
      }
    } catch {}

    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to mark paid" }, { status: 500 });
  }
}
