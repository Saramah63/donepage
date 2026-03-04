import type { Metadata } from "next";
import { forbidden } from "next/navigation";
import { getOrderById } from "@/app/lib/order-store";
import { getDraftBySlug } from "@/app/lib/answers-store";
import PreviewClient from "./[slug]/preview-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Draft Preview | Donepage",
  robots: { index: false, follow: false },
};

export default async function PreviewByTokenPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; token?: string; publish?: string }>;
}) {
  const sp = await searchParams;
  const orderId = (sp.order ?? "").trim();
  const token = (sp.token ?? "").trim();
  const publish = (sp.publish ?? "").trim();

  if (!orderId || !token) forbidden();

  const order = await getOrderById(orderId);
  if (!order || order.accessToken !== token) forbidden();

  const draft = await getDraftBySlug(order.draftSlug);

  if (!draft?.answers) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Draft is being prepared</h1>
        <p className="mt-3 text-gray-700">
          Your brief was received. Please check this link again shortly.
        </p>
      </main>
    );
  }

  return (
    <PreviewClient
      slug={order.draftSlug}
      version={draft.version ?? 1}
      answers={draft.answers}
      requestedMode="draft"
      usedDraftFallback={false}
    />
  );
}
