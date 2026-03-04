import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Plan = "launch" | "growth" | "hosting";

type Body = {
  plan?: Plan;
};

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/+$/, "");
}

function getPriceId(plan: Plan) {
  if (plan === "launch") return process.env.STRIPE_PRICE_LAUNCH;
  if (plan === "growth") return process.env.STRIPE_PRICE_GROWTH;
  if (plan === "hosting") return process.env.STRIPE_PRICE_HOSTING;
  return undefined;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const body = (await req.json().catch(() => null)) as Body | null;
    const plan = (body?.plan || "").toLowerCase() as Plan;
    if (!plan || !["launch", "growth", "hosting"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing price id for plan: ${plan}` },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: plan === "hosting" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      metadata: { plan },
      subscription_data:
        plan === "hosting"
          ? {
              metadata: { plan },
            }
          : undefined,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session has no URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}
