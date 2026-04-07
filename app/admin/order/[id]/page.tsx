import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaymentOrderById, getPaymentOrderNote } from "@/app/lib/payment-orders";
import { hasAdminToken } from "@/app/lib/admin-auth";
import { getProjectById } from "@/app/lib/project-store";
import SaveOrderNotesForm from "@/app/admin/order/[id]/save-order-notes-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Order Detail | Donepage Admin",
  robots: { index: false, follow: false },
};

function formatPlan(plan: string) {
  return plan === "growth" ? "Growth" : plan === "launch" ? "Launch" : plan;
}

function formatDate(value: string | Date) {
  try {
    return new Date(value).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

function formatAmount(cents: number | null | undefined) {
  if (typeof cents !== "number") return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

function statusClasses(status: string) {
  if (status === "delivered") return "bg-[#127A66]/18 text-[#9EE2C8]";
  if (status === "in_progress") return "bg-[#BFA76A]/14 text-[#F1E7C8]";
  return "bg-white/10 text-white/82";
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getPaymentOrderById(id);

  if (!order) notFound();

  const project = order.draftId ? await getProjectById(order.draftId) : null;
  const note = await getPaymentOrderNote(order.id);
  const adminToken = process.env.ADMIN_TOKEN?.trim() || "";
  const previewUrl =
    order.draftId && project?.accessToken
      ? `/draft/${order.draftId}?token=${encodeURIComponent(project.accessToken)}`
      : null;
  const editUrl =
    order.draftId && hasAdminToken(adminToken)
      ? `/admin/projects/${order.draftId}?token=${encodeURIComponent(adminToken)}`
      : null;

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-sm text-white/60 transition hover:text-white">
          ← Back to admin
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">Order Details</h1>

        <div className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Field label="Email" value={order.email} />
          <Field label="Client Name" value={order.clientName ?? "N/A"} />
          <Field label="Plan" value={formatPlan(order.plan)} />
          <Field label="Status" value={order.status} badgeClass={statusClasses(order.status)} />
          <Field label="Amount" value={formatAmount(order.amount)} />
          <Field label="Draft ID" value={order.draftId ?? "N/A"} />
          <Field label="Stripe Session" value={order.stripeSessionId} />
          <Field label="Created" value={formatDate(order.createdAt)} />

          <div className="space-y-3 pt-2">
            <p className="text-sm text-white/60">Actions</p>

            <div className="flex flex-wrap gap-3">
              {previewUrl ? (
                <Link
                  href={previewUrl}
                  target="_blank"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Open Preview
                </Link>
              ) : (
                <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/40">
                  No Preview
                </span>
              )}

              {editUrl ? (
                <Link
                  href={editUrl}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
                >
                  Edit Draft
                </Link>
              ) : (
                <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/40">
                  No Edit Route
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-white/60">Notes</p>
            <SaveOrderNotesForm orderId={order.id} initialNote={note} initialStatus={order.status} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div>
      <p className="text-sm text-white/60">{label}</p>
      {badgeClass ? (
        <div className="mt-2">
          <span className={`rounded-full px-3 py-1 text-xs capitalize ${badgeClass}`}>{value}</span>
        </div>
      ) : (
        <p className="mt-1 break-all text-white">{value}</p>
      )}
    </div>
  );
}
