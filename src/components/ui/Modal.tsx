"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal body content */
  children: ReactNode;
  /** Optional title shown in the modal header */
  title?: string;
  /** Optional subtitle shown below the title in the header */
  subtitle?: string;
  /** Optional footer rendered outside the scrollable body */
  footer?: ReactNode;
  /** Additional CSS classes for the content card */
  className?: string;
}

// ============================================================================
// Modal
// ============================================================================

export function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  footer,
  className = "",
}: ModalProps) {
  // Body scroll lock (compensate for scrollbar width to prevent layout shift)
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--ds-overlay-backdrop-color)",
          opacity: "var(--ds-overlay-backdrop-opacity)" as unknown as number,
          zIndex: 50,
          pointerEvents: "all",
        }}
        onClick={onClose}
      />

      {/* Overlay container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          pointerEvents: "none",
        }}
      >
      {/* Modal wrapper */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full mx-4 ${className}`}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 540,
          maxHeight: "min(800px, 80vh)",
          borderRadius: 12,
          background: "var(--ds-background-100)",
          boxShadow: "var(--ds-shadow-modal)",
          color: "var(--ds-gray-1000)",
          overflow: "hidden",
          pointerEvents: "all",
        }}
      >
        {/* Modal body */}
        <div
          style={{
            padding: 24,
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {(title || subtitle) && (
            <header style={{ marginBottom: 24, zIndex: 10 }}>
              {title && (
                <h3
                  style={{
                    color: "var(--ds-gray-1000)",
                    fontSize: 24,
                    fontWeight: 600,
                    lineHeight: "32px",
                    letterSpacing: "-0.029375rem",
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <div
                  style={{
                    color: "var(--ds-gray-1000)",
                    fontSize: 16,
                    lineHeight: "24px",
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </header>
          )}

          {children}
        </div>

        {/* Footer (outside scrollable body) */}
        {footer && (
          <div
            style={{
              borderTop: "1px solid var(--ds-gray-alpha-400)",
              background: "var(--ds-background-200)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
      </div>
    </>,
    document.body,
  );
}
