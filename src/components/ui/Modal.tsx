"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// XIcon (internal)
// ============================================================================

function XIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

      {/* Content card */}
      <div
        className={`relative material-modal w-full max-w-[480px] mx-4 p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-heading-16"
              style={{ color: "var(--ds-gray-1000)", margin: 0 }}
            >
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex items-center justify-center border-none bg-transparent p-0 cursor-pointer"
              style={{ color: "var(--ds-gray-900)" }}
            >
              <XIcon />
            </button>
          </div>
        )}

        {!title && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 flex items-center justify-center border-none bg-transparent p-0 cursor-pointer"
            style={{ color: "var(--ds-gray-900)" }}
          >
            <XIcon />
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
