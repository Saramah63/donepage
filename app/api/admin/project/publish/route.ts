import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/app/lib/admin-auth";
import { createEvent, getProjectById, updateProject } from "@/app/lib/project-store";
import { smartPublishCheck } from "@/app/lib/draft-validate";

export const runtime = "nodejs";

type Body = { projectId?: string };

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    if (!isAdminAuthorized(req, url.searchParams)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const ctype = req.headers.get("content-type") || "";
    let projectId = "";
    if (ctype.includes("application/json")) {
      const body = (await req.json().catch(() => null)) as Body | null;
      projectId = (body?.projectId || "").trim();
    } else {
      const fd = await req.formData();
      projectId = String(fd.get("projectId") || "").trim();
    }
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (project.paymentStatus !== "paid") {
      return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    const check = smartPublishCheck(project.draftContent as any);
    if (check.status === "blocking") {
      return NextResponse.json(
        { error: "Draft validation failed", issues: check.issues, status: check.status },
        { status: 400 }
      );
    }

    const canCustom =
      project.plan === "growth" &&
      project.dnsStatus === "verified" &&
      Boolean(project.domain);
    const publishTarget = canCustom ? "custom_domain" : "subdomain";
    const publishedUrl =
      publishTarget === "custom_domain"
        ? `https://${String(project.domain).replace(/^https?:\/\//, "")}`
        : `https://${project.id}.donepage.co`;

    await updateProject(projectId, { publishStatus: "publishing" });
    const updated = await updateProject(projectId, {
      status: "published",
      publishStatus: "published",
      publishedUrl,
      publishTarget,
    });

    await createEvent({
      projectId,
      type: "page_published",
      message: "Landing page published by admin.",
      metadata: { publishedUrl, publishTarget },
    });

    return NextResponse.json({ ok: true, project: updated, publishedUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Publish failed" }, { status: 500 });
  }
}
