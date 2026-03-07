import type { Metadata } from "next";
import Link from "next/link";
import { hasAdminToken } from "@/app/lib/admin-auth";
import { computeOrderStats, getOrderById, listOrders, type OrderRecord } from "@/app/lib/order-store";
import ProjectsTable from "@/app/admin/projects-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | Donepage",
  robots: { index: false, follow: false },
};

function matchesFilters(order: OrderRecord, q: {
  plan?: string;
  status?: string;
  from?: string;
  to?: string;
}) {
  if (q.plan && order.plan !== q.plan) return false;
  if (q.status && order.fulfillmentStatus !== q.status) return false;
  const created = new Date(order.createdAt).getTime();
  if (q.from) {
    const from = new Date(q.from).getTime();
    if (Number.isFinite(from) && created < from) return false;
  }
  if (q.to) {
    const to = new Date(q.to).getTime();
    if (Number.isFinite(to) && created > to + 24 * 60 * 60 * 1000) return false;
  }
  return true;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    plan?: string;
    status?: string;
    from?: string;
    to?: string;
    order?: string;
  }>;
}) {
  const sp = await searchParams;
  const token = sp.token || "";
  if (!hasAdminToken(token)) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">403</h1>
        <p className="mt-3 text-gray-700">Admin token is required.</p>
      </main>
    );
  }

  const [stats, allOrders] = await Promise.all([computeOrderStats(), listOrders()]);
  const orders = allOrders.filter((o) =>
    matchesFilters(o, { plan: sp.plan, status: sp.status, from: sp.from, to: sp.to })
  );
  const selectedOrder = sp.order ? await getOrderById(sp.order) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Donepage Admin</h1>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Total Orders</div><div className="text-2xl font-semibold">{stats.totalOrders}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Orders This Month</div><div className="text-2xl font-semibold">{stats.ordersThisMonth}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Paid Orders</div><div className="text-2xl font-semibold">{stats.paidOrders}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Launch / Growth</div><div className="text-2xl font-semibold">{stats.launchCount} / {stats.growthCount}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">QA Pending</div><div className="text-2xl font-semibold">{stats.qaPendingCount}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Published</div><div className="text-2xl font-semibold">{stats.publishedCount}</div></div>
        <div className="rounded-xl border p-4"><div className="text-sm text-gray-600">Hosting Add-ons</div><div className="text-2xl font-semibold">{stats.hostingAddOnCount}</div></div>
      </section>

      <section className="mt-8 rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <form className="mt-3 grid gap-3 sm:grid-cols-4">
          <input type="hidden" name="token" value={token} />
          <select name="plan" defaultValue={sp.plan || ""} className="h-10 rounded-md border px-2">
            <option value="">All plans</option>
            <option value="launch">Launch</option>
            <option value="growth">Growth</option>
          </select>
          <select name="status" defaultValue={sp.status || ""} className="h-10 rounded-md border px-2">
            <option value="">All statuses</option>
            <option value="qa_pending">qa_pending</option>
            <option value="published">published</option>
            <option value="draft_generated">draft_generated</option>
          </select>
          <input name="from" type="date" defaultValue={sp.from || ""} className="h-10 rounded-md border px-2" />
          <input name="to" type="date" defaultValue={sp.to || ""} className="h-10 rounded-md border px-2" />
          <button className="h-10 rounded-md bg-blue-600 px-4 text-white">Apply</button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Created</th>
                <th className="py-2">Business</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Status</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Draft</th>
                <th className="py-2">Live</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b align-top">
                  <td className="py-2">{fmtDate(o.createdAt)}</td>
                  <td className="py-2">{o.businessName}</td>
                  <td className="py-2">{o.plan}</td>
                  <td className="py-2">{o.fulfillmentStatus}</td>
                  <td className="py-2">{o.paymentStatus}</td>
                  <td className="py-2">
                    <a className="text-blue-700 underline" href={o.draftUrl} target="_blank" rel="noreferrer">Open Draft</a>
                  </td>
                  <td className="py-2">
                    {o.publishedUrl ? (
                      <a className="text-blue-700 underline" href={o.publishedUrl} target="_blank" rel="noreferrer">Open Live</a>
                    ) : (
                      <span className="text-gray-500">Not published</span>
                    )}
                  </td>
                  <td className="py-2">
                    <Link
                      className="text-blue-700 underline"
                      href={`/admin?token=${encodeURIComponent(token)}&order=${encodeURIComponent(o.id)}`}
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder ? (
        <section className="mt-8 rounded-xl border p-4">
          <h2 className="text-xl font-semibold">Order Detail</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div><span className="font-semibold">ID:</span> {selectedOrder.id}</div>
            <div><span className="font-semibold">Business:</span> {selectedOrder.businessName}</div>
            <div><span className="font-semibold">Email:</span> {selectedOrder.customerEmail}</div>
            <div><span className="font-semibold">Plan:</span> {selectedOrder.plan}</div>
            <div><span className="font-semibold">Status:</span> {selectedOrder.fulfillmentStatus}</div>
            <div><span className="font-semibold">Payment session:</span> {selectedOrder.paymentSessionId || "missing (soft proof only)"}</div>
            <div><span className="font-semibold">Draft:</span> <a className="text-blue-700 underline" href={selectedOrder.draftUrl} target="_blank" rel="noreferrer">{selectedOrder.draftUrl}</a></div>
            {selectedOrder.publishedUrl ? (
              <div><span className="font-semibold">Published:</span> <a className="text-blue-700 underline" href={selectedOrder.publishedUrl} target="_blank" rel="noreferrer">{selectedOrder.publishedUrl}</a></div>
            ) : null}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-sm font-semibold">Brief Answers</div>
            <pre className="overflow-x-auto rounded-lg border bg-gray-50 p-3 text-xs">
              {JSON.stringify(selectedOrder.briefAnswers, null, 2)}
            </pre>
          </div>

          <form
            action="/api/admin/order-note"
            method="post"
            className="mt-5 space-y-2"
          >
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="orderId" value={selectedOrder.id} />
            <label className="text-sm font-semibold">Internal Notes</label>
            <textarea
              name="notes"
              defaultValue={selectedOrder.notesInternal || ""}
              className="min-h-24 w-full rounded-md border px-3 py-2"
            />
            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Save Notes</button>
          </form>

          <form action="/api/admin/publish" method="post" className="mt-5">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="orderId" value={selectedOrder.id} />
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Publish</button>
          </form>

          {selectedOrder.publishedUrl ? (
            <div className="mt-5">
              <div className="mb-2 text-sm font-semibold">Customer message (copy)</div>
              <textarea
                readOnly
                className="min-h-24 w-full rounded-md border bg-gray-50 px-3 py-2 text-sm"
                value={`Your Donepage is live: ${selectedOrder.publishedUrl}`}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      <ProjectsTable token={token} />
    </main>
  );
}
