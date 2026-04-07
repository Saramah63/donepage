import type { Metadata } from "next";
import Link from "next/link";
import { listPaymentOrders } from "@/app/lib/payment-orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | Donepage",
  robots: { index: false, follow: false },
};

function fmtDate(value: string | Date) {
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return String(value);
  }
}

function formatPlan(plan: string) {
  return plan === "growth" ? "Growth" : plan === "launch" ? "Launch" : plan;
}

function statusClasses(status: string) {
  if (status === "delivered") return "bg-[#127A66]/18 text-[#9EE2C8]";
  if (status === "in_progress") return "bg-[#BFA76A]/14 text-[#F1E7C8]";
  return "bg-white/10 text-white/82";
}

export default async function AdminPage() {
  const orders = await listPaymentOrders();

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1100px]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
            Admin
          </p>
          <h1
            className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Admin
          </h1>
          <p className="mt-4 text-base leading-7 text-white/68">
            Track paid orders and manage delivery.
          </p>
        </div>

        <section className="mt-10 overflow-hidden rounded-[28px] border border-white/8 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-white/8 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/52">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/52">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/52">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/52">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/52" />
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-white/60">
                      No paid orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/8 last:border-b-0">
                      <td className="px-6 py-5 text-sm text-white">{order.email || "—"}</td>
                      <td className="px-6 py-5 text-sm text-white/82">{formatPlan(order.plan)}</td>
                      <td className="px-6 py-5">
                        <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusClasses(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-white/58">{fmtDate(order.createdAt)}</td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/order/${order.id}`}
                          className="rounded-full border border-white/20 px-4 py-2 text-xs text-white transition hover:bg-white hover:text-black"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
