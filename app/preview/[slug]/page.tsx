import { notFound } from "next/navigation";
import { resolveEditToken, listVersions, getAnswersByVersion } from "@/app/lib/answers-store";
import PreviewClient from "./preview-client";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string; v?: string; mode?: "draft" | "published" }>;
}) {
  const { slug: rawSlug } = await params;
  const sp = await searchParams;
  const slug = sanitizeSlug(rawSlug);

  const mode = sp.mode || "draft";
  const parsedV = sp.v ? Number(sp.v) : null;
  const explicitV = Number.isFinite(parsedV) && (parsedV as number) > 0 ? (parsedV as number) : null;

  const token = sp.token || "";
  if (token) {
    const ok = await resolveEditToken(slug, token);
    if (!ok.ok) return notFound();
  } else if (process.env.NODE_ENV === "production") {
    // Allow draft previews without token (public share). Published preview remains public anyway.
    if (mode !== "draft") return notFound();
  }

  const st = await listVersions(slug);

  const targetV =
    explicitV ||
    (mode === "published" ? st.pointers.publishedVersion : st.pointers.draftVersion);

  if (!targetV) return notFound();

  const payload = await getAnswersByVersion(slug, targetV);
  const answers = (payload?.answers ?? null) as QuestionnaireAnswers | null;
  if (!answers) return notFound();

  return <PreviewClient slug={slug} version={targetV} answers={answers} />;
}
