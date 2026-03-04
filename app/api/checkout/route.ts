import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type LegacyPlan = "starter" | "business" | "pro";
type NewPlan = "launch" | "growth";
type AnyPlan = LegacyPlan | NewPlan;

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/+$/, "");
}

function getPriceId(plan: AnyPlan) {
  if (plan === "launch") return process.env.STRIPE_LAUNCH_PRICE_ID;
  if (plan === "growth") return process.env.STRIPE_GROWTH_PRICE_ID;
  if (plan === "starter") return process.env.STRIPE_PRICE_STARTER;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS;
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  return undefined;
}

function buildUrls(plan: AnyPlan) {
  return buildUrlsWithParams(plan, null, null);
}

function buildUrlsWithParams(
  plan: AnyPlan,
  orderId?: string | null,
  token?: string | null
) {
  const app = getAppUrl();
  if (plan === "launch" || plan === "growth") {
    const extras = new URLSearchParams();
    if (orderId) extras.set("order", orderId);
    if (token) extras.set("token", token);
    const suffix = extras.toString() ? `&${extras.toString()}` : "";
    return {
      success: `${app}/start?paid=1&plan=${plan}&session_id={CHECKOUT_SESSION_ID}${suffix}`,
      cancel: `${app}/?cancelled=1`,
    };
  }
  return {
    success: `${app}/generator?paid=1&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${app}/generator?canceled=1`,
  };
}

async function createSession(plan: AnyPlan, opts?: { orderId?: string | null; token?: string | null }) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Missing STRIPE_SECRET_KEY");
  const priceId = getPriceId(plan);
  if (!priceId) throw new Error(`Missing Stripe price id for plan: ${plan}`);

  const stripe = new Stripe(secret);
  const urls = buildUrlsWithParams(plan, opts?.orderId, opts?.token);
  return await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      plan,
      orderId: opts?.orderId || "",
    },
    success_url: urls.success,
    cancel_url: urls.cancel,
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = (searchParams.get("plan") || "").toLowerCase() as AnyPlan;
    const orderId = (searchParams.get("order") || "").trim() || null;
    const token = (searchParams.get("token") || "").trim() || null;
    if (!["launch", "growth", "starter", "business", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const session = await createSession(plan, { orderId, token });
    if (!session.url) {
      return NextResponse.json({ error: "Checkout session has no URL" }, { status: 500 });
    }
    return NextResponse.redirect(session.url, 303);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      plan?: AnyPlan;
      orderId?: string;
      token?: string;
    } | null;
    const plan = (body?.plan || "").toLowerCase() as AnyPlan;
    if (!["launch", "growth", "starter", "business", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const session = await createSession(plan, {
      orderId: (body?.orderId || "").trim() || null,
      token: (body?.token || "").trim() || null,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}
