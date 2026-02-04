// app/generator/generator-client.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Questionnaire,
  type QuestionnaireAnswers,
} from "@/app/components/questionnaire";

type Props = {
  onSave: (
    slug: string,
    answers: QuestionnaireAnswers
  ) => Promise<{ ok: boolean; slug: string }>;

  // ✅ برای مدل B
  editSlug?: string | null;
  initialAnswers?: QuestionnaireAnswers | null;
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

type StoredLandingLocal = {
  answers?: QuestionnaireAnswers;
  createdAt?: number;
  updatedAt?: number;
};

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function GeneratorClient({
  onSave,
  editSlug = null,
  initialAnswers = null,
}: Props) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers | null>(
    initialAnswers
  );
  const [loading, setLoading] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // ✅ اگر editSlug هست ولی سرور داده نداد، از localStorage همان slug را هم چک کن
  React.useEffect(() => {
    setHydrated(true);

    if (!editSlug) return;
    if (initialAnswers) return; // سرور داده داده
    if (answers) return; // قبلاً پیدا شده

    const key = `landing:${editSlug}`;
    const parsed = safeParseJSON<StoredLandingLocal>(localStorage.getItem(key));
    if (parsed?.answers) {
      setAnswers(parsed.answers);
      return;
    }
  }, [editSlug, initialAnswers, answers]);

  async function handleGenerate(finalAnswers: QuestionnaireAnswers) {
    setLoading(true);

    try {
      const slugToUse = editSlug || makeSlug(finalAnswers);

      // 1) Save server-side (KV/memory) — createdAt on server is preserved
      await onSave(slugToUse, finalAnswers);

      // 2) Client fallback cache (preserve createdAt if exists)
      const key = `landing:${slugToUse}`;
      const existing = safeParseJSON<StoredLandingLocal>(localStorage.getItem(key));
      const now = Date.now();

      localStorage.setItem(
        key,
        JSON.stringify({
          answers: finalAnswers,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        })
      );

      // 3) Navigate back to the landing page
      if (editSlug) toast.success("Updated successfully");
      else toast.success("Generated successfully");

      router.push(`/${slugToUse}`);
    } catch (e: any) {
      toast.error(e?.message ?? (editSlug ? "Update failed" : "Generate failed"));
    } finally {
      setLoading(false);
    }
  }

  // UI اصلی Questionnaire دست نخورده — فقط حالت edit بهتر UX می‌گیرد
  if (!hydrated && editSlug && !answers) {
    return <div className="sr-only">Loading</div>;
  }

  return (
    <>
      <Questionnaire
        // ✅ فرم را با initialAnswers پر کن
        initialAnswers={answers ?? undefined}
        onChange={(a) => setAnswers(a)}
        onGenerate={(a) => handleGenerate(a)}
      />

      {/* بدون تغییر UI اصلی */}
      {loading ? <div className="sr-only">Loading</div> : null}
    </>
  );
}
