"use client";

import * as React from "react";

type ProposalData = {
  title: string;
  context: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  investmentOptions: string[];
  paymentLinks: Record<string, string>;
  ctaLabel: string;
  paymentLink: string;
};

export default function ProposalClient({
  proposal,
  previewLink,
}: {
  proposal: ProposalData;
  previewLink: string;
}) {
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);

  const effectiveLink =
    (selectedTier && proposal.paymentLinks?.[selectedTier]) || proposal.paymentLink || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-16">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-blue-700">Donepage Proposal</div>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">{proposal.title}</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              A clear, conversion‑focused plan to turn your draft into a revenue‑ready landing page.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Featured
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
            Prepared for: <span className="font-semibold text-gray-900">B2B Lead Generation</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold text-gray-600">Client logo</div>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Context</h2>
              <p className="mt-2 text-gray-700">{proposal.context}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Scope of Work</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
                {proposal.scope.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Deliverables</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
                {proposal.deliverables.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Timeline</h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                  {proposal.timeline}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Investment</h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                  {selectedTier ?? proposal.investment}
                </div>
                {proposal.investmentOptions?.length ? (
                  <div className="mt-4 grid gap-2">
                    {proposal.investmentOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedTier(opt)}
                        className={[
                          "rounded-xl border px-3 py-2 text-left text-xs",
                          selectedTier === opt
                            ? "border-blue-300 bg-blue-50/60 text-blue-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/60",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                    <div className="text-[11px] text-gray-500">
                      Pick a tier to update the payment button.
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6">
              <div className="text-sm font-semibold text-blue-900">Start Project</div>
              <p className="mt-2 text-sm text-blue-900/80">
                Accept the proposal and start immediately. First update within 3 business days.
              </p>
              {effectiveLink ? (
                <a
                  href={effectiveLink}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  {proposal.ctaLabel}
                </a>
              ) : (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Payment link not set yet.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold text-gray-600">Preview link</div>
              <a
                href={previewLink}
                className="mt-2 block text-sm text-blue-700 underline"
                target="_blank"
                rel="noreferrer"
              >
                {previewLink}
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-xs text-gray-600">
              Fully async. No calls required. All updates are documented.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
