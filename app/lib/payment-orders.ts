import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import { sendMail } from "@/app/lib/mail";
import { getProjectById, updateProject, createEvent } from "@/app/lib/project-store";
import { getPersistentKV, setPersistentKV } from "@/app/lib/persistent-kv";
import { markLeadPurchased } from "@/app/lib/leads";

export type PaymentOrderRecord = {
  id: string;
  stripeSessionId: string;
  plan: string;
  email: string;
  amount: number;
  draftId: string | null;
  clientName: string | null;
  status: DeliveryStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type DeliveryStatus = "paid" | "in_progress" | "delivered";

const paymentOrderNotesKey = (id: string) => `payment-order:notes:${id}`;
const paymentOrderMetaKey = (id: string) => `payment-order:meta:${id}`;

type PaymentOrderMeta = {
  amount: number;
  draftId: string | null;
  clientName: string | null;
  deliveryStatus?: DeliveryStatus;
};

function formatPlanLabel(plan: string) {
  if (plan === "growth") return "Growth";
  if (plan === "launch") return "Launch";
  if (plan === "hosting") return "Hosting";
  return plan || "Unknown";
}

function formatMoney(cents: number | null | undefined) {
  if (typeof cents !== "number") return "unknown";
  return `€${(cents / 100).toFixed(2)}`;
}

function safeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatPurchaseDate(value: Date | string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Helsinki",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function buildQuestionnaireSummary(answers?: Record<string, unknown> | null) {
  if (!answers) return [] as Array<{ label: string; value: string }>;

  const summary = [
    { label: "Offer", value: safeText(answers.primaryOffer) },
    { label: "Audience", value: safeText(answers.targetAudience) },
    { label: "Outcome", value: safeText(answers.outcomeStatement) },
    { label: "Problem", value: safeText(answers.problemStatement) },
    { label: "Trust", value: safeText(answers.trustFactor) },
    { label: "CTA", value: safeText(answers.desiredAction) },
    { label: "Tone", value: safeText(answers.tone) },
  ].filter((item) => item.value);

  return summary;
}

export function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

export function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.CONTACT_TO?.trim() ||
    "hello@donepage.co"
  );
}

export async function upsertPaidOrderFromSession(session: Stripe.Checkout.Session) {
  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const stripeSessionId = session.id;
  const plan = String(session.metadata?.plan || "").trim().toLowerCase();
  const draftId = String(session.metadata?.draft_id || "").trim() || null;
  const email =
    session.customer_details?.email?.trim() ||
    String(session.metadata?.client_email || "").trim() ||
    session.customer_email?.trim() ||
    "";
  const clientName =
    session.customer_details?.name?.trim() ||
    String(session.metadata?.client_name || "").trim() ||
    null;
  const amount = typeof session.amount_total === "number" ? session.amount_total : 0;
  const purchasedAt = session.created
    ? new Date(session.created * 1000).toISOString()
    : new Date().toISOString();

  if (!email) {
    throw new Error("Stripe checkout completed without customer email.");
  }

  if (!amount) {
    throw new Error("Stripe checkout completed without amount_total.");
  }

  const existingRows = await prisma.$queryRaw<Array<{ id: string }>>(
    Prisma.sql`SELECT "id" FROM "Order" WHERE "stripeSessionId" = ${stripeSessionId} LIMIT 1`
  );

  const existing = existingRows[0] ?? null;
  const orderId = existing?.id || crypto.randomUUID();

  if (existing) {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Order"
        SET "plan" = ${plan},
            "email" = ${email},
            "amount" = ${amount},
            "draftId" = ${draftId},
            "clientName" = ${clientName},
            "status" = 'paid',
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${orderId}
      `
    );
  } else {
    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO "Order" ("id", "stripeSessionId", "plan", "email", "clientName", "amount", "draftId", "status", "createdAt", "updatedAt")
        VALUES (${orderId}, ${stripeSessionId}, ${plan}, ${email}, ${clientName}, ${amount}, ${draftId}, 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
    );
  }

  await setPersistentKV<PaymentOrderMeta>(paymentOrderMetaKey(orderId), {
    amount,
    draftId,
    clientName,
    deliveryStatus: "paid",
  });

  if (draftId) {
    const project = await getProjectById(draftId);
    if (project) {
      await updateProject(draftId, {
        paymentStatus: "paid",
        status: project.status === "published" ? project.status : "in_production",
      });
      await createEvent({
        projectId: draftId,
        type: "payment_received",
        message: `Payment received for ${plan} plan.`,
        metadata: {
          email,
          stripeSessionId,
          amount,
        },
      });
    }
  }

  await markLeadPurchased({ email, draftId });

  return {
    id: orderId,
    stripeSessionId,
    plan,
    email,
    amount,
    draftId,
    clientName,
    status: "paid",
    createdAt: purchasedAt,
    updatedAt: purchasedAt,
  } satisfies PaymentOrderRecord;
}

export async function listPaymentOrders() {
  if (!prisma) return [];
  const rows: Array<{
    id: string;
    stripeSessionId: string;
    plan: string;
    email: string;
    clientName: string | null;
    amount: number;
    status: string;
    createdAt: Date | string;
  }> = await prisma.$queryRaw(
    Prisma.sql`SELECT "id", "stripeSessionId", "plan", "email", "clientName", "amount", "status", "createdAt" FROM "Order" WHERE "status" = 'paid' ORDER BY "createdAt" DESC`
  );

  return await Promise.all(
    rows.map(async (row) => {
      const meta = (await getPersistentKV<PaymentOrderMeta>(paymentOrderMetaKey(row.id))) ?? {
        amount: row.amount,
        draftId: null,
        clientName: row.clientName,
        deliveryStatus: "paid",
      };
      return {
        id: row.id,
        stripeSessionId: row.stripeSessionId,
        plan: row.plan,
        email: row.email,
        amount: meta.amount,
        draftId: meta.draftId,
        clientName: meta.clientName,
        status: meta.deliveryStatus || "paid",
        createdAt: row.createdAt,
        updatedAt: row.createdAt,
      } satisfies PaymentOrderRecord;
    })
  );
}

export async function getPaymentOrderById(id: string) {
  if (!prisma) return null;
  const rows: Array<{
    id: string;
    stripeSessionId: string;
    plan: string;
    email: string;
    clientName: string | null;
    amount: number;
    status: string;
    createdAt: Date | string;
  }> = await prisma.$queryRaw(
    Prisma.sql`SELECT "id", "stripeSessionId", "plan", "email", "clientName", "amount", "status", "createdAt" FROM "Order" WHERE "id" = ${id} LIMIT 1`
  );
  const row = rows[0] ?? null;
  if (!row) return null;
  const meta = (await getPersistentKV<PaymentOrderMeta>(paymentOrderMetaKey(row.id))) ?? {
    amount: row.amount,
    draftId: null,
    clientName: row.clientName,
    deliveryStatus: "paid",
  };
  return {
    id: row.id,
    stripeSessionId: row.stripeSessionId,
    plan: row.plan,
    email: row.email,
    amount: meta.amount,
    draftId: meta.draftId,
    clientName: meta.clientName,
    status: meta.deliveryStatus || "paid",
    createdAt: row.createdAt,
    updatedAt: row.createdAt,
  };
}

export async function getPaymentOrderNote(id: string) {
  return (await getPersistentKV<string>(paymentOrderNotesKey(id))) ?? "";
}

export async function setPaymentOrderNote(id: string, note: string) {
  await setPersistentKV(paymentOrderNotesKey(id), note);
}

export async function setPaymentOrderDeliveryStatus(id: string, status: DeliveryStatus) {
  const meta = (await getPersistentKV<PaymentOrderMeta>(paymentOrderMetaKey(id))) ?? {
    amount: 0,
    draftId: null,
    clientName: null,
    deliveryStatus: "paid" as DeliveryStatus,
  };
  await setPersistentKV(paymentOrderMetaKey(id), {
    ...meta,
    deliveryStatus: status,
  });
}

export function buildOrderLinks(
  order: Pick<PaymentOrderRecord, "draftId">,
  accessToken?: string | null,
  adminToken?: string | null
) {
  const base = getBaseUrl();
  const token = accessToken?.trim();
  const draftPath =
    order.draftId && token
      ? `${base}/draft/${order.draftId}?token=${encodeURIComponent(token)}`
      : null;
  const adminProjectPath = order.draftId
    ? `${base}/admin/projects/${order.draftId}`
    : null;
  const directEditPath =
    adminProjectPath && adminToken?.trim()
      ? `${adminProjectPath}?token=${encodeURIComponent(adminToken.trim())}`
      : null;
  return { draftPath, adminProjectPath, directEditPath };
}

export async function sendAdminOrderEmail(order: PaymentOrderRecord) {
  const from = process.env.EMAIL_FROM?.trim() || "Donepage <hello@donepage.co>";
  const to = getAdminEmail();
  if (!to) return { ok: false as const, error: "missing_admin_email" };

  const project = order.draftId ? await getProjectById(order.draftId) : null;
  const contactEmail =
    typeof project?.answers?.contactEmail === "string" ? project.answers.contactEmail : order.email;
  const clientName =
    (typeof project?.answers?.clientName === "string" && project.answers.clientName.trim()) ||
    (typeof project?.answers?.businessName === "string" && project.answers.businessName.trim()) ||
    order.clientName ||
    "";
  const accessToken = project?.accessToken || null;
  const base = getBaseUrl();
  const adminToken = process.env.ADMIN_TOKEN?.trim();
  const { draftPath, adminProjectPath, directEditPath } = buildOrderLinks(order, accessToken, adminToken);
  const adminProjectUrl =
    directEditPath || null;
  const adminOrdersUrl = `${base}/admin`;
  const summary = buildQuestionnaireSummary(project?.answers);
  const subject = `New Donepage order — ${formatPlanLabel(order.plan)} — ${contactEmail || "unknown"}`;
  const paymentStatus = "paid";
  const previewUrl = draftPath || `${base}/draft/${order.draftId || ""}`;
  const summaryText =
    summary.length > 0
      ? [
          "",
          "Questionnaire summary",
          ...summary.map((item) => `${item.label}: ${item.value}`),
        ].join("\n")
      : "";
  const summaryHtml =
    summary.length > 0
      ? `
        <div style="margin-top:24px; padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.08); background:#111111;">
          <div style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#BFA76A; margin-bottom:14px;">Questionnaire summary</div>
          ${summary
            .map(
              (item) =>
                `<p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">${item.label}:</strong> ${item.value}</p>`
            )
            .join("")}
        </div>
      `
      : "";

  const text = [
    "NEW DONEPAGE ORDER",
    "",
    `Client email: ${contactEmail || "not provided"}`,
    `Client name: ${clientName || "not provided"}`,
    `Plan: ${formatPlanLabel(order.plan)}`,
    `Stripe payment status: ${paymentStatus}`,
    `Amount: ${formatMoney(order.amount)}`,
    `Draft ID: ${order.draftId || "missing"}`,
    `Purchase date: ${formatPurchaseDate(order.createdAt)}`,
    `Preview: ${previewUrl || "missing"}`,
    directEditPath ? `Edit draft: ${directEditPath}` : "",
    `Orders dashboard: ${adminOrdersUrl}`,
    summaryText,
  ].join("\n");

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#0A0A0A; color:#fff; padding:32px;">
      <div style="max-width:720px; margin:0 auto; background:#111111; border:1px solid rgba(255,255,255,0.08); border-radius:28px; padding:32px;">
        <p style="font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#BFA76A; margin:0 0 16px;">Donepage</p>
        <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size:32px; line-height:1.1; margin:0 0 18px;">New order received</h1>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Client email:</strong> ${contactEmail || "not provided"}</p>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Client name:</strong> ${clientName || "not provided"}</p>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Selected plan:</strong> ${formatPlanLabel(order.plan)}</p>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Stripe payment status:</strong> ${paymentStatus}</p>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Amount:</strong> ${formatMoney(order.amount)}</p>
        <p style="margin:0 0 10px; color:#D9D9D9;"><strong style="color:#fff;">Draft ID:</strong> ${order.draftId || "missing"}</p>
        <p style="margin:0 0 18px; color:#D9D9D9;"><strong style="color:#fff;">Purchase date:</strong> ${formatPurchaseDate(order.createdAt)}</p>

        <div style="display:flex; flex-wrap:wrap; gap:12px; margin:22px 0 10px;">
          ${
            previewUrl
              ? `<a href="${previewUrl}" style="display:inline-block; padding:14px 18px; border-radius:999px; background:#fff; color:#0A0A0A; text-decoration:none; font-weight:600;">Open draft preview</a>`
              : ""
          }
          ${
            directEditPath
              ? `<a href="${directEditPath}" style="display:inline-block; padding:14px 18px; border-radius:999px; background:#127A66; color:#fff; text-decoration:none; font-weight:600;">Edit draft</a>`
              : ""
          }
          <a href="${adminOrdersUrl}" style="display:inline-block; padding:14px 18px; border-radius:999px; border:1px solid rgba(255,255,255,0.14); color:#fff; text-decoration:none; font-weight:600;">Open admin dashboard</a>
        </div>

        ${
          previewUrl
            ? `<p style="margin:16px 0 0; color:#D9D9D9;"><strong style="color:#fff;">Preview:</strong> <a href="${previewUrl}" style="color:#fff;">${previewUrl}</a></p>`
            : ""
        }
        ${
          directEditPath
            ? `<p style="margin:16px 0 0; color:#D9D9D9;"><strong style="color:#fff;">Edit:</strong> <a href="${directEditPath}" style="color:#fff;">${directEditPath}</a></p>`
            : ""
        }
        ${summaryHtml}
      </div>
    </div>
  `;

  return await sendMail({ from, to, subject, text, html });
}

export async function sendCustomerOrderEmail(order: PaymentOrderRecord) {
  if (!order.email) return { ok: false as const, error: "missing_customer_email" };

  const from = process.env.EMAIL_FROM?.trim() || "Donepage <hello@donepage.co>";
  const project = order.draftId ? await getProjectById(order.draftId) : null;
  const accessToken = project?.accessToken || null;
  const { draftPath } = buildOrderLinks(order, accessToken);

  const subject = "Your Donepage order is confirmed";
  const text = [
    "Your page is now in progress.",
    "",
    "We’ll review your draft and start refining it.",
    `You’ll hear from us within ${order.plan === "growth" ? "48" : "72"} hours.`,
    draftPath ? "" : "",
    draftPath ? `Preview your page: ${draftPath}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Your page is now in progress.</p>
    <p>We’ll review your draft and start refining it.</p>
    <p>You’ll hear from us within ${order.plan === "growth" ? "48" : "72"} hours.</p>
    ${draftPath ? `<p><a href="${draftPath}">Preview your page</a></p>` : ""}
  `;

  return await sendMail({ from, to: order.email, subject, text, html });
}
