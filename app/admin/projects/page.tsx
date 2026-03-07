import type { Metadata } from "next";
import { hasAdminToken } from "@/app/lib/admin-auth";
import ProjectsTable from "@/app/admin/projects-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Donepage Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <ProjectsTable token={token} />
    </main>
  );
}
