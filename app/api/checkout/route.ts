import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Plan = "starter" | "business" | "pro";

function getPriceId(plan: Plan) {
  if (plan === "starter") return process.env.STRIPE_PRICE_STARTER;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS;
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  return undefined;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { plan?: Plan }
      | null;

    const plan = body?.plan;

    if (!plan || !["starter", "business", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe price id for plan: ${plan}` },
        { status: 500 },
      );
    }

    const stripe = new Stripe(secret);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { plan },
      success_url: `${appUrl}/generator?paid=1&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/generator?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
  console.error("CHECKOUT_ERROR", {
    message: e?.message,
    type: e?.type,
    code: e?.code,
    statusCode: e?.statusCode,
  });

  return NextResponse.json(
    { error: "Checkout failed. Please try again." },
    { status: 500 }
  );
}
}
