import { cookies } from "next/headers";
import { getPersistentKV, setPersistentKV } from "@/app/lib/persistent-kv";
import { sendResendEmail } from "@/app/lib/resend";
import { renderOtpTemplate } from "@/emails/otp-template";
import {
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
  generateOtpCode,
  generateOtpSessionId,
  hashOtp,
  isValidOtpEmail,
  normalizeOtpEmail,
} from "@/app/lib/otp";

export const EMAIL_VERIFICATION_COOKIE = "dp_email_verification";

type VerificationRecord = {
  sessionId: string;
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  resendCount: number;
  lastSentAt: number;
  verified: boolean;
  verifiedAt?: number;
};

function key(sessionId: string) {
  return `email-verification:${sessionId}`;
}

export function normalizeEmail(email: string) {
  return normalizeOtpEmail(email);
}

export async function getVerificationRecord(sessionId: string) {
  return await getPersistentKV<VerificationRecord>(key(sessionId));
}

export async function getVerificationSessionIdFromCookie() {
  const jar = await cookies();
  return jar.get(EMAIL_VERIFICATION_COOKIE)?.value || "";
}

export async function getVerifiedEmailFromCookie() {
  const sessionId = await getVerificationSessionIdFromCookie();
  if (!sessionId) return null;
  const record = await getVerificationRecord(sessionId);
  if (!record?.verified) return null;
  return record.email;
}

export async function getVerificationStatus() {
  const sessionId = await getVerificationSessionIdFromCookie();
  if (!sessionId) return { email: "", verified: false, expiresAt: null as number | null };
  const record = await getVerificationRecord(sessionId);
  if (!record) return { email: "", verified: false, expiresAt: null as number | null };
  return {
    email: record.email,
    verified: record.verified,
    expiresAt: record.expiresAt,
  };
}

export async function sendVerificationCode(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!isValidOtpEmail(email)) {
    return { ok: false as const, status: 400, error: "Please enter a valid email address." };
  }

  const jar = await cookies();
  const existingSessionId = jar.get(EMAIL_VERIFICATION_COOKIE)?.value || "";
  const existing = existingSessionId ? await getVerificationRecord(existingSessionId) : null;
  const now = Date.now();

  if (existing && existing.email === email && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    return {
      ok: false as const,
      status: 429,
      error: "Please wait a moment before requesting a new code.",
      retryAfter: Math.ceil((existing.lastSentAt + OTP_RESEND_COOLDOWN_SECONDS * 1000 - now) / 1000),
    };
  }

  const sessionId = existing?.email === email ? existing.sessionId : generateOtpSessionId();
  const code = generateOtpCode();
  const record: VerificationRecord = {
    sessionId,
    email,
    otpHash: hashOtp(sessionId, code),
    expiresAt: now + OTP_TTL_SECONDS * 1000,
    attempts: 0,
    resendCount: (existing?.email === email ? existing.resendCount : 0) + 1,
    lastSentAt: now,
    verified: false,
  };

  await setPersistentKV(key(sessionId), record, { ex: OTP_TTL_SECONDS });
  jar.set(EMAIL_VERIFICATION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OTP_TTL_SECONDS,
  });

  const { subject, text, html } = renderOtpTemplate(code);
  const result = await sendResendEmail({
    to: email,
    subject,
    text,
    html,
  });

  if (!result.ok) {
    return { ok: false as const, status: 500, error: "We couldn't send the verification email right now." };
  }

  return {
    ok: true as const,
    email,
    expiresAt: record.expiresAt,
  };
}

export async function verifyCode(inputCode: string) {
  const code = inputCode.trim();
  const sessionId = await getVerificationSessionIdFromCookie();
  if (!sessionId) {
    return { ok: false as const, status: 400, error: "Start with your email first." };
  }

  const record = await getVerificationRecord(sessionId);
  if (!record) {
    return { ok: false as const, status: 410, error: "This code has expired. Request a new one." };
  }

  const now = Date.now();
  if (record.verified) {
    return { ok: true as const, email: record.email };
  }

  if (now > record.expiresAt) {
    return { ok: false as const, status: 410, error: "This code has expired. Request a new one." };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false as const, status: 429, error: "Too many attempts. Please request a new code." };
  }

  const nextAttempts = record.attempts + 1;
  const matches = hashOtp(sessionId, code) === record.otpHash;

  if (!matches) {
    const updated: VerificationRecord = { ...record, attempts: nextAttempts };
    await setPersistentKV(key(sessionId), updated, {
      ex: Math.max(1, Math.ceil((record.expiresAt - now) / 1000)),
    });
    return {
      ok: false as const,
      status: 400,
      error:
        nextAttempts >= OTP_MAX_ATTEMPTS
          ? "Too many attempts. Please request a new code."
          : "Invalid code. Please try again.",
      attemptsRemaining: Math.max(0, OTP_MAX_ATTEMPTS - nextAttempts),
    };
  }

  const verified: VerificationRecord = {
    ...record,
    attempts: nextAttempts,
    verified: true,
    verifiedAt: now,
  };

  await setPersistentKV(key(sessionId), verified, {
    ex: 60 * 60,
  });

  const jar = await cookies();
  jar.set(EMAIL_VERIFICATION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return { ok: true as const, email: record.email };
}
