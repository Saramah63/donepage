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
      role: "assistant" as const,
      content:
        "Hi! Ask me anything about Donepage, pricing, domains, or publishing.",
    },
  ]);

  const faqs = [
    {
      q: "How does Donepage generate my landing page?",
      a: "Answer the guided questions and Donepage instantly builds a full landing page with copy, layout, and sections based on your inputs.",
    },
    {
      q: "What is the full process from start to publish?",
      a: "1) Answer questions, 2) Preview and edit, 3) Save draft, 4) Choose a plan, 5) Publish and share.",
    },
    {
      q: "Can I edit after publishing?",
      a: "Yes. Use your private edit link or open /generator?edit=your-slug to update and republish.",
    },
    {
      q: "How does pricing work?",
      a: "You review your page first, then choose a plan when you publish. Business/Pro unlock custom domains.",
    },
    {
      q: "What plans are available?",
      a: "Starter, Business, and Pro. Business/Pro include custom domains and advanced features.",
    },
    {
      q: "How do custom domains work?",
      a: "Connect your domain in Publish, then add a CNAME or A record at your DNS provider. Use the domain status check after updating DNS.",
    },
    {
      q: "Do I get a free Donepage subdomain?",
      a: "Yes. You can publish to yourslug.donepage.co instantly, then upgrade to a custom domain any time.",
    },
    {
      q: "How do I add images or videos?",
      a: "Use the upload button in the About or Portfolio steps. It supports images and short videos (max 25MB).",
    },
  ];

  const handleSend = () => {
    const subject = encodeURIComponent("Donepage Inquiry");
    const body = encodeURIComponent(
      `From: ${email || "no email provided"}\n\n${message}`
    );
    window.location.href = `mailto:hello@donepage.co?subject=${subject}&body=${body}`;
  };

  const autoReply = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("price") || t.includes("pricing") || t.includes("plan")) {
      return "Pricing is shown in the Publish flow. Choose a plan, then publish. Business/Pro enable custom domains.";
    }
    if (t.includes("domain") || t.includes("custom domain")) {
      return "Connect your domain in Publish, then add a CNAME or A record at your DNS provider. Use the domain status check after updating DNS.";
    }
    if (t.includes("publish") || t.includes("live") || t.includes("deploy")) {
      return "Click Publish, pick a slug, choose a plan, then publish. You can review the page before paying.";
    }
    if (t.includes("email") || t.includes("login") || t.includes("sign in")) {
      return "Email sign‑in requires DATABASE_URL, RESEND_API_KEY, and EMAIL_FROM. Google/GitHub need correct OAuth callbacks.";
    }
    if (t.includes("upload") || t.includes("image") || t.includes("video")) {
      return "Use the upload button in the About or Portfolio steps. It supports images and short videos (max 25MB).";
    }
    if (t.includes("edit") || t.includes("update")) {
      return "Use your private edit link or open /generator?edit=your-slug to update and republish.";
    }
    return "I can help with pricing, domains, publishing, uploads, or login. If you need more, use live chat.";
  };

  const sendToAI = async () => {
    if (!message.trim() || sending) return;
    const userMsg = message.trim();
    setMessage("");
    setSending(true);

    const nextHistory = [
      ...messages,
      { role: "user" as const, content: userMsg },
    ];
    setMessages(nextHistory);

    try {
      const reply = autoReply(userMsg);
      const shouldOfferLive =
        reply.toLowerCase().includes("use live chat") ||
        reply.toLowerCase().includes("i can help");
      const data = { text: reply, offerLive: shouldOfferLive };
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

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="mb-2 text-xs font-semibold text-gray-600">Common questions</div>
              <div className="space-y-3 text-sm">
                {faqs.map((f) => (
                  <div key={f.q} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="font-semibold text-gray-800">{f.q}</div>
                    <div className="mt-1 text-gray-600">{f.a}</div>
                  </div>
                ))}
              </div>
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

            {messages.length > 1 &&
            messages[messages.length - 1]?.role === "assistant" &&
            messages[messages.length - 1]?.content.includes("live chat") ? (
              <Button
                variant="outline"
                onClick={() => openCrisp()}
                className="w-full"
              >
                Chat live
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
