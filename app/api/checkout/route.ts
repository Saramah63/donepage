import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProjectById } from "@/app/lib/project-store";

export const runtime = "nodejs";

type Plan = "launch" | "growth" | "hosting";

type Body = {
  plan?: Plan;
  projectId?: string;
  token?: string;
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

async function createCheckoutSession(input: { plan?: string; projectId?: string; token?: string }) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  const plan = (input.plan || "").toLowerCase() as Plan;
  if (!plan || !["launch", "growth", "hosting"].includes(plan)) {
    throw new Error("Invalid plan");
  }

  const priceId = getPriceId(plan);
  if (!priceId) {
    throw new Error(`Missing price id for plan: ${plan}`);
  }

  const projectId = (input.projectId || "").trim();
  const token = (input.token || "").trim();
  let customerEmail: string | undefined;
  let clientEmail = "";
  let clientName = "";
  let cancelUrl = `${getAppUrl()}/#pricing`;

  if (projectId) {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    if (token && project.accessToken !== token) {
      throw new Error("Unauthorized project access");
    }
    const rawEmail = project.answers?.contactEmail;
    if (typeof rawEmail === "string" && rawEmail.trim()) {
      customerEmail = rawEmail.trim();
      clientEmail = rawEmail.trim();
    }
    const rawClientName =
      typeof project.answers?.clientName === "string" && project.answers.clientName.trim()
        ? project.answers.clientName.trim()
        : typeof project.answers?.businessName === "string" && project.answers.businessName.trim()
        ? project.answers.businessName.trim()
        : "";
    if (rawClientName) {
      clientName = rawClientName;
    }
    if (project.accessToken) {
      cancelUrl = `${getAppUrl()}/draft/${projectId}?token=${encodeURIComponent(project.accessToken)}`;
    }
  }

  const stripe = new Stripe(secret);
  const appUrl = getAppUrl();
  const metadata: Record<string, string> = { plan };
  if (projectId) metadata.draft_id = projectId;
  if (clientEmail) metadata.client_email = clientEmail;
  if (clientName) metadata.client_name = clientName;

  const session = await stripe.checkout.sessions.create({
    mode: plan === "hosting" ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ""}`,
    cancel_url: cancelUrl,
    metadata,
    customer_email: customerEmail,
    subscription_data:
      plan === "hosting"
        ? {
            metadata,
          }
        : undefined,
  });

  if (!session.url) {
    throw new Error("Checkout session has no URL");
  }

  return session.url;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = await createCheckoutSession({
      plan: searchParams.get("plan") || undefined,
      projectId: searchParams.get("projectId") || undefined,
      token: searchParams.get("token") || undefined,
    });
    return NextResponse.redirect(url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const url = await createCheckoutSession({
      plan: body?.plan,
      projectId: body?.projectId,
      token: body?.token,
    });
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}
