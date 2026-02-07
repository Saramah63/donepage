import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

type Plan = "starter" | "business" | "pro";

function verify(token: string, secret: string): Plan | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [value, sig] = parts;

  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");

  // Avoid length-mismatch throwing in timingSafeEqual
  if (sig.length !== expected.length) return null;

  if (
    !crypto.timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))
  ) {
    return null;
  }

  // value = plan|timestamp
  const [plan] = value.split("|");
  if (plan !== "starter" && plan !== "business" && plan !== "pro") return null;

  return plan;
}

export async function GET(req: Request) {
  const secret = process.env.PLAN_TOKEN_SECRET;
  if (!secret) {
    // No secret => can't verify => default safely
    return NextResponse.json({ plan: "starter", paid: false });
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith("dp_plan="));

  const token = cookie ? decodeURIComponent(cookie.split("=")[1] || "") : "";
  const plan = token ? verify(token, secret) : null;

  return NextResponse.json({ plan: plan ?? "starter", paid: Boolean(plan) });
}
