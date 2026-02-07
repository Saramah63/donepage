import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildInput(message: string, history: ChatMessage[]) {
  const system =
    "You are Donepage Assistant. Answer clearly and briefly. " +
    "If the user asks about pricing, custom domains, email setup, or publishing, give step-by-step guidance. " +
    "If you are unsure, ask a short clarifying question.";

  return [
    { role: "system", content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];
}

function extractText(payload: any) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const out = payload?.output;
  if (!Array.isArray(out)) return "";
  const parts: string[] = [];
  for (const item of out) {
    const content = item?.content;
    if (Array.isArray(content)) {
      for (const c of content) {
        if (typeof c?.text === "string") parts.push(c.text);
        if (c?.type === "output_text" && typeof c?.text === "string") parts.push(c.text);
      }
    }
  }
  return parts.join("\n").trim();
}

export async function POST(req: Request) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { message?: string; history?: ChatMessage[] }
      | null;

    const message = (body?.message ?? "").trim();
    const history = Array.isArray(body?.history) ? body?.history : [];
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const input = buildInput(message, history);

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "OpenAI request failed" },
        { status: 500 }
      );
    }

    const text = extractText(data) || "Sorry — I couldn’t generate a response.";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Chat failed" },
      { status: 500 }
    );
  }
}
