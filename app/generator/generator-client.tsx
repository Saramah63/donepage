// app/generator/generator-client.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Questionnaire, type QuestionnaireAnswers } from "@/app/components/questionnaire";

type Props = {
  onSave: (slug: string, answers: QuestionnaireAnswers) => Promise<{ ok: boolean; slug: string }>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

function makeSlug(answers: QuestionnaireAnswers) {
  const base =
    (answers as any)?.businessName ||
    (answers as any)?.brandName ||
    (answers as any)?.name ||
    "landing";

  const s = slugify(String(base));
  const suffix = Math.random().toString(36).slice(2, 7);
  return s ? `${s}-${suffix}` : `landing-${suffix}`;
}

export default function GeneratorClient({ onSave }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleGenerate(finalAnswers: QuestionnaireAnswers) {
    setLoading(true);
    setError(null);

    try {
      const slug = makeSlug(finalAnswers);

      // 1) Save server-side (KV/memory)
      await onSave(slug, finalAnswers);

      // 2) Client fallback cache (same key prefix as server)
      const now = Date.now();
      localStorage.setItem(
        `landing:${slug}`,
        JSON.stringify({ answers: finalAnswers, createdAt: now, updatedAt: now })
      );

      // 3) Navigate to generated page
      router.push(`/${slug}`);
    } catch (e: any) {
      setError(e?.message ?? "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* UI unchanged — Questionnaire خودِ فرم/استپ‌هاست */}
      <Questionnaire
        initialAnswers={answers ?? undefined}
        onChange={(a) => setAnswers(a)}
        onGenerate={(a) => handleGenerate(a)}
      />

      {/* بدون تغییر UI اصلی: فقط اگر خواستی خطا را ببینی */}
      {error ? <div className="sr-only">{error}</div> : null}
      {loading ? <div className="sr-only">Loading</div> : null}
    </>
  );
}
