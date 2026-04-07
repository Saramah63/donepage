import { NextResponse } from "next/server";
import { sendVerificationCode } from "@/app/lib/email-verification";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = typeof body?.email === "string" ? body.email : "";

  const result = await sendVerificationCode(email);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, retryAfter: (result as any).retryAfter ?? null },
      { status: result.status }
    );
  }

  return NextResponse.json({ ok: true, email: result.email, expiresAt: result.expiresAt });
}
