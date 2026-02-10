"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

type ProposalData = {
  title: string;
  context: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  investmentOptions: string[];
  ctaLabel: string;
  paymentLink: string;
  messagePreview: string;
  messageProposal: string;
};

function listToText(list: string[]) {
  return list.join("\n");
}

function textToList(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProposalEditor({ slug, token }: { slug: string; token: string }) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [proposal, setProposal] = React.useState<ProposalData | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch(`/api/proposal/get?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setProposal(data.proposal);
      })
      .catch(() => {
        if (!mounted) return;
        setProposal(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const update = (patch: Partial<ProposalData>) => {
    setProposal((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const save = async () => {
    if (!proposal) return;
    setSaving(true);
    try {
      const res = await fetch("/api/proposal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token, proposal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Save failed");
      toast.success("Proposal saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8">
          Loading…
        </div>
      </div>
    );
  }

  const proposalLink = `${window.location.origin}/proposal/${slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-16">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-600">Proposal Builder</div>
            <div className="text-sm text-gray-500">/{slug}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(proposalLink)}>
              Copy Proposal Link
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-600">Title</label>
            <input
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
              value={proposal.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Context</label>
            <textarea
              className="mt-2 w-full min-h-[90px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
              value={proposal.context}
              onChange={(e) => update({ context: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Scope (one per line)</label>
              <textarea
                className="mt-2 w-full min-h-[140px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={listToText(proposal.scope)}
                onChange={(e) => update({ scope: textToList(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Deliverables (one per line)</label>
              <textarea
                className="mt-2 w-full min-h-[140px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={listToText(proposal.deliverables)}
                onChange={(e) => update({ deliverables: textToList(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Timeline</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.timeline}
                onChange={(e) => update({ timeline: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Investment</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.investment}
                onChange={(e) => update({ investment: e.target.value })}
              />
              <div className="mt-3 text-xs font-semibold text-gray-600">Suggested tiers</div>
              <div className="mt-2 grid gap-2">
                {proposal.investmentOptions?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update({ investment: opt })}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 hover:border-blue-300 hover:bg-blue-50/60"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">CTA label</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.ctaLabel}
                onChange={(e) => update({ ctaLabel: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Payment link</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.paymentLink}
                onChange={(e) => update({ paymentLink: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Preview message</label>
              <textarea
                className="mt-2 w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.messagePreview}
                onChange={(e) => update({ messagePreview: e.target.value })}
              />
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigator.clipboard.writeText(proposal.messagePreview)}
              >
                Copy Preview Message
              </Button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Proposal message</label>
              <textarea
                className="mt-2 w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
                value={proposal.messageProposal}
                onChange={(e) => update({ messageProposal: e.target.value })}
              />
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigator.clipboard.writeText(proposal.messageProposal)}
              >
                Copy Proposal Message
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
            Shareable proposal link: <span className="font-semibold">{proposalLink}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
