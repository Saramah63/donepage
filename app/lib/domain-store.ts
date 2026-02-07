// app/lib/domain-store.ts
type DomainMapping = {
  slug: string;
  updatedAt: number;
  verifiedAt?: number;
  verifiedEmail?: string;
};

const KEY_PREFIX = "domain:";

const keyDomain = (domain: string) => `${KEY_PREFIX}${domain}`;

/** Local dev fallback if KV env is missing */
declare global {
  var __donepageDomainStore: Map<string, any> | undefined;
}

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageDomainStore) global.__donepageDomainStore = new Map();
  return global.__donepageDomainStore;
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

async function getKV<T>(key: string): Promise<T | null> {
  const client = await getKvClient();
  if (client) return (await client.get<T>(key)) ?? null;
  const store = memStore();
  return (store.get(key) as T) ?? null;
}

async function setKV<T>(key: string, value: T) {
  const client = await getKvClient();
  if (client) {
    await (client.set as any)(key, value);
    return;
  }
  const store = memStore();
  store.set(key, value);
}

function normalizeDomain(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
}

export function sanitizeDomain(input: string) {
  return normalizeDomain(input);
}

export async function setDomainMapping(domainRaw: string, slug: string) {
  const domain = normalizeDomain(domainRaw);
  if (!domain) return null;
  const existing = await getDomainMapping(domain);
  const value: DomainMapping = {
    slug,
    updatedAt: Date.now(),
    verifiedAt: existing?.verifiedAt,
    verifiedEmail: existing?.verifiedEmail,
  };
  await setKV(keyDomain(domain), value);
  return value;
}

export async function getDomainMapping(domainRaw: string) {
  const domain = normalizeDomain(domainRaw);
  if (!domain) return null;
  return await getKV<DomainMapping>(keyDomain(domain));
}

export async function setDomainVerified(domainRaw: string, email: string) {
  const domain = normalizeDomain(domainRaw);
  if (!domain) return null;
  const existing = await getDomainMapping(domain);
  if (!existing) return null;
  const value: DomainMapping = {
    ...existing,
    verifiedAt: Date.now(),
    verifiedEmail: email,
  };
  await setKV(keyDomain(domain), value);
  return value;
}
