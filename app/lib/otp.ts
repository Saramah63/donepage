import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 10 * 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

export function generateOtpSessionId() {
  return crypto.randomBytes(24).toString("base64url");
}

export function hashOtp(sessionId: string, code: string) {
  return crypto.createHash("sha256").update(`${sessionId}:${code}`).digest("hex");
}

export function normalizeOtpEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidOtpEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
