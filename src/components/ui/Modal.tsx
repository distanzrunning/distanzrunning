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
  /** Modal content */
  children: ReactNode;
  /** Optional title shown in the modal header */
  title?: string;
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
  className = "",
}: ModalProps) {
  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--ds-background-100)", opacity: 0.8 }}
      />

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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal body */}
        <div
          style={{
            padding: 24,
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          {title && (
            <header style={{ marginBottom: 24, zIndex: 10 }}>
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
            </header>
          )}

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
