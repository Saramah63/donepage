// app/lib/store.ts
// app/lib/store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

const mem = new Map<string, QuestionnaireAnswers>();

export async function getAnswersBySlug(slug: string) {
  return mem.get(slug) ?? null;
}

export async function setAnswersBySlug(slug: string, answers: QuestionnaireAnswers) {
  mem.set(slug, answers);
}

export type PublishedPage = {
  slug: string;
  createdAt: number;
  answers: any;
  content: any;
};

declare global {
  var __DONEPAGE_STORE__: Map<string, PublishedPage> | undefined;
}

export const store =
  globalThis.__DONEPAGE_STORE__ ?? (globalThis.__DONEPAGE_STORE__ = new Map());

export function makeSlug(base: string) {
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

  const rand = Math.random().toString(36).slice(2, 8);
  return `${cleaned || "page"}-${rand}`;
}
