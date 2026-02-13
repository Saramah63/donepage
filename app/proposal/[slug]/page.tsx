import { notFound } from "next/navigation";
import { getProposal, defaultProposal, getProposalLang } from "@/app/lib/proposal-store";
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

  const answers = stored.answers ?? stored;
  const lang = getProposalLang(answers) as "en" | "fa" | "ar" | "fi";

  const baseEn = defaultProposal(answers, previewLink, proposalLink, "en");
  const baseLocalized = defaultProposal(answers, previewLink, proposalLink, lang);

  const mergeLocalized = (current: any) => {
    if (!current) return baseLocalized;
    if (lang === "en") return current;
    if (current.language && current.language === lang) return current;

    const next = { ...current };
    const shouldReplace = (key: keyof typeof baseEn) =>
      JSON.stringify(current[key]) === JSON.stringify(baseEn[key]);

    (["title", "context", "scope", "deliverables", "timeline", "guarantee", "ctaLabel", "messagePreview", "messageProposal"] as const).forEach(
      (k) => {
        if (shouldReplace(k)) (next as any)[k] = (baseLocalized as any)[k];
      }
    );

    if (!current.paymentLinks || Object.keys(current.paymentLinks).length === 0) {
      if (shouldReplace("investment")) (next as any).investment = baseLocalized.investment;
      if (shouldReplace("investmentOptions"))
        (next as any).investmentOptions = baseLocalized.investmentOptions;
    }

    (next as any).language = lang;
    return next;
  };

  const proposalRaw = await getProposal(slug);
  const proposal = mergeLocalized(proposalRaw ?? baseLocalized);

  return (
    <ProposalClient
      proposal={proposal}
      previewLink={previewLink}
      slug={slug}
      lang={lang}
    />
  );
}
