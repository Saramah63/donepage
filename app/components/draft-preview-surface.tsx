"use client";

import * as React from "react";
import type { DraftContent } from "@/app/lib/draft-content";

type TemplateId = "A" | "B" | "C";

type Props = {
  draft: DraftContent | null;
  editable?: boolean;
  templateId?: TemplateId;
  onInlineEdit?: (section: string, field: string, value: string, index?: number) => void;
};

function cleanText(value: string | undefined, fallback: string) {
  const text = (value || "").trim();
  return text.length > 0 ? text : fallback;
}

function sectionTone(templateId: TemplateId, index: number) {
  const tones =
    templateId === "B"
      ? ["bg-white/[0.035]", "bg-white/[0.02]", "bg-white/[0.04]"]
      : templateId === "C"
      ? ["bg-[#141414]", "bg-white/[0.025]", "bg-[#141414]"]
      : ["bg-white/[0.02]", "bg-white/[0.025]", "bg-white/[0.02]"];
  return tones[index % tones.length];
}

function EditableCopy({
  value,
  fallback,
  as = "p",
  className,
  placeholder,
  multiline = false,
  editable = false,
  onSave,
}: {
  value?: string;
  fallback: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
  onSave?: (value: string) => void;
}) {
  const Tag = as;
  const resolved = cleanText(value, fallback);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(resolved);

  React.useEffect(() => {
    if (!editing) setDraft(resolved);
  }, [resolved, editing]);

  if (!editable || !onSave) {
    return <Tag className={className}>{resolved}</Tag>;
  }

  if (!editing) {
    return (
      <Tag
        className={`${className || ""} cursor-text transition-opacity duration-200 hover:opacity-80`}
        onClick={() => setEditing(true)}
        title={placeholder || "Click to edit"}
      >
        {resolved}
      </Tag>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-[#161616] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25";

  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={inputClass}
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/[0.05]"
          onClick={() => {
            setDraft(resolved);
            setEditing(false);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-full bg-[#127A66] px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.02] hover:bg-[#15907A]"
          onClick={() => {
            onSave(draft.trim());
            setEditing(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function DraftPreviewSurface({
  draft,
  editable = false,
  templateId = "A",
  onInlineEdit,
}: Props) {
  const benefits = draft?.benefits || [];
  const faq = draft?.faq || [];
  const contact = draft?.contact || {};
  const trust = draft?.trust;

  const heroHeadline = draft?.hero?.headline;
  const heroSubheadline = draft?.hero?.subheadline;
  const heroCta = draft?.hero?.ctaText;
  const problem = benefits[0];
  const solution = benefits[1];
  const outcome = benefits[2];

  return (
    <div className="overflow-hidden rounded-[34px] border border-white/8 bg-[#111111] shadow-[0_24px_90px_rgba(0,0,0,0.36)]">
      <div className="border-b border-white/8 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/8" />
        </div>
      </div>

      <div className="stagger-reveal px-6 py-8 sm:px-8 sm:py-10">
        <section className={`rounded-[26px] border border-white/8 px-6 py-8 ${sectionTone(templateId, 0)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            Hero
          </div>
          <EditableCopy
            as="h2"
            editable={editable}
            value={heroHeadline}
            fallback="Professional solutions for businesses that want clearer growth"
            className='mt-4 max-w-3xl text-4xl leading-[1.04] tracking-tight text-white'
            onSave={(value) => onInlineEdit?.("hero", "headline", value)}
          />
          <EditableCopy
            editable={editable}
            value={heroSubheadline}
            fallback="A focused offer for the right people who want a clear result."
            className="mt-4 max-w-2xl text-base leading-7 text-[#CFCFCF]"
            multiline
            onSave={(value) => onInlineEdit?.("hero", "subheadline", value)}
          />
          <div className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(255,255,255,0.12)]">
            <EditableCopy
              as="span"
              editable={editable}
              value={heroCta}
              fallback="Book a call"
              className="text-black"
              onSave={(value) => onInlineEdit?.("hero", "ctaText", value)}
            />
          </div>
        </section>

        <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 1)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            Problem
          </div>
          <EditableCopy
            editable={editable}
            value={problem?.description}
            fallback="Right now, many businesses face unclear direction, too much effort, and not enough results."
            className="mt-4 text-base leading-8 text-[#D9D9D9]"
            multiline
            onSave={(value) => onInlineEdit?.("benefits", "description", value, 0)}
          />
        </section>

        <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 2)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            Solution
          </div>
          <EditableCopy
            as="h3"
            editable={editable}
            value={solution?.title}
            fallback="A clear offer"
            className='mt-4 text-2xl tracking-tight text-white'
            onSave={(value) => onInlineEdit?.("benefits", "title", value, 1)}
          />
          <EditableCopy
            editable={editable}
            value={solution?.description}
            fallback="A simpler, more focused approach that removes noise, strengthens the message, and makes the next step feel obvious."
            className="mt-3 text-base leading-8 text-[#D9D9D9]"
            multiline
            onSave={(value) => onInlineEdit?.("benefits", "description", value, 1)}
          />
        </section>

        <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 0)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            Outcome
          </div>
          <EditableCopy
            as="h3"
            editable={editable}
            value={outcome?.title}
            fallback="A stronger result"
            className='mt-4 text-2xl tracking-tight text-white'
            onSave={(value) => onInlineEdit?.("benefits", "title", value, 2)}
          />
          <EditableCopy
            editable={editable}
            value={outcome?.description}
            fallback="What changes after this: your message becomes clearer, your offer feels stronger, and people know exactly what to do next."
            className="mt-3 text-base leading-8 text-[#D9D9D9]"
            multiline
            onSave={(value) => onInlineEdit?.("benefits", "description", value, 2)}
          />
        </section>

        <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 2)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            Trust
          </div>
          <EditableCopy
            as="h3"
            editable={editable}
            value={trust?.title}
            fallback="Why trust this"
            className='mt-4 text-2xl tracking-tight text-white'
          />
          <EditableCopy
            editable={editable}
            value={trust?.body}
            fallback="A clear page builds trust faster. This page is designed to present the offer in a way that feels focused, credible, and easy to act on."
            className="mt-3 text-base leading-8 text-[#D9D9D9]"
            multiline
          />
        </section>

        <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 1)}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
            CTA
          </div>
          <EditableCopy
            as="h3"
            editable={editable}
            value={draft?.cta?.title}
            fallback="Ready to move from draft to a client-ready page?"
            className='mt-4 text-2xl tracking-tight text-white'
            onSave={(value) => onInlineEdit?.("cta", "title", value)}
          />
          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-white">
            <EditableCopy
              as="span"
              editable={editable}
              value={draft?.cta?.buttonText}
              fallback="Start the conversation"
              className="text-white"
              onSave={(value) => onInlineEdit?.("cta", "buttonText", value)}
            />
          </div>
        </section>

        {faq.length > 0 ? (
          <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 2)}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              FAQ
            </div>
            <div className="mt-4 space-y-5">
              {faq.map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-[20px] border border-white/8 bg-black/10 p-4">
                  <EditableCopy
                    as="h4"
                    editable={editable}
                    value={item.question}
                    fallback={`Question ${index + 1}`}
                    className="text-base font-semibold text-white"
                    onSave={(value) => onInlineEdit?.("faq", "question", value, index)}
                  />
                  <EditableCopy
                    editable={editable}
                    value={item.answer}
                    fallback="Answer"
                    className="mt-2 text-sm leading-7 text-[#D0D0D0]"
                    multiline
                    onSave={(value) => onInlineEdit?.("faq", "answer", value, index)}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(contact.email || contact.phone || contact.bookingLink || contact.whatsapp || contact.telegram || contact.instagram) ? (
          <section className={`mt-5 rounded-[26px] border border-white/8 px-6 py-7 ${sectionTone(templateId, 0)}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              Contact
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[#D9D9D9]">
              {contact.email ? (
                <EditableCopy
                  editable={editable}
                  value={contact.email}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "email", value)}
                />
              ) : null}
              {contact.phone ? (
                <EditableCopy
                  editable={editable}
                  value={contact.phone}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "phone", value)}
                />
              ) : null}
              {contact.bookingLink ? (
                <EditableCopy
                  editable={editable}
                  value={contact.bookingLink}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "bookingLink", value)}
                />
              ) : null}
              {contact.whatsapp ? (
                <EditableCopy
                  editable={editable}
                  value={contact.whatsapp}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "whatsapp", value)}
                />
              ) : null}
              {contact.telegram ? (
                <EditableCopy
                  editable={editable}
                  value={contact.telegram}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "telegram", value)}
                />
              ) : null}
              {contact.instagram ? (
                <EditableCopy
                  editable={editable}
                  value={contact.instagram}
                  fallback=""
                  className="text-[#D9D9D9]"
                  onSave={(value) => onInlineEdit?.("contact", "instagram", value)}
                />
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
