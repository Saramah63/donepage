import { notFound } from "next/navigation";
import { getProposal, defaultProposal } from "@/app/lib/proposal-store";
import { getAnswersBySlug } from "@/app/lib/answers-store";

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = sanitizeSlug(rawSlug);

  const stored = await getAnswersBySlug(slug);
  if (!stored) return notFound();

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const previewLink = `${base.replace(/\/$/, "")}/preview/${slug}?mode=draft`;
  const proposalLink = `${base.replace(/\/$/, "")}/proposal/${slug}`;

  const proposal = (await getProposal(slug)) ?? defaultProposal(stored.answers ?? stored, previewLink, proposalLink);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl">
        <div className="text-xs font-semibold text-gray-600">Proposal</div>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{proposal.title}</h1>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Context</h2>
          <p className="mt-2 text-gray-700">{proposal.context}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Scope of Work</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
            {proposal.scope.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Deliverables</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
            {proposal.deliverables.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Timeline</h3>
            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
              {proposal.timeline}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Investment</h3>
            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
              {proposal.investment}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Start Project</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ready to begin? Use the button below to accept and start the project.
          </p>
          {proposal.paymentLink ? (
            <a
              href={proposal.paymentLink}
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
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-600">Preview link</h2>
          <a href={previewLink} className="mt-2 block text-sm text-blue-700 underline" target="_blank" rel="noreferrer">
            {previewLink}
          </a>
        </section>
      </div>
    </div>
  );
}
