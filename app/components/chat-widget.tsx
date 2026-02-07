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

  const handleSend = () => {
    const subject = encodeURIComponent("Donepage Inquiry");
    const body = encodeURIComponent(
      `From: ${email || "no email provided"}\n\n${message}`
    );
    window.location.href = `mailto:hello@donepage.co?subject=${subject}&body=${body}`;
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
        onClick={() => {
          if (!openCrisp()) setOpen(true);
        }}
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
              Ask anything about pricing, custom domains, or your landing page.
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
