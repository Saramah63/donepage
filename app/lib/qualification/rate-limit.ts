import crypto from "crypto";
import { getPersistentKV, setPersistentKV } from "@/app/lib/persistent-kv";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashIp(ip: string) {
  const salt = process.env.QUALIFY_HASH_SALT || "donepage_default_salt";
  return sha256(`${salt}:${ip}`);
}

export async function checkRateLimit(ipHash: string) {
  const key = `rate:qualify:${ipHash}`;
  const current = (await getPersistentKV<number>(key)) ?? 0;
  if (current >= 20) return false;
  await setPersistentKV(key, current + 1, { ex: 60 });
  return true;
}

