import { notFound } from "next/navigation";
import { getProposal, defaultProposal } from "@/app/lib/proposal-store";
import { getAnswersBySlug } from "@/app/lib/answers-store";
import ProposalClient from "./proposal-client";
import { headers } from "next/headers";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = sanitizeSlug(rawSlug);

  const stored = await getAnswersBySlug(slug);
  if (!stored) return notFound();

  const hdrs = await headers();
  const host =
    hdrs.get("x-forwarded-host") ||
    hdrs.get("host") ||
    (process.env.VERCEL_URL ?? "");
  const proto = hdrs.get("x-forwarded-proto") || "http";
  const requestBase = host ? `${proto}://${host}` : "http://localhost:3000";

  const base =
    process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL
      : requestBase;

  const previewLink = `${base.replace(/\/$/, "")}/preview/${slug}?mode=draft`;
  const proposalLink = `${base.replace(/\/$/, "")}/proposal/${slug}`;

  const proposal = (await getProposal(slug)) ?? defaultProposal(stored.answers ?? stored, previewLink, proposalLink);

  return <ProposalClient proposal={proposal} previewLink={previewLink} />;
}
