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
import { toast } from "sonner";

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
        "Hi! Ask me about proposals, enterprise pricing, publishing, domains, uploads, or sign‑in.",
    },
  ]);

  const faqs = [
    {
      q: "How do I create a proposal for my client?",
      a: "Open your landing preview and click Proposal. Select a tier, enable Stripe checkout, and share a premium proposal link your client can approve instantly.",
    },
    {
      q: "How do payments work for proposals vs Donepage?",
      a: "Proposal payments cover your client engagement. Donepage plans are separate and only cover publishing the landing page.",
    },
    {
      q: "What is the full process from start to publish?",
      a: "1) Answer questions, 2) Preview and refine, 3) Save draft, 4) Select a plan, 5) Publish and share a luxury‑grade link.",
    },
    {
      q: "How do I add Stripe price IDs for proposal checkout?",
      a: "Add STRIPE_PRICE_PROPOSAL_3K/5K/7K in your env, then the proposal CTA routes clients directly to Stripe Checkout.",
    },
    {
      q: "Can I edit after publishing?",
      a: "Yes. Use your private edit link to refine, then republish when it’s final.",
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
    {
      q: "Why don’t I see my preview or proposal in production?",
      a: "Local drafts are not visible on donepage.co. Generate in production to get live preview and proposal links.",
    },
  ];

  const handleSend = () => {
    const subject = encodeURIComponent("Donepage Inquiry");
    const body = encodeURIComponent(
      `From: ${email || "no email provided"}\n\n${message}`
    );
    window.location.href = `mailto:hello@donepage.co?subject=${subject}&body=${body}`;
  };

  const handleFallbackEmail = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message first.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to send");
      toast.success("Message sent to inbox.");
    } catch (e: any) {
      toast.error(e?.message ?? "Email send failed.");
    } finally {
      setSending(false);
    }
  };

  const autoReply = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("proposal") || t.includes("client")) {
      return "Open your landing preview and click Proposal. Add tiers and Stripe checkout to get paid instantly.";
    }
    if (t.includes("stripe") || t.includes("price id") || t.includes("checkout")) {
      return "Set STRIPE_PRICE_PROPOSAL_3K/5K/7K and STRIPE_SECRET_KEY. The Start Project button opens Stripe Checkout.";
    }
    if (t.includes("price") || t.includes("pricing") || t.includes("plan")) {
      return "Pricing appears in the Publish flow. Choose a plan, then publish. Business/Pro unlock custom domains.";
    }
    if (t.includes("domain") || t.includes("custom domain")) {
      return "Connect your domain in Publish, then add a CNAME or A record at your DNS provider. Use the domain status check after updating DNS.";
    }
    if (t.includes("publish") || t.includes("live") || t.includes("deploy")) {
      return "Click Publish, pick a slug, choose a plan, then publish. Review first, pay only when you’re ready.";
    }
    if (t.includes("email") || t.includes("login") || t.includes("sign in")) {
      return "Email sign‑in requires DATABASE_URL, RESEND_API_KEY, and EMAIL_FROM. Google/GitHub need correct OAuth callback URLs.";
    }
    if (t.includes("upload") || t.includes("image") || t.includes("video")) {
      return "Use the upload button in the About or Portfolio steps. It supports images and short videos (max 25MB).";
    }
    if (t.includes("edit") || t.includes("update")) {
      return "Use your private edit link to refine and republish anytime.";
    }
    if (t.includes("preview") || t.includes("draft")) {
      return "Draft preview: /preview/{slug}?mode=draft. Published preview: /preview/{slug}?mode=published.";
    }
    return "I can help with proposals, enterprise pricing, domains, publishing, uploads, or login. For anything else, use live chat.";
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
        <DialogContent className="max-h-[85vh] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Donepage Assistant</DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[calc(85vh-120px)] flex-col space-y-4 overflow-auto pr-1 text-sm text-gray-700">
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

            <Button variant="outline" onClick={handleFallbackEmail} className="w-full">
              Send to inbox (fallback)
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
