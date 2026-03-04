import type { Metadata } from "next";
import { redirect, forbidden } from "next/navigation";
import { getOrderById } from "@/app/lib/order-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Live Status | Donepage",
  robots: { index: false, follow: false },
};

export default async function LiveByTokenPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; token?: string }>;
}) {
  const sp = await searchParams;
  const orderId = (sp.order ?? "").trim();
  const token = (sp.token ?? "").trim();
  if (!orderId || !token) forbidden();

  const order = await getOrderById(orderId);
  if (!order || order.accessToken !== token) forbidden();

  if (order.publishedUrl) redirect(order.publishedUrl);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Still in review</h1>
      <p className="mt-3 text-gray-700">
        Your page is in QA and will be published soon.
      </p>
    </main>
  );
}
