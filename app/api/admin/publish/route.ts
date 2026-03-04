import { NextResponse } from "next/server";
import { publishBySlug } from "@/app/lib/answers-store";
import { getOrderById, getBaseUrl, updateOrder } from "@/app/lib/order-store";
import { isAdminAuthorized } from "@/app/lib/admin-auth";

export const runtime = "nodejs";

function redirectBack(req: Request, token?: string) {
  const referer = req.headers.get("referer");
  if (referer) return NextResponse.redirect(referer, 303);
  const qs = token ? `?token=${encodeURIComponent(token)}` : "";
  return NextResponse.redirect(new URL(`/admin${qs}`, req.url), 303);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!isAdminAuthorized(req, url.searchParams)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const ctype = req.headers.get("content-type") || "";
    let orderId = "";
    let token = url.searchParams.get("token") || "";

    if (ctype.includes("application/json")) {
      const body = (await req.json().catch(() => null)) as { orderId?: string } | null;
      orderId = (body?.orderId ?? "").trim();
    } else {
      const fd = await req.formData();
      orderId = String(fd.get("orderId") || "").trim();
      token = String(fd.get("token") || token).trim();
    }

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await publishBySlug(order.draftSlug, undefined, `Admin publish for order ${order.id}`);
    const publishedUrl = `${getBaseUrl()}/${order.draftSlug}`;
    const updated = await updateOrder(order.id, {
      fulfillmentStatus: "published",
      publishedAt: new Date().toISOString(),
      publishedUrl,
    });

    console.log("published", { orderId: order.id, draftSlug: order.draftSlug, publishedUrl });

    if (ctype.includes("application/json")) {
      return NextResponse.json({ ok: true, order: updated, publishedUrl });
    }
    return redirectBack(req, token);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Publish failed" }, { status: 500 });
  }
}
