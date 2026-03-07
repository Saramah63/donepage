import type { Metadata } from "next";
import Link from "next/link";
import { hasAdminToken } from "@/app/lib/admin-auth";
import { getProjectById, listProjectEvents, listRevisions } from "@/app/lib/project-store";
import type { DraftContent } from "@/app/lib/draft-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Project Detail | Donepage Admin",
  robots: { index: false, follow: false },
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getEmail(project: any) {
  const fromDraft = project?.draftContent?.contact?.email;
  const fromAnswers = project?.answers?.contactEmail || project?.answers?.email;
  return (fromDraft || fromAnswers || "").toString();
}

export default async function AdminProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;
  const token = sp.token || "";
  if (!hasAdminToken(token)) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">403</h1>
        <p className="mt-3 text-gray-700">Admin token is required.</p>
      </main>
    );
  }

  const project = await getProjectById(projectId);
  if (!project) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Not found</h1>
      </main>
    );
  }

  const revisions = await listRevisions(project.id);
  const events = await listProjectEvents(project.id, 50);
  const draft = project.draftContent as DraftContent | null;
  const previewUrl =
    project.previewUrl || `/preview/${project.id}?token=${encodeURIComponent(project.accessToken)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Project Detail</h1>
        <Link className="text-blue-700 underline" href={`/admin/projects?token=${encodeURIComponent(token)}`}>
          Back to projects
        </Link>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-600">Client email</div>
          <div className="text-lg font-semibold">{getEmail(project) || "—"}</div>
          <div className="mt-2 text-sm text-gray-700">
            Plan: <span className="font-semibold capitalize">{project.plan}</span> · Status: {project.status}
          </div>
          <div className="mt-1 text-sm text-gray-700">
            Payment: <span className="font-semibold">{project.paymentStatus}</span> · DNS:{" "}
            <span className="font-semibold">{project.dnsStatus}</span>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            Created: <span className="font-semibold">{fmtDate(project.createdAt)}</span>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-600">Links</div>
          <div className="mt-2 text-sm">
            <a className="text-blue-700 underline" href={previewUrl} target="_blank" rel="noreferrer">
              Open preview and edit
            </a>
          </div>
          <div className="mt-2 text-sm">
            {project.publishedUrl ? (
              <a className="text-blue-700 underline" href={project.publishedUrl} target="_blank" rel="noreferrer">
                Open live
              </a>
            ) : (
              <span className="text-gray-500">Not published</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <form action={`/api/admin/mark-paid?token=${encodeURIComponent(token)}`} method="post">
              <input type="hidden" name="projectId" value={project.id} />
              <button className="rounded-md border px-3 py-1 text-xs">Mark Paid</button>
            </form>
            <form action={`/api/admin/verify-dns?token=${encodeURIComponent(token)}`} method="post">
              <input type="hidden" name="projectId" value={project.id} />
              <button className="rounded-md border px-3 py-1 text-xs">Mark DNS Verified</button>
            </form>
            <form action={`/api/admin/project/publish?token=${encodeURIComponent(token)}`} method="post">
              <input type="hidden" name="projectId" value={project.id} />
              <button className="rounded-md border px-3 py-1 text-xs">Publish</button>
            </form>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Draft content summary</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <div>Headline: <span className="font-semibold">{draft?.hero?.headline || "—"}</span></div>
          <div>Subheadline: <span className="font-semibold">{draft?.hero?.subheadline || "—"}</span></div>
          <div>CTA: <span className="font-semibold">{draft?.hero?.ctaText || draft?.cta?.buttonText || "—"}</span></div>
          <div>Benefits: <span className="font-semibold">{draft?.benefits?.length ?? 0}</span></div>
          <div>Contact email: <span className="font-semibold">{draft?.contact?.email || "—"}</span></div>
          <div>Domain: <span className="font-semibold">{project.domain || "—"}</span></div>
        </div>
      </section>

      <section id="revisions" className="mt-6 rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Revision requests</h2>
        <div className="mt-3 space-y-3 text-sm">
          {revisions.length > 0 ? (
            revisions.map((r) => (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="font-semibold">Section: {r.section || "General"}</div>
                <div className="mt-1">{r.message}</div>
                <div className="mt-1 text-xs text-gray-500">{fmtDate(r.createdAt)}</div>
                <div className="mt-2">
                  <a className="text-blue-700 underline" href={previewUrl} target="_blank" rel="noreferrer">
                    Open preview and edit
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No revision requests yet.</div>
          )}
        </div>
      </section>

      <section id="activity" className="mt-6 rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Activity</h2>
        <div className="mt-3 space-y-3 text-sm">
          {events.length > 0 ? (
            events.map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                <div>
                  <div>{e.message}</div>
                  <div className="text-xs text-gray-500">{fmtDate(e.createdAt)}</div>
                  {e.metadata ? (
                    <div className="text-xs text-gray-500">{JSON.stringify(e.metadata)}</div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No activity yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
