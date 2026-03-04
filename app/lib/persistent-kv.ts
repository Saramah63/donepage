import { prisma } from "@/app/lib/prisma";

declare global {
  // eslint-disable-next-line no-var
  var __donepageMemoryStore:
    | Map<string, { value: unknown; expiresAt?: number }>
    | undefined;
}

type KvModule = typeof import("@vercel/kv");
let kvClient: KvModule["kv"] | null = null;
let warnedNoKV = false;

function hasVercelKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageMemoryStore) {
    global.__donepageMemoryStore = new Map();
  }
  return global.__donepageMemoryStore;
}

async function getKvClient() {
  if (!hasVercelKV()) {
    if (!warnedNoKV) {
      console.warn(
        "Persistent storage fallback in use. Configure DATABASE_URL (recommended) or KV_REST_API_URL/KV_REST_API_TOKEN."
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

export async function getPersistentKV<T>(key: string): Promise<T | null> {
  if (prisma) {
    try {
      const row = await prisma.keyValueStore.findUnique({ where: { key } });
      if (!row) return null;
      if (row.expiresAt && row.expiresAt.getTime() <= Date.now()) {
        await prisma.keyValueStore.delete({ where: { key } }).catch(() => {});
        return null;
      }
      return row.value as T;
    } catch (e: any) {
      // DB schema might not be migrated yet (e.g. P2021 table missing)
      if (!warnedNoKV) {
        console.warn(
          `Persistent DB store unavailable (${e?.code ?? "unknown"}). Falling back to KV/memory.`
        );
        warnedNoKV = true;
      }
    }
  }

  const client = await getKvClient();
  if (client) return (await client.get<T>(key)) ?? null;

  const item = memStore().get(key);
  if (!item) return null;
  if (item.expiresAt && item.expiresAt <= Date.now()) {
    memStore().delete(key);
    return null;
  }
  return item.value as T;
}

export async function setPersistentKV<T>(
  key: string,
  value: T,
  opts?: { ex?: number }
) {
  if (prisma) {
    try {
      const expiresAt =
        typeof opts?.ex === "number"
          ? new Date(Date.now() + opts.ex * 1000)
          : null;
      await prisma.keyValueStore.upsert({
        where: { key },
        create: { key, value: value as any, expiresAt },
        update: { value: value as any, expiresAt },
      });
      return;
    } catch (e: any) {
      if (!warnedNoKV) {
        console.warn(
          `Persistent DB store unavailable (${e?.code ?? "unknown"}). Falling back to KV/memory.`
        );
        warnedNoKV = true;
      }
    }
  }

  const client = await getKvClient();
  if (client) {
    await (client.set as any)(key, value, opts ?? undefined);
    return;
  }

  memStore().set(key, {
    value,
    expiresAt:
      typeof opts?.ex === "number"
        ? Date.now() + opts.ex * 1000
        : undefined,
  });
}

export async function delPersistentKV(key: string) {
  if (prisma) {
    try {
      await prisma.keyValueStore.delete({ where: { key } }).catch(() => {});
      return;
    } catch (e: any) {
      if (!warnedNoKV) {
        console.warn(
          `Persistent DB store unavailable (${e?.code ?? "unknown"}). Falling back to KV/memory.`
        );
        warnedNoKV = true;
      }
    }
  }

  const client = await getKvClient();
  if (client) {
    await client.del(key);
    return;
  }

  memStore().delete(key);
}
