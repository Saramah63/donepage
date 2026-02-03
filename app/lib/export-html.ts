// app/lib/export-html.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { generateSEO } from "@/app/lib/seo";
import { canExport } from "@/app/lib/plan-store";

function escapeHtmlAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function exportLandingHTML(answers: QuestionnaireAnswers, root: HTMLElement): string {
  // ✅ Gate فقط هنگام کلیک
  if (!canExport()) {
    throw new Error("Upgrade plan to export HTML");
  }

  // ✅ محافظ: این تابع باید فقط در browser با یک DOM واقعی صدا زده شود
  if (typeof window === "undefined") {
    throw new Error("exportLandingHTML must be called in the browser.");
  }
  if (!root || typeof (root as any).innerHTML !== "string") {
    throw new Error("Export failed: invalid root element.");
  }

  const seo = generateSEO(answers);

  const title = escapeHtmlAttr(normalizeWhitespace(seo.title || "Landing Page"));
  const description = escapeHtmlAttr(normalizeWhitespace(seo.description || ""));
  const keywords = escapeHtmlAttr(normalizeWhitespace(seo.keywords || ""));

  const ogTitle = escapeHtmlAttr(normalizeWhitespace(seo.og?.title || seo.title || ""));
  const ogDescription = escapeHtmlAttr(normalizeWhitespace(seo.og?.description || seo.description || ""));
  const ogType = escapeHtmlAttr(normalizeWhitespace(seo.og?.type || "website"));

  // ⚠️ NOTE: innerHTML is intentional (export actual rendered landing)
  const bodyHtml = root.innerHTML;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  ${description ? `<meta name="description" content="${description}" />` : ""}
  ${keywords ? `<meta name="keywords" content="${keywords}" />` : ""}

  ${ogTitle ? `<meta property="og:title" content="${ogTitle}" />` : ""}
  ${ogDescription ? `<meta property="og:description" content="${ogDescription}" />` : ""}
  <meta property="og:type" content="${ogType}" />
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
