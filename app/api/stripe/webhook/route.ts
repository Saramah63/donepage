import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
  upsertPaidOrderFromSession,
} from "@/app/lib/payment-orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    console.error("STRIPE: webhook configuration missing", {
      hasSecret: Boolean(secret),
      hasWebhookSecret: Boolean(webhookSecret),
    });
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration" },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(secret);
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("STRIPE: missing stripe-signature header");
      return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log("STRIPE: webhook event received", { eventType: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email?.trim() ||
        String(session.metadata?.client_email || "").trim() ||
        session.customer_email?.trim() ||
        null;
      const plan = String(session.metadata?.plan || "").trim().toLowerCase();
      const draftId = String(session.metadata?.draft_id || "").trim() || null;
      const clientName =
        session.customer_details?.name?.trim() ||
        String(session.metadata?.client_name || "").trim() ||
        null;

      console.log("STRIPE: checkout.session.completed payload", {
        eventType: event.type,
        sessionId: session.id,
        customerEmail: email,
        clientName,
        planMetadata: plan,
        draftIdMetadata: draftId,
      });

      const order = await upsertPaidOrderFromSession(session);

      console.log("STRIPE: order paid", {
        stripeSessionId: session.id,
        email: order.email,
        plan: order.plan,
        draftId: order.draftId,
        status: order.status,
      });

      try {
        const adminResult = await sendAdminOrderEmail(order);
        console.log("STRIPE: admin order email", adminResult);
      } catch (error) {
        console.error("STRIPE: admin order email failed", error);
      }

      try {
        const customerResult = await sendCustomerOrderEmail(order);
        console.log("STRIPE: customer order email", customerResult);
      } catch (error) {
        console.error("STRIPE: customer order email failed", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("STRIPE: webhook failed", error);
    return NextResponse.json(
      { error: error?.message ?? "Webhook failed" },
      { status: 400 }
    );
  }
}
