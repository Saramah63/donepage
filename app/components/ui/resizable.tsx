"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "./utils";

// --- Version-safe exports (works whether exports are named or under default) ---
const RP: any = ResizablePrimitive as any;

const PanelGroup: React.ComponentType<any> =
  RP.PanelGroup ?? RP.default?.PanelGroup ?? RP.default;

const Panel: React.ComponentType<any> =
  RP.Panel ?? RP.default?.Panel ?? RP.PanelComponent ?? RP.default?.PanelComponent;

const PanelResizeHandle: React.ComponentType<any> =
  RP.PanelResizeHandle ??
  RP.default?.PanelResizeHandle ??
  RP.ResizeHandle ??
  RP.default?.ResizeHandle;

// If library is truly mis-installed, fail fast with a clear error at runtime (better than silent break)
function assertComponent(name: string, C: any) {
  if (!C) throw new Error(`react-resizable-panels: missing ${name} export`);
}
assertComponent("PanelGroup", PanelGroup);
assertComponent("Panel", Panel);
assertComponent("PanelResizeHandle", PanelResizeHandle);

type AnyProps = Record<string, any>;

function ResizablePanelGroup({
  className,
  ...props
}: AnyProps & { className?: string }) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel(props: AnyProps) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: AnyProps & { withHandle?: boolean; className?: string }) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
