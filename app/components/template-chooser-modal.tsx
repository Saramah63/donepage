"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

type TemplateId = "A" | "B" | "C";

const templates: Array<{
  id: TemplateId;
  name: string;
  description: string;
}> = [
  { id: "A", name: "Template A", description: "Classic SaaS layout with hero + card." },
  { id: "B", name: "Template B", description: "Centered hero + proof band." },
  { id: "C", name: "Template C", description: "Bold headline + compact sections." },
];

export default function TemplateChooserModal({
  open,
  onClose,
  current,
  onPreview,
  onUse,
}: {
  open: boolean;
  onClose: () => void;
  current: TemplateId;
  onPreview: (id: TemplateId) => void;
  onUse: (id: TemplateId) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Try another layout</DialogTitle>
          <DialogDescription>
            Choose a layout variation. Preview is temporary. Use saves it for this project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className={[
                "rounded-2xl border bg-white p-4 shadow-sm",
                current === t.id ? "border-blue-500" : "border-gray-200",
              ].join(" ")}
            >
              <div className="mb-3 h-28 rounded-xl border border-gray-200 bg-gray-50 p-2">
                <div className="h-5 w-3/5 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-4/5 rounded bg-gray-200" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded bg-gray-200" />
                  <div className="h-8 rounded bg-gray-200" />
                  <div className="h-8 rounded bg-gray-200" />
                </div>
              </div>
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-gray-500">{t.description}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onPreview(t.id)}>
                  Preview
                </Button>
                <Button size="sm" onClick={() => onUse(t.id)}>
                  Use this layout
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
