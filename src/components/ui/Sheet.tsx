"use client";

import React, { useEffect, useCallback } from "react";
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

// ============================================================================
// Styles
// ============================================================================

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9998,
  backgroundColor: "var(--ds-overlay-backdrop-color, rgba(0, 0, 0, 0.5))",
  opacity: "var(--ds-overlay-backdrop-opacity, 1)" as unknown as number,
  animation: "sheet-overlay-in 200ms ease-out",
};

const basePanelStyles: React.CSSProperties = {
  position: "fixed",
  zIndex: 9999,
  background: "var(--ds-background-100)",
  boxShadow: "var(--ds-shadow-modal, 0 16px 70px rgba(0, 0, 0, 0.2))",
  display: "flex",
  flexDirection: "column",
  outline: "none",
};

const sideStyles: Record<string, React.CSSProperties> = {
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 400,
    maxWidth: "100vw",
    borderLeft: "1px solid var(--ds-gray-400)",
    animation: "sheet-slide-in-right 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  left: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 400,
    maxWidth: "100vw",
    borderRight: "1px solid var(--ds-gray-400)",
    animation: "sheet-slide-in-left 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    borderBottom: "1px solid var(--ds-gray-400)",
    animation: "sheet-slide-in-top 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: "1px solid var(--ds-gray-400)",
    animation: "sheet-slide-in-bottom 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

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
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes sheet-slide-in-left {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes sheet-slide-in-top {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    @keyframes sheet-slide-in-bottom {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

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
  const panelStyles: React.CSSProperties = {
    ...basePanelStyles,
    ...sideStyles[side],
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay style={overlayStyles} />
      <Dialog.Content style={panelStyles} className={className}>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: "var(--ds-gray-900)",
              cursor: "pointer",
              zIndex: 1,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--ds-gray-200)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              strokeLinejoin="round"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </Dialog.Close>
        <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
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
  Close: SheetClose,
});

export default Sheet;
