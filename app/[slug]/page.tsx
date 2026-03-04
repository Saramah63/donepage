// app/[slug]/page.tsx
import {
  getDraftBySlug,
  getPublishedBySlug,
  getVersionBySlug,
} from "@/app/lib/answers-store";
import SlugClient from "./slug-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.donepage.co";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; v?: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const sp = (await searchParams) ?? {};
  const slug = sanitizeSlug(rawSlug);
  const preview = (sp.preview || "").toLowerCase();
  const v = Number(sp.v);
  const isPreview = preview === "draft" || (Number.isFinite(v) && v > 0);

  const published = await getPublishedBySlug(slug);
  const draft = await getDraftBySlug(slug);
  const source = published?.answers ?? draft?.answers ?? null;
  const businessName = source?.businessName?.trim() || "Landing Page";
  const primaryOffer = source?.primaryOffer?.trim() || "Professional Services";
  const country = source?.countryOther?.trim() || source?.country?.trim() || "";
  const audience = source?.targetAudience?.replace(/-/g, " ").trim() || "clients";
  const niche = source?.niche?.trim() || "";
  const proof = source?.proofLine?.trim() || "";
  const language = (source?.language || "english").toLowerCase();
  const locale = language.includes("persian")
    ? "fa_IR"
    : language.includes("arabic")
    ? "ar_SA"
    : language.includes("finnish") || language.includes("suomi")
    ? "fi_FI"
    : "en_US";
  const title = `${businessName} | ${primaryOffer}`;
  const description = country
    ? `${businessName} offers ${primaryOffer} for ${audience} in ${country}.${proof ? ` ${proof}` : ""}`
    : `${businessName} offers ${primaryOffer} for ${audience}.${proof ? ` ${proof}` : ""}`;
  const url = `${siteUrl.replace(/\/$/, "")}/${slug}`;
  const keywords = [
    businessName,
    primaryOffer,
    audience,
    country,
    niche,
    source?.serviceType,
    source?.keyDifferentiator,
    "landing page",
    "services",
    "Donepage",
  ]
    .filter(Boolean)
    .map((k) => String(k));

  return {
    title,
    description,
    keywords,
    category: "business",
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Donepage",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: isPreview || !published
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; v?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const sp = (await searchParams) ?? {};
  const slug = sanitizeSlug(rawSlug);

  const preview = (sp.preview || "").toLowerCase();
  const v = Number(sp.v);

  // 1) explicit version preview: /slug?v=12
  if (Number.isFinite(v) && v > 0) {
    const ver = await getVersionBySlug(slug, v);
    return (
      <SlugClient
        slug={slug}
        initialAnswers={ver?.answers ?? null}
        view={{
          mode: "version",
          status: ver?.status ?? "draft",
          version: v,
        }}
      />
    );
  }

  // 2) draft preview: /slug?preview=draft
  if (preview === "draft") {
    const draft = await getDraftBySlug(slug);
    return (
      <SlugClient
        slug={slug}
        initialAnswers={draft?.answers ?? null}
        view={{ mode: "draft", status: "draft", version: draft?.version ?? null }}
      />
    );
  }

  // 3) default: published first, else draft
  const published = await getPublishedBySlug(slug);
  if (published) {
    return (
      <SlugClient
        slug={slug}
        initialAnswers={published.answers}
        view={{
          mode: "published",
          status: "published",
          version: published.version,
        }}
      />
    );
  }

  const draft = await getDraftBySlug(slug);
  return (
    <SlugClient
      slug={slug}
      initialAnswers={draft?.answers ?? null}
      view={{ mode: "draft", status: "draft", version: draft?.version ?? null }}
    />
  );
}
