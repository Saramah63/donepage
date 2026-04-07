export function renderOtpTemplate(code: string) {
  const subject = "Your Donepage verification code";
  const text = `Your Donepage verification code is ${code}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#0A0A0A; color:#fff; padding:32px;">
      <div style="max-width:560px; margin:0 auto; background:#111111; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:32px;">
        <p style="font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#BFA76A; margin:0 0 16px;">Donepage</p>
        <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size:32px; line-height:1.1; margin:0 0 16px;">Your verification code</h1>
        <p style="font-size:16px; line-height:1.7; color:#D3D3D3; margin:0 0 24px;">Use this 6-digit code to continue your Donepage flow. It expires in 10 minutes.</p>
        <div style="font-size:40px; font-weight:700; letter-spacing:0.32em; text-align:center; padding:20px 16px; border-radius:20px; background:#0A0A0A; border:1px solid rgba(255,255,255,0.08); margin-bottom:24px;">${code}</div>
        <p style="font-size:14px; line-height:1.7; color:#AFAFAF; margin:0;">If you did not request this code, you can ignore this email.</p>
      </div>
    </div>
  `;

  return { subject, text, html };
}
