import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPlanFromPriceId(priceId?: string | null) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_LAUNCH) return "launch";
  if (priceId === process.env.STRIPE_PRICE_GROWTH) return "growth";
  if (priceId === process.env.STRIPE_PRICE_HOSTING) return "hosting";
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message ?? ""}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = (session.metadata?.plan as string | undefined) || "unknown";
      const email = session.customer_details?.email || session.customer_email || null;

      const prismaAny = prisma as any;
      if (prismaAny?.order) {
        await prismaAny.order.upsert({
          where: { stripeSessionId: session.id },
          create: {
            stripeSessionId: session.id,
            plan,
            email,
            status: "paid",
          },
          update: {
            plan,
            email,
            status: "paid",
          },
        });
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const priceId = (invoice.lines?.data?.[0] as any)?.price?.id;
      const plan =
        (invoice.metadata?.plan as string | undefined) ??
        getPlanFromPriceId(priceId) ??
        "hosting";

      const prismaAny = prisma as any;
      if (prismaAny?.order) {
        await prismaAny.order
          .create({
            data: {
              stripeSessionId: invoice.id,
              plan,
              email: invoice.customer_email || null,
              status: "paid",
            },
          })
          .catch(() => {});
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Webhook handler failed" },
      { status: 500 }
    );
  }
}
