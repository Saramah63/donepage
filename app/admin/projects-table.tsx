"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";

type ProjectRow = {
  id: string;
  email: string;
  plan: string;
  paymentStatus: string;
  status: string;
  previewUrl: string;
  publishedUrl: string | null;
  revisionsCount: number;
  latestRevisionMessage?: string | null;
  revisions?: Array<{ id: string; message: string; createdAt: string }>;
  events?: Array<{ id: string; message: string; type: string; createdAt: string; metadata?: any }>;
  createdAt: string;
};

type Filters = {
  unpaid: boolean;
  revision: boolean;
  published: boolean;
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProjectsTable({ token }: { token: string }) {
  const [rows, setRows] = React.useState<ProjectRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<Filters>({
    unpaid: false,
    revision: false,
    published: false,
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRows(Array.isArray(data?.projects) ? data.projects : []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((p) => {
    if (filters.unpaid && p.paymentStatus !== "paid") return false;
    if (filters.revision && p.revisionsCount <= 0) return false;
    if (filters.published && p.status !== "published") return false;
    return true;
  });

  const adminPost = async (path: string, projectId: string) => {
    await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId }),
    });
    await load();
  };

  return (
    <section className="mt-8 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.unpaid}
            onChange={(e) => setFilters((f) => ({ ...f, unpaid: e.target.checked }))}
          />
          Unpaid
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.revision}
            onChange={(e) => setFilters((f) => ({ ...f, revision: e.target.checked }))}
          />
          Revision requested
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.published}
            onChange={(e) => setFilters((f) => ({ ...f, published: e.target.checked }))}
          />
          Published
        </label>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Client email</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Status</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Preview</th>
              <th className="py-2">Revisions</th>
              <th className="py-2">Latest revision</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <React.Fragment key={p.id}>
                <tr
                  className={`border-b align-top ${
                    p.revisionsCount > 0 ? "bg-amber-50/60" : ""
                  }`}
                >
                  <td className="py-2">{p.email || "—"}</td>
                  <td className="py-2 capitalize">{p.plan}</td>
                  <td className="py-2">{p.status}</td>
                  <td className="py-2">{p.paymentStatus}</td>
                  <td className="py-2">
                    <a className="text-blue-700 underline" href={p.previewUrl} target="_blank" rel="noreferrer">
                      View preview
                    </a>
                  </td>
                  <td className="py-2">
                    {p.revisionsCount > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        {p.revisionsCount} requested
                      </span>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </td>
                  <td className="py-2 text-xs text-gray-600">
                    {p.latestRevisionMessage || "—"}
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <a
                        className="rounded-md border px-2 py-1 text-xs font-semibold"
                        href={p.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Editor
                      </a>
                      <a
                        className="rounded-md border px-2 py-1 text-xs"
                        href={`/admin/projects/${p.id}?token=${encodeURIComponent(token)}#revisions`}
                      >
                        View Revisions
                      </a>
                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => adminPost("/api/admin/project/publish", p.id)}
                      >
                        Publish
                      </button>
                      {p.publishedUrl ? (
                        <a
                          className="rounded-md border px-2 py-1 text-xs"
                          href={p.publishedUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Live Page
                        </a>
                      ) : (
                        <span className="rounded-md border px-2 py-1 text-xs text-gray-500">
                          Open Live Page
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === p.id ? (
                  <tr className="border-b bg-gray-50">
                    <td colSpan={8} className="py-3 text-xs text-gray-700">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="mb-1 font-semibold">Revisions</div>
                          {p.revisions && p.revisions.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {p.revisions.map((r) => (
                                <li key={r.id}>
                                  {r.message} · {fmtDate(r.createdAt)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>No revision requests yet.</span>
                          )}
                        </div>
                        <div>
                          <div className="mb-1 font-semibold">Activity</div>
                          {p.events && p.events.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {p.events.map((e) => (
                                <li key={e.id}>
                                  {e.message} · {fmtDate(e.createdAt)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>No activity yet.</span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="py-4 text-gray-500" colSpan={8}>
                  No projects found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
