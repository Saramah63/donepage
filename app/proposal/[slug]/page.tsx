import { notFound } from "next/navigation";
import { getProposal, defaultProposal } from "@/app/lib/proposal-store";
import { getAnswersBySlug } from "@/app/lib/answers-store";
import ProposalClient from "./proposal-client";

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

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const previewLink = `${base.replace(/\/$/, "")}/preview/${slug}?mode=draft`;
  const proposalLink = `${base.replace(/\/$/, "")}/proposal/${slug}`;

  const proposal = (await getProposal(slug)) ?? defaultProposal(stored.answers ?? stored, previewLink, proposalLink);

  return <ProposalClient proposal={proposal} previewLink={previewLink} />;
}
