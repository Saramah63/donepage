import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Missing BLOB_READ_WRITE_TOKEN" },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const type = file.type || "";
    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Only image or video files are allowed" },
        { status: 400 }
      );
    }

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File too large (max 25MB)" },
        { status: 400 }
      );
    }

    const filename = sanitizeFileName(file.name || "upload");
    const key = `uploads/${Date.now()}-${filename}`;

    const blob = await put(key, file, {
      access: "public",
      token,
      contentType: type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
