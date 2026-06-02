"use client";

import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

// ============================================================================
// Types
// ============================================================================

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Render the blocking overlay scrim and trap focus inside the sheet.
   * Defaults to `true` — matches Geist's live Sheet behavior (overlay
   * always shown, outside-click dismisses). Flip to `false` only when
   * the underlying page must stay fully interactive while the sheet is
   * open.
   */
  modal?: boolean;
}

interface SheetTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** Custom width/height for the sheet panel (e.g., "75%", "512px", "100%") */
  size?: string;
  className?: string;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  children: React.ReactNode;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
}

interface SheetFooterProps {
  children: React.ReactNode;
}

// ============================================================================
// Keyframes (injected once)
// ============================================================================

const KEYFRAMES_ID = "sheet-keyframes";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAMES_ID)) return;

  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes sheet-overlay-in {
      from { opacity: 0; }
      to { opacity: var(--ds-overlay-backdrop-opacity); }
    }
    @keyframes sheet-overlay-out {
      from { opacity: var(--ds-overlay-backdrop-opacity); }
      to { opacity: 0; }
    }
    @keyframes sheet-slide-in-right {
      from { transform: translateX(1.25rem); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes sheet-slide-out-right {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(1.25rem); opacity: 0; }
    }
    @keyframes sheet-slide-in-left {
      from { transform: translateX(-1.25rem); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes sheet-slide-out-left {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-1.25rem); opacity: 0; }
    }
    @keyframes sheet-slide-in-top {
      from { transform: translateY(-1.25rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes sheet-slide-out-top {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-1.25rem); opacity: 0; }
    }
    @keyframes sheet-slide-in-bottom {
      from { transform: translateY(1.25rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes sheet-slide-out-bottom {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(1.25rem); opacity: 0; }
    }

    .ds-sheet-overlay[data-state="open"] {
      animation: sheet-overlay-in 200ms ease-out;
    }
    .ds-sheet-overlay[data-state="closed"] {
      animation: sheet-overlay-out 150ms ease-in;
    }

    .ds-sheet-content[data-state="open"][data-side="right"] {
      animation: sheet-slide-in-right 200ms ease-out;
    }
    .ds-sheet-content[data-state="closed"][data-side="right"] {
      animation: sheet-slide-out-right 150ms ease-in;
    }
    .ds-sheet-content[data-state="open"][data-side="left"] {
      animation: sheet-slide-in-left 200ms ease-out;
    }
    .ds-sheet-content[data-state="closed"][data-side="left"] {
      animation: sheet-slide-out-left 150ms ease-in;
    }
    .ds-sheet-content[data-state="open"][data-side="top"] {
      animation: sheet-slide-in-top 200ms ease-out;
    }
    .ds-sheet-content[data-state="closed"][data-side="top"] {
      animation: sheet-slide-out-top 150ms ease-in;
    }
    .ds-sheet-content[data-state="open"][data-side="bottom"] {
      animation: sheet-slide-in-bottom 200ms ease-out;
    }
    .ds-sheet-content[data-state="closed"][data-side="bottom"] {
      animation: sheet-slide-out-bottom 150ms ease-in;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Side position configs
// ============================================================================

const sidePositionStyles: Record<string, React.CSSProperties> = {
  right: { top: 0, right: 0, bottom: 0 },
  left: { top: 0, left: 0, bottom: 0 },
  top: { top: 0, left: 0, right: 0 },
  bottom: { bottom: 0, left: 0, right: 0 },
};

const sideClassNames: Record<string, string> = {
  right: "h-full p-6",
  left: "h-full p-6",
  top: "w-full p-6",
  bottom: "w-full p-6",
};

const defaultSizes: Record<string, string> = {
  right: "384px",
  left: "384px",
  top: "auto",
  bottom: "auto",
};

// ============================================================================
// Components
// ============================================================================

function SheetRoot({
  children,
  open,
  onOpenChange,
  modal = true,
}: SheetProps) {
  useEffect(() => {
    ensureKeyframes();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </Dialog.Root>
  );
}

function SheetTrigger({ children, asChild = true }: SheetTriggerProps) {
  return <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>;
}

function SheetContent({
  children,
  side = "right",
  size,
  className,
}: SheetContentProps) {
  const isHorizontal = side === "left" || side === "right";
  const resolvedSize = size || defaultSizes[side];
  const sizeStyle: React.CSSProperties = isHorizontal
    ? { width: resolvedSize }
    : { height: resolvedSize };

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className="ds-sheet-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          backgroundColor: "var(--ds-overlay-backdrop-color)",
          opacity: "var(--ds-overlay-backdrop-opacity)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />
      <Dialog.Content
        data-side={side}
        className={`ds-sheet-content ${className || sideClassNames[side]}`}
        style={{
          position: "fixed",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "rgb(var(--color-surface))",
          boxShadow:
            "rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px, rgba(0,0,0,0.04) 0px 8px 16px -4px, var(--ds-background-200) 0px 0px 0px 1px",
          outline: "none",
          transition:
            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          ...sidePositionStyles[side],
          ...sizeStyle,
        }}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function SheetHeader({ children }: SheetHeaderProps) {
  return (
    <div className="flex flex-col sm:text-left p-6 text-left">
      {children}
    </div>
  );
}

function SheetTitle({ children }: SheetTitleProps) {
  return (
    <Dialog.Title
      className="font-semibold"
      style={{
        fontSize: 18,
        lineHeight: "28px",
        color: "rgb(var(--color-textDefault))",
      }}
    >
      {children}
    </Dialog.Title>
  );
}

function SheetDescription({ children }: SheetDescriptionProps) {
  return (
    <Dialog.Description
      style={{
        fontSize: 14,
        lineHeight: "20px",
        color: "rgb(var(--color-textSubtler))",
      }}
    >
      {children}
    </Dialog.Description>
  );
}

function SheetBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-6 py-4"
      style={{
        fontSize: 14,
        lineHeight: "20px",
        color: "rgb(var(--color-textDefault))",
      }}
    >
      {children}
    </div>
  );
}

function SheetFooter({ children }: SheetFooterProps) {
  return (
    <div className="flex flex-row justify-end p-6 gap-2 mt-auto">
      {children}
    </div>
  );
}

function SheetClose({ children }: { children: React.ReactNode }) {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
}

// ============================================================================
// Compound Component
// ============================================================================

export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: SheetClose,
});

export default Sheet;
