export function renderFollowup3dEmail(previewUrl?: string | null) {
  const subject = "Your Donepage draft is still here";
  const cta = previewUrl?.trim() || "";
  const text = [
    "Most people stop at this stage.",
    "That’s why their page never performs.",
    "",
    "If you still want to turn your draft into something real, you can pick it up from where you left off.",
    cta ? "" : "",
    cta ? `Preview your page: ${cta}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#0A0A0A; color:#fff; padding:32px;">
      <div style="max-width:560px; margin:0 auto; background:#111111; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:32px;">
        <p style="font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#BFA76A; margin:0 0 16px;">Donepage</p>
        <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size:32px; line-height:1.1; margin:0 0 16px;">Your Donepage draft is still here</h1>
        <p style="font-size:16px; line-height:1.7; color:#D3D3D3; margin:0 0 14px;">Most people stop at this stage. That’s why their page never performs.</p>
        <p style="font-size:16px; line-height:1.7; color:#D3D3D3; margin:0 0 24px;">If you still want to turn your draft into something real, you can pick it up from where you left off.</p>
        ${
          cta
            ? `<a href="${cta}" style="display:inline-block; padding:14px 22px; border-radius:999px; background:#fff; color:#0A0A0A; font-weight:600; text-decoration:none;">Preview My Page</a>`
            : ""
        }
      </div>
    </div>
  `;

  return { subject, text, html };
}
