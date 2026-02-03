// app/lib/answers-store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { kv } from "@vercel/kv";

type StoredLanding = {
  answers: QuestionnaireAnswers;
  createdAt: number;
  updatedAt: number;
};

const KEY_PREFIX = "landing:";

// Fallback for local dev if KV env is missing
declare global {
  // eslint-disable-next-line no-var
  var __donepageMemoryStore: Map<string, StoredLanding> | undefined;
}

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageMemoryStore) global.__donepageMemoryStore = new Map();
  return global.__donepageMemoryStore;
}

export async function saveAnswersBySlug(slug: string, answers: QuestionnaireAnswers) {
  const now = Date.now();
  const key = `${KEY_PREFIX}${slug}`;

  if (hasKV()) {
    const existing = (await kv.get<StoredLanding>(key)) ?? null;
    const payload: StoredLanding = {
      answers,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await kv.set(key, payload);
    return;
  }

  // fallback
  const store = memStore();
  const existing = store.get(key);
  store.set(key, {
    answers,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export async function getAnswersBySlug(slug: string): Promise<StoredLanding | null> {
  const key = `${KEY_PREFIX}${slug}`;

  if (hasKV()) {
    const data = await kv.get<StoredLanding>(key);
    return data ?? null;
  }

  const store = memStore();
  return store.get(key) ?? null;
}
