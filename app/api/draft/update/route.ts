import { NextResponse } from "next/server";
import { createEvent, getProjectById, updateProject } from "@/app/lib/project-store";
import type { DraftContent } from "@/app/lib/draft-content";
import {
  sanitizeBenefit,
  sanitizeFaq,
  sanitizeText,
  isValidEmail,
  isValidHttpsUrl,
  isValidUrlOrMailtoTel,
  type DraftSection,
} from "@/app/lib/draft-validate";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  section?: DraftSection;
  field?: string;
  value?: any;
  index?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();
    const section = body?.section;
    const field = (body?.field || "").trim();
    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!section || !field) {
      return NextResponse.json({ error: "Missing section or field" }, { status: 400 });
    }

    const existing = (project.draftContent as DraftContent | null) ?? {
      answers: project.answers as any,
    };

    const next: DraftContent = { ...existing };

    if (field === "__reset__") {
      if (section === "hero") delete next.hero;
      if (section === "benefits") delete next.benefits;
      if (section === "cta") delete next.cta;
      if (section === "contact") delete next.contact;
      if (section === "faq") delete next.faq;
    } else if (section === "hero") {
      next.hero = { ...(next.hero || {}) };
      if (field === "headline") next.hero.headline = sanitizeText(body?.value, 80);
      else if (field === "subheadline") next.hero.subheadline = sanitizeText(body?.value, 200);
      else if (field === "ctaText") next.hero.ctaText = sanitizeText(body?.value, 40);
      else if (field === "ctaLink") {
        const value = sanitizeText(body?.value, 500);
        if (value && !isValidUrlOrMailtoTel(value)) {
          return NextResponse.json({ error: "Invalid CTA link" }, { status: 400 });
        }
        next.hero.ctaLink = value;
      } else {
        return NextResponse.json({ error: "Invalid hero field" }, { status: 400 });
      }
    } else if (section === "benefits") {
      if (field === "items") {
        if (!Array.isArray(body?.value)) {
          return NextResponse.json({ error: "Invalid benefits list" }, { status: 400 });
        }
        const list = body.value.slice(0, 6).map(sanitizeBenefit);
        next.benefits = list;
      } else {
        const idx = typeof body?.index === "number" ? body.index : -1;
        if (idx < 0) return NextResponse.json({ error: "Missing benefit index" }, { status: 400 });
        const list = (next.benefits || []).slice();
        list[idx] = sanitizeBenefit({
          ...(list[idx] || {}),
          [field]: body?.value,
        });
        next.benefits = list.slice(0, 6);
      }
    } else if (section === "cta") {
      next.cta = { ...(next.cta || {}) };
      if (field === "title") next.cta.title = sanitizeText(body?.value, 100);
      else if (field === "buttonText") next.cta.buttonText = sanitizeText(body?.value, 40);
      else if (field === "buttonLink") {
        const value = sanitizeText(body?.value, 500);
        if (value && !isValidUrlOrMailtoTel(value)) {
          return NextResponse.json({ error: "Invalid CTA link" }, { status: 400 });
        }
        next.cta.buttonLink = value;
      } else {
        return NextResponse.json({ error: "Invalid CTA field" }, { status: 400 });
      }
    } else if (section === "contact") {
      next.contact = { ...(next.contact || {}) };
      if (field === "email") {
        const value = sanitizeText(body?.value, 120);
        if (value && !isValidEmail(value)) {
          return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        next.contact.email = value;
      } else if (field === "phone") {
        next.contact.phone = sanitizeText(body?.value, 40);
      } else if (field === "whatsapp") {
        const value = sanitizeText(body?.value, 200);
        if (value && !isValidHttpsUrl(value)) {
          return NextResponse.json({ error: "WhatsApp must be https URL" }, { status: 400 });
        }
        next.contact.whatsapp = value;
      } else if (field === "telegram") {
        const value = sanitizeText(body?.value, 200);
        if (value && !isValidHttpsUrl(value)) {
          return NextResponse.json({ error: "Telegram must be https URL" }, { status: 400 });
        }
        next.contact.telegram = value;
      } else if (field === "instagram") {
        const value = sanitizeText(body?.value, 200);
        if (value && !isValidHttpsUrl(value)) {
          return NextResponse.json({ error: "Instagram must be https URL" }, { status: 400 });
        }
        next.contact.instagram = value;
      } else if (field === "bookingLink") {
        const value = sanitizeText(body?.value, 200);
        if (value && !isValidHttpsUrl(value)) {
          return NextResponse.json({ error: "Booking link must be https URL" }, { status: 400 });
        }
        next.contact.bookingLink = value;
      } else {
        return NextResponse.json({ error: "Invalid contact field" }, { status: 400 });
      }
    } else if (section === "faq") {
      if (field === "items") {
        if (!Array.isArray(body?.value)) {
          return NextResponse.json({ error: "Invalid FAQ list" }, { status: 400 });
        }
        const list = body.value.slice(0, 6).map(sanitizeFaq);
        next.faq = list;
      } else {
        const idx = typeof body?.index === "number" ? body.index : -1;
        if (idx < 0) return NextResponse.json({ error: "Missing FAQ index" }, { status: 400 });
        const list = (next.faq || []).slice();
        list[idx] = sanitizeFaq({
          ...(list[idx] || {}),
          [field]: body?.value,
        });
        next.faq = list.slice(0, 6);
      }
    } else {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const updated = await updateProject(projectId, { draftContent: next });
    await createEvent({
      projectId,
      type: "draft_updated",
      message: `Draft updated: ${section}.${field}`,
      metadata: { section, field },
    });
    return NextResponse.json({
      ok: true,
      section,
      draftContent: updated?.draftContent ?? next,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
