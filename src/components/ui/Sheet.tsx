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
}

interface SheetTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
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
      to { opacity: 1; }
    }
    @keyframes sheet-slide-in-right {
      from { transform: translateX(1.25rem); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes sheet-slide-in-left {
      from { transform: translateX(-1.25rem); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes sheet-slide-in-top {
      from { transform: translateY(-1.25rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes sheet-slide-in-bottom {
      from { transform: translateY(1.25rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Side position configs
// ============================================================================

const sidePositionStyles: Record<string, React.CSSProperties> = {
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "75%",
    maxWidth: 384,
    animation: "sheet-slide-in-right 200ms ease-in-out",
  },
  left: {
    top: 0,
    left: 0,
    bottom: 0,
    height: "100%",
    width: "75%",
    maxWidth: 384,
    animation: "sheet-slide-in-left 200ms ease-in-out",
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    animation: "sheet-slide-in-top 200ms ease-in-out",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    animation: "sheet-slide-in-bottom 200ms ease-in-out",
  },
};

// ============================================================================
// Components
// ============================================================================

function SheetRoot({ children, open, onOpenChange }: SheetProps) {
  useEffect(() => {
    ensureKeyframes();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
  className,
}: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          backgroundColor: "rgba(250, 250, 250, 0.5)",
          animation: "sheet-overlay-in 200ms ease-out",
        }}
      />
      <Dialog.Content
        className={className}
        style={{
          position: "fixed",
          zIndex: 100,
          display: "block",
          gap: 16,
          padding: 24,
          background: "var(--ds-background-100)",
          boxShadow:
            "rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px, rgba(0,0,0,0.04) 0px 8px 16px -4px, var(--ds-background-200) 0px 0px 0px 1px",
          outline: "none",
          transition:
            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          ...sidePositionStyles[side],
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
        color: "var(--ds-gray-1000)",
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
        color: "var(--ds-gray-700)",
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
        color: "var(--ds-gray-1000)",
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
