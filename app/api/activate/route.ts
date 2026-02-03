import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

export const runtime = "nodejs";

function sign(value: string, tokenSecret: string) {
  const h = crypto.createHmac("sha256", tokenSecret).update(value).digest("hex");
  return `${value}.${h}`;
}

export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 },
      );
    }

    const tokenSecret = process.env.PLAN_TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { error: "Missing PLAN_TOKEN_SECRET" },
        { status: 500 },
      );
    }

    const stripe = new Stripe(stripeSecret); // apiVersion حذف شد

    const body = (await req.json().catch(() => null)) as {
      session_id?: string;
    } | null;

    const session_id = body?.session_id;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Not paid" }, { status: 402 });
    }

    const plan = session.metadata?.plan;
    if (plan !== "starter" && plan !== "business" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // payload = plan|timestamp
    const payload = `${plan}|${Date.now()}`;
    const token = sign(payload, tokenSecret);

    const res = NextResponse.json({ ok: true, plan });

    res.cookies.set("dp_plan", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Verify failed" },
      { status: 500 },
    );
  }
}
