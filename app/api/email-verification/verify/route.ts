import { NextResponse } from "next/server";
import { verifyCode } from "@/app/lib/email-verification";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { code?: string } | null;
  const code = typeof body?.code === "string" ? body.code : "";

  console.log("EMAIL_VERIFY: verify requested");
  const result = await verifyCode(code);
  if (!result.ok) {
    console.error("EMAIL_VERIFY: verify failed", result);
    return NextResponse.json(
      {
        error: result.error,
        attemptsRemaining: (result as any).attemptsRemaining ?? null,
      },
      { status: result.status }
    );
  }

  console.log("EMAIL_VERIFY: verify success", { email: result.email });
  return NextResponse.json({ ok: true, email: result.email });
}
