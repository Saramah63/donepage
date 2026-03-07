import nodemailer from "nodemailer";

export type MailInput = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

export function buildMailTransport() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: { user: "resend", pass: apiKey },
  });
}

export async function sendMail(input: MailInput) {
  const transport = buildMailTransport();
  if (!transport) {
    return { ok: false as const, error: "missing_transport" };
  }
  const info = await transport.sendMail({
    to: input.to,
    from: input.from,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });
  return { ok: true as const, messageId: info?.messageId || null };
}

