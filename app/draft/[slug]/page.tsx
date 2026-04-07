import { notFound } from "next/navigation";
import { FullDraftPreview } from "@/app/components/full-draft-preview";
import { getProjectById } from "@/app/lib/project-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Donepage Draft",
  robots: {
    index: false,
    follow: false,
  },
};

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default async function DraftPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const sp = await searchParams;
  const slug = sanitizeSlug(rawSlug);
  const token = (sp.token || "").trim();

  if (!slug || !token) return notFound();

  const project = await getProjectById(slug);
  if (!project || project.accessToken !== token) return notFound();

  return (
    <FullDraftPreview
      draft={project.draftContent ?? null}
      brand="Donepage"
      projectId={project.id}
      token={token}
    />
  );
}
