// app/lib/answers-store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import crypto from "crypto";

export type LandingStatus = "draft" | "published";

export type StoredLanding = {
  slug: string;
  status: LandingStatus;
  version: number;
  answers: QuestionnaireAnswers;

  /** first time ever created for this slug */
  createdAt: number;

  /** last save/publish time for THIS snapshot */
  updatedAt: number;

  /** set when status === "published" */
  publishedAt?: number;
};

export type VersionMeta = {
  version: number;
  status: LandingStatus;
  createdAt: number; // timestamp snapshot created
  publishedAt?: number;
  note?: string;
};

const KEY_PREFIX = "landing:";

const keyDraft = (slug: string) => `${KEY_PREFIX}${slug}:draft`;
const keyPublished = (slug: string) => `${KEY_PREFIX}${slug}:published`;
const keyVersion = (slug: string, v: number) => `${KEY_PREFIX}${slug}:v:${v}`;
const keyVersions = (slug: string) => `${KEY_PREFIX}${slug}:versions`;

/** token registry (hash -> payload) */
const keyEditToken = (tokenHash: string) => `editToken:${tokenHash}`;

/** Local dev fallback if KV env is missing */
declare global {
  var __donepageMemoryStore: Map<string, any> | undefined;
}

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageMemoryStore) global.__donepageMemoryStore = new Map();
  return global.__donepageMemoryStore;
}

type KvModule = typeof import("@vercel/kv");
let kvClient: KvModule["kv"] | null = null;
let warnedNoKV = false;

async function getKvClient() {
  if (!hasKV()) {
    if (!warnedNoKV) {
      console.warn(
        "KV is not configured. Falling back to in-memory store. Set KV_REST_API_URL and KV_REST_API_TOKEN."
      );
      warnedNoKV = true;
    }
    return null;
  }
  if (!kvClient) {
    const mod = await import("@vercel/kv");
    kvClient = mod.kv;
  }
  return kvClient;
}

/** KV wrapper (supports local in-memory fallback) */
async function getKV<T>(key: string): Promise<T | null> {
  const client = await getKvClient();
  if (client) return (await client.get<T>(key)) ?? null;
  const store = memStore();
  return (store.get(key) as T) ?? null;
}

async function setKV<T>(key: string, value: T, opts?: { ex?: number }) {
  const client = await getKvClient();
  if (client) {
    // @vercel/kv supports { ex } TTL
    await (client.set as any)(key, value, opts ?? undefined);
    return;
  }
  const store = memStore();
  store.set(key, value);
}

async function delKV(key: string) {
  const client = await getKvClient();
  if (client) {
    await client.del(key);
    return;
  }
  const store = memStore();
  store.delete(key);
}

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

/** -----------------------------
 * Versioning helpers
 * ------------------------------ */

async function pushVersionMeta(slug: string, meta: VersionMeta) {
  const k = keyVersions(slug);
  const list = (await getKV<VersionMeta[]>(k)) ?? [];
  // newest first is more convenient in UI
  list.unshift(meta);
  await setKV(k, list);
}

async function getNextVersion(slug: string): Promise<number> {
  const list = (await getKV<VersionMeta[]>(keyVersions(slug))) ?? [];
  const max = list.reduce((m, x) => (x.version > m ? x.version : m), 0);
  return max + 1;
}

export async function listVersionsBySlug(slugRaw: string): Promise<VersionMeta[]> {
  const slug = sanitizeSlug(slugRaw);
  return (await getKV<VersionMeta[]>(keyVersions(slug))) ?? [];
}

export async function listVersions(slugRaw: string): Promise<{
  versions: VersionMeta[];
  pointers: { draftVersion: number | null; publishedVersion: number | null };
}> {
  const slug = sanitizeSlug(slugRaw);
  const [versions, draft, published] = await Promise.all([
    listVersionsBySlug(slug),
    getDraftBySlug(slug),
    getPublishedBySlug(slug),
  ]);

  return {
    versions,
    pointers: {
      draftVersion: draft?.version ?? null,
      publishedVersion: published?.version ?? null,
    },
  };
}

export async function getDraftBySlug(slugRaw: string): Promise<StoredLanding | null> {
  const slug = sanitizeSlug(slugRaw);
  return await getKV<StoredLanding>(keyDraft(slug));
}

export async function getPublishedBySlug(slugRaw: string): Promise<StoredLanding | null> {
  const slug = sanitizeSlug(slugRaw);
  return await getKV<StoredLanding>(keyPublished(slug));
}

export async function getVersionBySlug(
  slugRaw: string,
  version: number
): Promise<StoredLanding | null> {
  const slug = sanitizeSlug(slugRaw);
  return await getKV<StoredLanding>(keyVersion(slug, Number(version)));
}

export async function getAnswersByVersion(
  slugRaw: string,
  version: number
): Promise<StoredLanding | null> {
  return await getVersionBySlug(slugRaw, version);
}

/**
 * Public read: returns published if exists, else null
 * (Public route باید draft را leak نکند)
 */
export async function getPublishedAnswersBySlug(
  slugRaw: string
): Promise<QuestionnaireAnswers | null> {
  const pub = await getPublishedBySlug(slugRaw);
  return pub?.answers ?? null;
}

/**
 * Backward compatibility:
 * - old code calls getAnswersBySlug(slug)
 * - we return published if exists, else draft (internal usage only)
 */
export async function getAnswersBySlug(slugRaw: string): Promise<StoredLanding | null> {
  const published = await getPublishedBySlug(slugRaw);
  if (published) return published;
  const draft = await getDraftBySlug(slugRaw);
  return draft ?? null;
}

/**
 * Save draft:
 * - creates a new immutable version snapshot
 * - updates draft pointer
 * - appends meta
 */
export async function saveDraftBySlug(
  slugRaw: string,
  answers: QuestionnaireAnswers,
  note?: string
): Promise<{ ok: true; slug: string; version: number }> {
  const slug = sanitizeSlug(slugRaw);
  const now = Date.now();

  const existingDraft = await getDraftBySlug(slug);
  const existingPublished = await getPublishedBySlug(slug);

  const createdAt = existingDraft?.createdAt ?? existingPublished?.createdAt ?? now;
  const version = await getNextVersion(slug);

  const record: StoredLanding = {
    slug,
    status: "draft",
    version,
    answers,
    createdAt,
    updatedAt: now,
  };

  // 1) immutable snapshot
  await setKV(keyVersion(slug, version), record);

  // 2) draft pointer
  await setKV(keyDraft(slug), record);

  // 3) meta
  await pushVersionMeta(slug, {
    version,
    status: "draft",
    createdAt: now,
    note: note?.slice(0, 140),
  });

  return { ok: true, slug, version };
}

/**
 * Publish:
 * - If answers provided: saves draft first (new version), then publishes that draft
 * - Else publishes current draft pointer
 *
 * IMPORTANT: publishing does NOT mutate old versions; it creates a NEW immutable snapshot (audit trail)
 */
export async function publishBySlug(
  slugRaw: string,
  answers?: QuestionnaireAnswers,
  note?: string
): Promise<{ ok: true; slug: string; version: number; publishedAt: number }> {
  const slug = sanitizeSlug(slugRaw);
  const now = Date.now();

  let draft: StoredLanding | null = null;

  if (answers) {
    const saved = await saveDraftBySlug(slug, answers, note ?? "Pre-publish draft");
    draft = await getVersionBySlug(slug, saved.version);
  } else {
    draft = await getDraftBySlug(slug);
  }

  if (!draft) throw new Error("Nothing to publish (draft not found)");

  const publishVersion = await getNextVersion(slug);

  const published: StoredLanding = {
    ...draft,
    status: "published",
    version: publishVersion,
    updatedAt: now,
    publishedAt: now,
  };

  // 1) immutable snapshot
  await setKV(keyVersion(slug, publishVersion), published);

  // 2) published pointer
  await setKV(keyPublished(slug), published);

  // 3) meta
  await pushVersionMeta(slug, {
    version: publishVersion,
    status: "published",
    createdAt: now,
    publishedAt: now,
    note: (note ?? "Published").slice(0, 140),
  });

  return { ok: true, slug, version: publishVersion, publishedAt: now };
}

/**
 * Rollback: restore a historical version as a NEW draft version (audit-safe)
 * (یعنی نسخه قدیمی دست نمی‌خورد، فقط ازش یک draft جدید ساخته می‌شود)
 */
export async function rollbackToDraftBySlug(
  slugRaw: string,
  version: number,
  note?: string
): Promise<{ ok: true; slug: string; version: number }> {
  const slug = sanitizeSlug(slugRaw);
  const record = await getVersionBySlug(slug, Number(version));
  if (!record?.answers) throw new Error("Version not found");
  const saved = await saveDraftBySlug(slug, record.answers, note ?? `Rollback from v${version}`);
  return { ok: true, slug, version: saved.version };
}

/** Rollback + publish in one go (optional convenience) */
export async function rollbackAndPublishBySlug(
  slugRaw: string,
  version: number
): Promise<{ ok: true; slug: string; version: number; publishedAt: number }> {
  const slug = sanitizeSlug(slugRaw);
  const rb = await rollbackToDraftBySlug(slug, version, `Rollback draft to v${version}`);
  return await publishBySlug(slug, undefined, `Rollback publish from v${version} (draft v${rb.version})`);
}

/**
 * Slug availability:
 * - if any draft/published pointer exists OR any versions exist => taken
 */
export async function slugExists(slugRaw: string): Promise<boolean> {
  const slug = sanitizeSlug(slugRaw);
  const d = await getKV<StoredLanding>(keyDraft(slug));
  if (d) return true;
  const p = await getKV<StoredLanding>(keyPublished(slug));
  if (p) return true;
  const vs = await getKV<VersionMeta[]>(keyVersions(slug));
  return Boolean(vs && vs.length > 0);
}

export async function isSlugTaken(slugRaw: string): Promise<boolean> {
  return await slugExists(slugRaw);
}

/** -----------------------------
 * Secure edit tokens (Model B)
 * ------------------------------ */

const EDIT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url"); // URL-safe
}

/**
 * Creates a new token for a slug:
 * - stores only HASH on server, never raw token
 * - TTL limits blast radius of leaked links
 */
export async function createEditTokenForSlug(slugRaw: string) {
  const slug = sanitizeSlug(slugRaw);
  const token = randomToken(32);
  const tokenHash = sha256(token);

  const now = Date.now();
  const payload = {
    slug,
    createdAt: now,
    expiresAt: now + EDIT_TOKEN_TTL_SECONDS * 1000,
  };

  await setKV(keyEditToken(tokenHash), payload, { ex: EDIT_TOKEN_TTL_SECONDS });

  return { token };
}

export async function setEditTokenForSlug(slugRaw: string, token: string) {
  const slug = sanitizeSlug(slugRaw);
  const tokenHash = sha256(token);

  const now = Date.now();
  const payload = {
    slug,
    createdAt: now,
    expiresAt: now + EDIT_TOKEN_TTL_SECONDS * 1000,
  };

  await setKV(keyEditToken(tokenHash), payload, { ex: EDIT_TOKEN_TTL_SECONDS });
}

/** Verifies token belongs to slug and is not expired */
export async function resolveEditToken(slugRaw: string, token: string) {
  const slug = sanitizeSlug(slugRaw);
  if (!token) return { ok: false as const, reason: "Missing token" };

  const tokenHash = sha256(token);
  const data = (await getKV(keyEditToken(tokenHash))) as
    | { slug: string; createdAt: number; expiresAt: number }
    | null;

  if (!data) return { ok: false as const, reason: "Invalid token" };
  if (data.slug !== slug) return { ok: false as const, reason: "Token/slug mismatch" };
  if (Date.now() > data.expiresAt) return { ok: false as const, reason: "Token expired" };

  return { ok: true as const };
}

/** Optional: revoke token (for rotation) */
export async function revokeEditToken(token: string) {
  if (!token) return;
  const tokenHash = sha256(token);
  await delKV(keyEditToken(tokenHash));
}

export async function saveDraftVersion(
  slugRaw: string,
  answers: QuestionnaireAnswers,
  note?: string
): Promise<{
  ok: true;
  version: number;
  state: Awaited<ReturnType<typeof listVersions>>;
}> {
  const saved = await saveDraftBySlug(slugRaw, answers, note);
  const state = await listVersions(slugRaw);
  return { ok: true, version: saved.version, state };
}

export async function publishVersion(
  slugRaw: string,
  version?: number
): Promise<{
  ok: true;
  version: number;
  state: Awaited<ReturnType<typeof listVersions>>;
}> {
  if (version && Number.isFinite(version)) {
    const slug = sanitizeSlug(slugRaw);
    const record = await getVersionBySlug(slug, Number(version));
    if (!record?.answers) throw new Error("Version not found");

    const now = Date.now();
    const publishVersion = await getNextVersion(slug);
    const published: StoredLanding = {
      ...record,
      status: "published",
      version: publishVersion,
      updatedAt: now,
      publishedAt: now,
    };

    await setKV(keyVersion(slug, publishVersion), published);
    await setKV(keyPublished(slug), published);
    await pushVersionMeta(slug, {
      version: publishVersion,
      status: "published",
      createdAt: now,
      publishedAt: now,
      note: `Published from v${version}`,
    });

    const state = await listVersions(slug);
    return { ok: true, version: publishVersion, state };
  }

  const p = await publishBySlug(slugRaw);
  const state = await listVersions(slugRaw);
  return { ok: true, version: p.version, state };
}

export async function rollbackToVersion(
  slugRaw: string,
  version: number,
  publishAlso: boolean
): Promise<{
  ok: true;
  version: number;
  state: Awaited<ReturnType<typeof listVersions>>;
}> {
  if (publishAlso) {
    const rb = await rollbackToDraftBySlug(slugRaw, version, `Rollback to v${version}`);
    const p = await publishBySlug(slugRaw, undefined, `Rollback publish from v${version}`);
    const state = await listVersions(slugRaw);
    return { ok: true, version: p.version, state };
  }

  const saved = await rollbackToDraftBySlug(slugRaw, version, `Rollback to v${version}`);
  const state = await listVersions(slugRaw);
  return { ok: true, version: saved.version, state };
}

export async function updateAnswersBySlug(
  slugRaw: string,
  answers: QuestionnaireAnswers
) {
  await saveDraftBySlug(slugRaw, answers, "Edit save");
}

/** -----------------------------
 * Backward compatibility shims
 * ------------------------------ */

/**
 * Old function name in parts of your code:
 * - map to saveDraftBySlug (keeps versioning)
 */
export async function saveAnswersBySlug(slug: string, answers: QuestionnaireAnswers) {
  await saveDraftBySlug(slug, answers, "Legacy saveAnswersBySlug()");
}
