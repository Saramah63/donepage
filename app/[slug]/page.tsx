// app/[slug]/page.tsx
import {
  getDraftBySlug,
  getPublishedBySlug,
  getVersionBySlug,
} from "@/app/lib/answers-store";
import SlugClient from "./slug-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; v?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const sp = (await searchParams) ?? {};
  const slug = sanitizeSlug(rawSlug);

  const preview = (sp.preview || "").toLowerCase();
  const v = Number(sp.v);

  // 1) explicit version preview: /slug?v=12
  if (Number.isFinite(v) && v > 0) {
    const ver = await getVersionBySlug(slug, v);
    return (
      <SlugClient
        slug={slug}
        initialAnswers={ver?.answers ?? null}
        view={{
          mode: "version",
          status: ver?.status ?? "draft",
          version: v,
        }}
      />
    );
  }

  // 2) draft preview: /slug?preview=draft
  if (preview === "draft") {
    const draft = await getDraftBySlug(slug);
    return (
      <SlugClient
        slug={slug}
        initialAnswers={draft?.answers ?? null}
        view={{ mode: "draft", status: "draft", version: draft?.version ?? null }}
      />
    );
  }

  // 3) default: published first, else draft
  const published = await getPublishedBySlug(slug);
  if (published) {
    return (
      <SlugClient
        slug={slug}
        initialAnswers={published.answers}
        view={{
          mode: "published",
          status: "published",
          version: published.version,
        }}
      />
    );
  }

  const draft = await getDraftBySlug(slug);
  return (
    <SlugClient
      slug={slug}
      initialAnswers={draft?.answers ?? null}
      view={{ mode: "draft", status: "draft", version: draft?.version ?? null }}
    />
  );
}
