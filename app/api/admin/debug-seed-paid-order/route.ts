import { NextResponse } from "next/server";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { setPersistentKV } from "@/app/lib/persistent-kv";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 500 });
    }

    if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEBUG_ORDER_SEED !== "1") {
      return NextResponse.json({ error: "Debug seed disabled in production" }, { status: 403 });
    }

    const stamp = Date.now();
    const orderId = crypto.randomUUID();
    const stripeSessionId = `debug_session_${stamp}`;
    const email = `debug+${stamp}@donepage.co`;
    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO "Order" ("id", "stripeSessionId", "plan", "email", "status", "createdAt")
        VALUES (${orderId}, ${stripeSessionId}, 'launch', ${email}, 'paid', CURRENT_TIMESTAMP)
      `
    );

    await setPersistentKV(`payment-order:meta:${orderId}`, {
      amount: 9900,
      draftId: null,
      customerName: "Debug Order",
    });

    console.log("STRIPE: debug paid order seeded", {
      id: orderId,
      email,
      status: "paid",
    });

    return NextResponse.json({
      ok: true,
      order: { id: orderId, stripeSessionId, email, plan: "launch", status: "paid" },
    });
  } catch (e: any) {
    console.error("STRIPE: debug seed failed", e);
    return NextResponse.json(
      { error: e?.message ?? "Failed to seed debug order" },
      { status: 500 }
    );
  }
}
