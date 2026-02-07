"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { MessageSquare } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [messages, setMessages] = React.useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! Ask me anything about Donepage, pricing, domains, or publishing.",
    },
  ]);

  const handleSend = () => {
    const subject = encodeURIComponent("Donepage Inquiry");
    const body = encodeURIComponent(
      `From: ${email || "no email provided"}\n\n${message}`
    );
    window.location.href = `mailto:hello@donepage.co?subject=${subject}&body=${body}`;
  };

  const sendToAI = async () => {
    if (!message.trim() || sending) return;
    const userMsg = message.trim();
    setMessage("");
    setSending(true);

    const nextHistory = [...messages, { role: "user", content: userMsg }];
    setMessages(nextHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Chat failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "Sorry — I couldn’t answer that." },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: e?.message ?? "Chat failed." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const openCrisp = () => {
    const crisp = (window as any).$crisp;
    if (crisp && Array.isArray(crisp)) {
      crisp.push(["do", "chat:open"]);
      return true;
    }
    return false;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30"
      >
        <MessageSquare className="h-4 w-4" />
        Chat with us
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donepage Assistant</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              Ask anything — I’ll answer automatically.
            </div>

            <div className="max-h-64 space-y-3 overflow-auto rounded-xl border border-gray-200 bg-white p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-lg px-3 py-2 text-sm",
                    m.role === "assistant"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-100 text-gray-800",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              ))}
              {sending ? (
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  Thinking…
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Your email (optional)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <Button onClick={handleSend} className="w-full">
              Send Message
            </Button>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question…"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendToAI();
                }}
              />
              <Button onClick={sendToAI} disabled={sending}>
                Ask
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => openCrisp()}
              className="w-full"
            >
              Chat live
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
