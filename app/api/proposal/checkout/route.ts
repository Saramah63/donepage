import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function normalizeTier(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");
}

function priceIdForTier(tierRaw: string) {
  const tier = normalizeTier(tierRaw);
  const digits = tier.replace(/[^0-9]/g, "");
  if (digits === "3000") return process.env.STRIPE_PRICE_PROPOSAL_3K;
  if (digits === "5000") return process.env.STRIPE_PRICE_PROPOSAL_5K;
  if (digits === "7000") return process.env.STRIPE_PRICE_PROPOSAL_7K;
  return null;
}

export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const body = (await req.json().catch(() => null)) as
      | { slug?: string; tier?: string }
      | null;
    const slug = (body?.slug ?? "").trim();
    const tier = (body?.tier ?? "").trim();

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!tier) return NextResponse.json({ error: "Missing tier" }, { status: 400 });

    const priceId = priceIdForTier(tier);
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured for tier" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecret);
    const url = new URL(req.url);
    const base = `${url.protocol}//${url.host}`;
    const successUrl = `${base}/proposal/${slug}?paid=1&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/proposal/${slug}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { slug, tier, kind: "proposal" },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
