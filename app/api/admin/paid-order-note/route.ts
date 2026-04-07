import { NextResponse } from "next/server";
import {
  getPaymentOrderById,
  setPaymentOrderDeliveryStatus,
  setPaymentOrderNote,
  type DeliveryStatus,
} from "@/app/lib/payment-orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { orderId?: string; note?: string; status?: DeliveryStatus }
      | null;

    const orderId = (body?.orderId || "").trim();
    const note = (body?.note || "").trim();
    const status = (body?.status || "paid").trim() as DeliveryStatus;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await getPaymentOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!["paid", "in_progress", "delivered"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await setPaymentOrderNote(orderId, note);
    await setPaymentOrderDeliveryStatus(orderId, status);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to save note" },
      { status: 500 }
    );
  }
}
