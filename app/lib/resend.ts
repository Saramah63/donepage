import { sendMail } from "@/app/lib/mail";

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const from = process.env.EMAIL_FROM || "Donepage <hello@donepage.co>";
  return await sendMail({
    to: input.to,
    from,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}
