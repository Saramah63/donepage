import { notFound } from "next/navigation";
import {
  resolveEditToken,
  listVersions,
  getAnswersByVersion,
  getAnswersBySlug,
  getPublishedBySlug,
  getDraftBySlug,
  publishBySlug,
  type StoredLanding,
} from "@/app/lib/answers-store";
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
  }

  const st = await listVersions(slug);
  const latestPublishedMeta = st.versions.find((v) => v.status === "published");
  const latestDraftMeta = st.versions.find((v) => v.status === "draft");

  async function resolveSnapshot(): Promise<{ snapshot: StoredLanding | null; usedDraftFallback: boolean }> {
    if (mode === "published") {
      if (explicitV) {
        const byExplicit = await getAnswersByVersion(slug, explicitV);
        if (byExplicit?.answers) return { snapshot: byExplicit, usedDraftFallback: byExplicit.status !== "published" };
      }

      const byPointerVersion = st.pointers.publishedVersion
        ? await getAnswersByVersion(slug, st.pointers.publishedVersion)
        : null;
      if (byPointerVersion?.answers) {
        return { snapshot: byPointerVersion, usedDraftFallback: byPointerVersion.status !== "published" };
      }

      const byPublishedPointer = await getPublishedBySlug(slug);
      if (byPublishedPointer?.answers) {
        return { snapshot: byPublishedPointer, usedDraftFallback: byPublishedPointer.status !== "published" };
      }

      const byLatestPublishedVersion = latestPublishedMeta
        ? await getAnswersByVersion(slug, latestPublishedMeta.version)
        : null;
      if (byLatestPublishedVersion?.answers) {
        return { snapshot: byLatestPublishedVersion, usedDraftFallback: byLatestPublishedVersion.status !== "published" };
      }

      // Owner convenience: if user opened published preview with a valid edit token
      // but there is no published snapshot yet, publish current draft automatically.
      if (token) {
        try {
          const auto = await publishBySlug(slug, undefined, "Auto-publish from published preview");
          const autoPub = await getAnswersByVersion(slug, auto.version);
          if (autoPub?.answers) {
            return { snapshot: autoPub, usedDraftFallback: false };
          }
        } catch {
          // keep graceful fallback below
        }
      }

      // Graceful fallback: show latest available snapshot instead of hard 404.
      const draft = await getDraftBySlug(slug);
      if (draft?.answers) return { snapshot: draft, usedDraftFallback: true };
      const any = await getAnswersBySlug(slug);
      return { snapshot: any, usedDraftFallback: true };
    }

    if (explicitV) {
      const byExplicit = await getAnswersByVersion(slug, explicitV);
      if (byExplicit?.answers) return { snapshot: byExplicit, usedDraftFallback: false };
    }

    const byPointerVersion = st.pointers.draftVersion
      ? await getAnswersByVersion(slug, st.pointers.draftVersion)
      : null;
    if (byPointerVersion?.answers) return { snapshot: byPointerVersion, usedDraftFallback: false };

    const byDraftPointer = await getDraftBySlug(slug);
    if (byDraftPointer?.answers) return { snapshot: byDraftPointer, usedDraftFallback: false };

    const byLatestDraftVersion = latestDraftMeta
      ? await getAnswersByVersion(slug, latestDraftMeta.version)
      : null;
    if (byLatestDraftVersion?.answers) return { snapshot: byLatestDraftVersion, usedDraftFallback: false };

    return { snapshot: await getAnswersBySlug(slug), usedDraftFallback: false };
  }

  const { snapshot, usedDraftFallback } = await resolveSnapshot();
  const answers = (snapshot?.answers ?? null) as QuestionnaireAnswers | null;
  if (!answers) return notFound();

  return (
    <PreviewClient
      slug={slug}
      version={snapshot?.version ?? 1}
      answers={answers}
      requestedMode={mode}
      usedDraftFallback={usedDraftFallback}
    />
  );
}
