"use client";

import * as React from "react";
import type { DeliveryStatus } from "@/app/lib/payment-orders";

export default function SaveOrderNotesForm({
  orderId,
  initialNote,
  initialStatus,
}: {
  orderId: string;
  initialNote: string;
  initialStatus: DeliveryStatus;
}) {
  const [note, setNote] = React.useState(initialNote);
  const [status, setStatus] = React.useState<DeliveryStatus>(initialStatus);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/admin/paid-order-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, note, status }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save notes");
      }
      setSaved(true);
    } catch (e: any) {
      setError(e?.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div>
        <label className="text-sm text-white/60">Status</label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as DeliveryStatus)}
          className="mt-2 h-12 w-full rounded-[20px] border border-white/10 bg-[#111111] px-4 text-white outline-none transition focus:border-white/25"
        >
          <option value="paid">paid</option>
          <option value="in_progress">in_progress</option>
          <option value="delivered">delivered</option>
        </select>
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="min-h-32 w-full rounded-[20px] border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-white/25"
        placeholder="Internal notes..."
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
        {saved ? <span className="text-sm text-[#9EE2C8]">Saved</span> : null}
        {error ? <span className="text-sm text-red-300">{error}</span> : null}
      </div>
    </form>
  );
}
