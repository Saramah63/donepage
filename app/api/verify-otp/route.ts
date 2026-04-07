import { NextResponse } from "next/server";
import { verifyCode } from "@/app/lib/email-verification";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { code?: string } | null;
  const code = typeof body?.code === "string" ? body.code : "";

  const result = await verifyCode(code);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        attemptsRemaining: (result as any).attemptsRemaining ?? null,
      },
      { status: result.status }
    );
  }

  return NextResponse.json({ ok: true, email: result.email });
}
