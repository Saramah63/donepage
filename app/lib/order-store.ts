import crypto from "crypto";
import { getPersistentKV, setPersistentKV } from "@/app/lib/persistent-kv";

export type OrderPlan = "launch" | "growth";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type FulfillmentStatus = "draft_generated" | "qa_pending" | "published";

export type OrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  customerName?: string | null;
  businessName: string;
  plan: OrderPlan;
  hostingAddOn: boolean;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentSessionId?: string | null;
  draftSlug: string;
  draftUrl: string;
  publishedUrl?: string | null;
  accessToken: string;
  briefAnswers: Record<string, unknown>;
  notesInternal?: string | null;
  draftGeneratedAt?: string | null;
  publishedAt?: string | null;
};

const ORDER_INDEX_KEY = "orders:index:v1";
const keyOrder = (id: string) => `order:${id}`;

export function makeAccessToken() {
  return crypto.randomBytes(24).toString("base64url");
}

export function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

async function getOrderIndex() {
  return (await getPersistentKV<string[]>(ORDER_INDEX_KEY)) ?? [];
}

async function setOrderIndex(ids: string[]) {
  const deduped = Array.from(new Set(ids));
  await setPersistentKV(ORDER_INDEX_KEY, deduped);
}

export async function createOrder(input: {
  customerEmail: string;
  customerName?: string | null;
  businessName: string;
  plan: OrderPlan;
  hostingAddOn?: boolean;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentSessionId?: string | null;
  draftSlug: string;
  draftUrl: string;
  accessToken: string;
  briefAnswers: Record<string, unknown>;
  notesInternal?: string | null;
  draftGeneratedAt?: string | null;
}) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const order: OrderRecord = {
    id,
    createdAt: now,
    updatedAt: now,
    customerEmail: input.customerEmail,
    customerName: input.customerName ?? null,
    businessName: input.businessName,
    plan: input.plan,
    hostingAddOn: Boolean(input.hostingAddOn),
    paymentStatus: input.paymentStatus ?? "paid",
    fulfillmentStatus: input.fulfillmentStatus ?? "qa_pending",
    paymentSessionId: input.paymentSessionId ?? null,
    draftSlug: input.draftSlug,
    draftUrl: input.draftUrl,
    publishedUrl: null,
    accessToken: input.accessToken,
    briefAnswers: input.briefAnswers,
    notesInternal: input.notesInternal ?? null,
    draftGeneratedAt: input.draftGeneratedAt ?? now,
    publishedAt: null,
  };

  await setPersistentKV(keyOrder(id), order);
  const ids = await getOrderIndex();
  ids.unshift(id);
  await setOrderIndex(ids);
  return order;
}

export async function getOrderById(id: string) {
  return await getPersistentKV<OrderRecord>(keyOrder(id));
}

export async function updateOrder(
  id: string,
  patch: Partial<Omit<OrderRecord, "id" | "createdAt" | "accessToken">>
) {
  const existing = await getOrderById(id);
  if (!existing) return null;
  const next: OrderRecord = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await setPersistentKV(keyOrder(id), next);
  return next;
}

export async function listOrders() {
  const ids = await getOrderIndex();
  const orders = await Promise.all(ids.map((id) => getOrderById(id)));
  return orders.filter(Boolean) as OrderRecord[];
}

export async function computeOrderStats() {
  const orders = await listOrders();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const ordersThisMonth = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const launchCount = orders.filter((o) => o.plan === "launch").length;
  const growthCount = orders.filter((o) => o.plan === "growth").length;
  const qaPendingCount = orders.filter((o) => o.fulfillmentStatus === "qa_pending").length;
  const publishedCount = orders.filter((o) => o.fulfillmentStatus === "published").length;
  const hostingAddOnCount = orders.filter((o) => o.hostingAddOn).length;
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid").length;

  return {
    totalOrders: orders.length,
    paidOrders,
    ordersThisMonth,
    launchCount,
    growthCount,
    qaPendingCount,
    publishedCount,
    hostingAddOnCount,
  };
}
