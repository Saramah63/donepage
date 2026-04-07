"use client";

import * as React from "react";
import type { DraftContent } from "@/app/lib/draft-content";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

function cleanText(value: string | undefined, fallback: string) {
  const text = (value || "").trim();
  return text.length > 0 ? text : fallback;
}

function normalizeUrl(value?: string) {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return `https://${raw.replace(/^\/+/, "")}`;
}

function sanitizePhone(value?: string) {
  return (value || "").replace(/[^\d+]/g, "");
}

function resolveCtaLabel(answers?: QuestionnaireAnswers, draft?: DraftContent | null) {
  const desired = answers?.desiredAction;
  if (desired === "send_message") return "Send a Message";
  if (desired === "apply") return "Apply Now";
  if (desired === "buy") return "Buy Now";
  if (desired === "book_call") return "Book a Call";
  return cleanText(draft?.hero?.ctaText || draft?.cta?.buttonText, "Get Started");
}

function resolveCtaHref(answers?: QuestionnaireAnswers, draft?: DraftContent | null) {
  const customHero = normalizeUrl(draft?.hero?.ctaLink);
  const customCta = normalizeUrl(draft?.cta?.buttonLink);
  const booking = normalizeUrl(answers?.bookingLink || draft?.contact?.bookingLink);
  const email = (answers?.contactEmail || draft?.contact?.email || "").trim();
  const phone = sanitizePhone(answers?.contactPhone || draft?.contact?.phone);
  const whatsappRaw = answers?.whatsApp || draft?.contact?.whatsapp || "";
  const whatsappHref =
    whatsappRaw.startsWith("http") ? whatsappRaw : phone ? `https://wa.me/${phone.replace(/^\+/, "")}` : "";

  if (booking) return booking;
  if (customHero) return customHero;
  if (customCta) return customCta;
  if (whatsappHref) return whatsappHref;
  if (email) return `mailto:${email}`;

  return "#contact";
}

export function FullDraftPreview({
  draft,
  brand = "Donepage",
  projectId = "",
  token = "",
}: {
  draft: DraftContent | null;
  brand?: string;
  projectId?: string;
  token?: string;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!projectId || !token) return;
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, token }),
    }).catch(() => {
      // Lead capture should stay invisible to the preview experience.
    });
  }, [projectId, token]);

  const launchLink =
    projectId && token
      ? `/api/checkout?plan=launch&projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`
      : process.env.NEXT_PUBLIC_STRIPE_LINK_LAUNCH || "/#pricing";
  const growthLink =
    projectId && token
      ? `/api/checkout?plan=growth&projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`
      : process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH || "/#pricing";
  const answers = (draft?.answers || {}) as QuestionnaireAnswers;
  const benefits = draft?.benefits || [];
  const faq = draft?.faq || [];
  const contact = draft?.contact || {};
  const trust = draft?.trust;

  const businessName = cleanText(answers.businessName, brand);
  const heroHeadline = cleanText(
    draft?.hero?.headline,
    "Professional solutions for businesses that want clearer growth"
  );
  const heroSubheadline = cleanText(
    draft?.hero?.subheadline,
    "A focused offer for the right people who want real results."
  );
  const problem = cleanText(
    benefits[0]?.description,
    "Right now, many businesses struggle with unclear positioning."
  );
  const solutionTitle = cleanText(benefits[1]?.title, "A clear offer");
  const solutionBody = cleanText(
    benefits[1]?.description,
    "A simpler, more focused approach. This offer is designed to remove noise and create clarity - with a structure that makes the message easier to understand and act on."
  );
  const outcomeTitle = cleanText(benefits[2]?.title, "A stronger result");
  const outcomeBody = cleanText(
    benefits[2]?.description,
    "What changes after this: your message becomes clearer, your offer feels stronger, and people know exactly what to do next."
  );
  const trustTitle = cleanText(trust?.title, "About");
  const trustBody = cleanText(
    trust?.body,
    "A clear page builds trust faster. This landing page is structured to make your offer easy to understand, easy to trust, and easy to act on."
  );
  const ctaTitle = cleanText(draft?.cta?.title, "Start now - and turn this into something real.");
  const ctaText = resolveCtaLabel(answers, draft);
  const ctaHref = resolveCtaHref(answers, draft);
  const offer = cleanText(answers.primaryOffer, "A clear professional offer");
  const audience = cleanText(answers.targetAudience, "the right clients");
  const outcome = cleanText(answers.outcomeStatement, "more clarity and better conversion");

  const faqItems =
    faq.length > 0
      ? faq
      : [
          {
            question: "How fast can this be ready?",
            answer: "Your draft is ready instantly. The refined version is delivered within 72 hours.",
          },
          {
            question: "What happens next?",
            answer: "We refine the message, improve the structure, and prepare your page to perform better.",
          },
          {
            question: "Can this be adjusted later?",
            answer: "Yes. This is just the starting point.",
          },
        ];

  const contactItems = [
    contact.bookingLink ? { label: "Book a Call", value: contact.bookingLink, href: normalizeUrl(contact.bookingLink) } : null,
    contact.email ? { label: "Email", value: contact.email, href: `mailto:${contact.email}` } : null,
    contact.whatsapp ? { label: "WhatsApp", value: contact.whatsapp, href: normalizeUrl(contact.whatsapp) } : null,
    contact.phone ? { label: "Phone", value: contact.phone, href: `tel:${sanitizePhone(contact.phone)}` } : null,
    contact.instagram ? { label: "Instagram", value: contact.instagram, href: normalizeUrl(contact.instagram) } : null,
    contact.telegram ? { label: "Telegram", value: contact.telegram, href: normalizeUrl(contact.telegram) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  return (
    <div className="min-h-screen scroll-smooth bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0A0A0A]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="#hero"
            className="text-sm font-semibold uppercase tracking-[0.24em] text-white/86 transition-opacity duration-200 hover:opacity-100"
          >
            {businessName}
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-sm text-[#CFCFCF] transition-colors duration-200 hover:text-white">
              About
            </a>
            <a href="#contact" className="text-sm text-[#CFCFCF] transition-colors duration-200 hover:text-white">
              Contact
            </a>
          </nav>

          <a
            href={ctaHref}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-white px-5 text-sm font-semibold text-[#0A0A0A] transition duration-200 hover:scale-[1.03] hover:bg-white/95 hover:text-[#0A0A0A] hover:shadow-[0_0_24px_rgba(255,255,255,0.14)]"
            style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}
          >
            {ctaText}
          </a>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/[0.05] md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/8 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#CFCFCF] transition-colors duration-200 hover:text-white"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#CFCFCF] transition-colors duration-200 hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-12">
        <section
          id="hero"
          className="rounded-[36px] border border-white/8 bg-[#111111] px-6 py-12 shadow-[0_28px_100px_rgba(0,0,0,0.42)] sm:px-10 sm:py-16"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
              Premium landing page preview
            </p>
            <h1
              className="mt-5 text-4xl leading-[1.02] tracking-tight text-white sm:text-6xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              {heroHeadline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#D2D2D2]">
              {heroSubheadline}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={ctaHref}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white px-6 text-sm font-semibold text-[#0A0A0A] transition duration-200 hover:scale-[1.03] hover:bg-white/95 hover:text-[#0A0A0A] hover:shadow-[0_0_26px_rgba(255,255,255,0.14)]"
                style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}
              >
                {ctaText}
              </a>
              <span className="text-sm leading-7 text-white/60">
                A focused {offer.toLowerCase()} for {audience.toLowerCase()} who want real results.
              </span>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/62">
              Clear structure. Stronger message. A page built to move people to action.
            </p>
          </div>
        </section>

        <section id="decision" className="pt-6">
          <div className="rounded-[32px] border border-[#BFA76A]/18 bg-[linear-gradient(180deg,rgba(191,167,106,0.09),rgba(255,255,255,0.025))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.3)] sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E9D7A3]">
                  Decision point
                </p>
                <h2
                  className="mt-4 text-3xl tracking-tight text-white sm:text-4xl"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  This is your page — almost ready.
                </h2>
                <p className="mt-5 text-base leading-8 text-[#D9D9D9]">
                  Right now, it&apos;s a strong draft.
                </p>
                <p className="mt-3 text-base leading-8 text-[#D9D9D9]">
                  With expert refinement, it becomes a page that actually gets clients.
                </p>
                <div className="mt-6 space-y-3 text-sm leading-7 text-white/78">
                  <p>• clearer message</p>
                  <p>• stronger positioning</p>
                  <p>• conversion-focused structure</p>
                  <p>• clean design</p>
                </div>
                <div className="mt-6 rounded-[22px] border border-white/8 bg-black/10 px-5 py-5">
                  <p className="text-sm leading-7 text-[#D9D9D9]">
                    A high-converting landing page normally costs hundreds or thousands.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3
                  className="text-2xl tracking-tight text-white"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  Make this ready for real clients
                </h3>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                  <a
                    href={launchLink}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 bg-transparent px-6 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:bg-white/[0.05]"
                  >
                    Get My Page — €99
                  </a>
                  <p className="mt-3 text-center text-sm leading-7 text-[#CFCFCF]">
                    Best for validating your offer
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#BFA76A]/22 bg-[#BFA76A]/8 p-4">
                  <p className="text-center text-sm font-medium leading-7 text-[#F1E7C8]">
                    Most people choose Growth to get results faster
                  </p>
                  <a
                    href={growthLink}
                    className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/70 bg-white px-6 text-sm font-semibold text-[#0A0A0A] transition duration-200 hover:scale-[1.03] hover:bg-white/95 hover:text-[#0A0A0A] hover:shadow-[0_0_26px_rgba(255,255,255,0.14)]"
                    style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}
                  >
                    Get My Page Faster — €249
                  </a>
                  <p className="mt-3 text-center text-sm leading-7 text-[#F1E7C8]">
                    Best for getting real clients faster
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.02] px-5 py-5">
                  <p className="text-sm leading-7 text-[#D9D9D9]">
                    Most people stop at this stage. That&apos;s why their page never performs.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.02] px-5 py-5">
                  <p className="text-sm leading-7 text-[#D9D9D9]">
                    We only take a limited number of pages per week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="grid gap-6 pt-8 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              Problem
            </div>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">{problem}</p>
            <div className="mt-6 space-y-3 text-sm leading-7 text-white/72">
              <p>• Unclear messaging slows action</p>
              <p>• Weak structure creates friction</p>
              <p>• Overthinking keeps the page from working</p>
            </div>
            <p className="mt-6 text-base leading-8 text-white/72">This is where most pages fail.</p>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              Solution
            </div>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">{solutionBody}</p>
            <p className="mt-5 text-base leading-8 text-white/72">No unnecessary complexity. Just what works.</p>
          </div>
        </section>

        <section id="outcome" className="grid gap-6 pt-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              Outcome
            </div>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">{outcomeBody}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/8 bg-black/10 px-4 py-4 text-sm leading-7 text-white/78">
                Your message becomes clear
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/10 px-4 py-4 text-sm leading-7 text-white/78">
                Your offer feels stronger
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/10 px-4 py-4 text-sm leading-7 text-white/78">
                People know exactly what to do next
              </div>
            </div>
            <p className="mt-6 text-base leading-8 text-white/72">This is what turns attention into action.</p>
          </div>

          <div
            id="about"
            className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              About
            </div>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">
              A clear page creates trust faster.
            </p>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">
              This landing page is structured to make the offer easy to understand, easy to trust, and easy to act on.
            </p>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">
              Every section is there for a reason: to clarify the message, strengthen the offer, and guide the right people toward the next step.
            </p>
            <p className="mt-4 text-base leading-8 text-[#D9D9D9]">
              The goal is not more noise. The goal is a page that feels focused, credible, and ready to convert.
            </p>
            {trustBody ? (
              <p className="mt-5 text-base leading-8 text-white/72">
                {trustBody}
              </p>
            ) : null}
            <p className="mt-5 text-base leading-8 text-[#D9D9D9]">
              The goal is simple:
              <br />
              a page that feels focused, credible, and ready to convert.
            </p>
          </div>
        </section>

        {faqItems.length > 0 ? (
          <section id="faq" className="pt-6">
            <div className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
                FAQ
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {faqItems.map((item, index) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="rounded-[22px] border border-white/8 bg-black/10 px-5 py-5"
                  >
                    <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#D0D0D0]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="contact" className="pt-6">
          <div className="rounded-[30px] border border-white/8 bg-[#111111] px-6 py-8 sm:px-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BFA76A]">
              Contact
            </div>
            <h2
              className="mt-4 text-3xl tracking-tight text-white"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Ready to move forward?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#D9D9D9]">
              Choose the option that works best for you.
            </p>

            {contactItems.length > 0 ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {contactItems.map((item) => (
                  <a
                    key={`${item.label}-${item.value}`}
                    href={item.href}
                    className="rounded-[20px] border border-white/8 bg-black/10 px-5 py-4 text-sm leading-7 text-[#D9D9D9] transition duration-200 hover:border-white/16 hover:bg-white/[0.03]"
                  >
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                      {item.label}
                    </span>
                    <span className="mt-1 block break-all">{item.value}</span>
                  </a>
                ))}
              </div>
            ) : null}

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/68">
              Or use the main call to action to move forward directly.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={ctaHref}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white px-6 text-sm font-semibold text-[#0A0A0A] transition duration-200 hover:scale-[1.03] hover:bg-white/95 hover:text-[#0A0A0A] hover:shadow-[0_0_26px_rgba(255,255,255,0.14)]"
                style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}
              >
                {ctaText}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
