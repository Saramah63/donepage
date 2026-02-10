import { notFound } from "next/navigation";
import { resolveEditToken } from "@/app/lib/answers-store";
import ProposalEditor from "./proposal-editor";

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

export default async function ProposalEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const { token = "" } = await searchParams;
  const slug = sanitizeSlug(rawSlug);

  if (process.env.NODE_ENV === "production") {
    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) return notFound();
  }

  return <ProposalEditor slug={slug} token={token} />;
}
