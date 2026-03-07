type AdminNotificationInput = {
  subject: string;
  text?: string;
  html?: string;
};

export async function sendAdminNotification(input: AdminNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = "Donepage <onboarding@resend.dev>";

  if (!apiKey || !adminEmail) {
    console.warn("[notifications] Missing RESEND_API_KEY or ADMIN_EMAIL. Skipping email.");
    return { ok: false, error: "missing_env" };
  }

  console.info("[notifications] Sending admin email:", input.subject);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: adminEmail,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[notifications] Email send failed:", res.status, payload);
      return { ok: false, error: payload?.message || "send_failed" };
    }

    console.info("[notifications] Email sent:", payload?.id || "unknown-id");
    return { ok: true, id: payload?.id };
  } catch (error) {
    console.error("[notifications] Email send error:", error);
    return { ok: false, error: "exception" };
  }
}
