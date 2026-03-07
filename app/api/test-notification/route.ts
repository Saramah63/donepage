import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { sendAdminNotification } from "@/app/lib/notifications";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    if (!isAdminAuthorized(req, url.searchParams)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subject = "Test Notification — Donepage";
    const text = [
      "This is a test notification from Donepage.",
      `Time: ${new Date().toISOString()}`,
    ].join("\n");

    const result = await sendAdminNotification({ subject, text });
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

