import { NextResponse } from "next/server";
import { getVerificationStatus } from "@/app/lib/email-verification";

export const runtime = "nodejs";

export async function GET() {
  const status = await getVerificationStatus();
  return NextResponse.json({
    ok: true,
    email: status.email,
    verified: status.verified,
    expiresAt: status.expiresAt,
  });
}
