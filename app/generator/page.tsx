// app/generator/page.tsx
import GeneratorClient from "./generator-client";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { saveDraftBySlug, getDraftBySlug } from "@/app/lib/answers-store";

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

async function saveLandingAction(slug: string, answers: QuestionnaireAnswers) {
  "use server";
  const saved = await saveDraftBySlug(slug, answers);
  return { ok: true, slug: saved.slug };
}

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const editSlug = sanitizeSlug(sp.edit ?? "");

  const stored = editSlug ? await getDraftBySlug(editSlug) : null;

  return (
    <GeneratorClient
      onSave={saveLandingAction}
      editSlug={editSlug || null}
      initialAnswers={stored?.answers ?? null}
    />
  );
}
