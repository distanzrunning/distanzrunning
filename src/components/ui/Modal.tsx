"use client";

import { useEffect, useState, useRef, type ReactNode, type RefObject } from "react";
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
  children?: ReactNode;
  /** Optional title shown in the modal header */
  title?: string;
  /** Optional subtitle shown below the title in the header */
  subtitle?: string;
  /** Optional footer rendered outside the scrollable body */
  footer?: ReactNode;
  /** Enable sticky header that stays visible when body scrolls */
  stickyHeader?: boolean;
  /** Ref to an element that should receive focus when the modal opens */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Additional CSS classes for the content card */
  className?: string;
}

// Geist motion values
const DURATION = 300; // ms
const TIMING = "cubic-bezier(0.175, 0.885, 0.32, 1.1)";

// ============================================================================
// Modal
// ============================================================================

function ModalInset({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--ds-background-200)",
        borderTop: "1px solid var(--ds-gray-alpha-400)",
        borderBottom: "1px solid var(--ds-gray-alpha-400)",
        margin: "0 -24px",
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  footer,
  stickyHeader = false,
  initialFocusRef,
  className = "",
}: ModalProps) {
  // Animation state: mounted keeps DOM alive during exit, visible drives CSS
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      // Mount immediately, then trigger visible on next frame for transition
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      // Start exit animation, unmount after duration
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
      }, DURATION);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  // Body scroll lock (compensate for scrollbar width to prevent layout shift)
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  // Initial focus
  useEffect(() => {
    if (visible && initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
  }, [visible, initialFocusRef]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined") return null;

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
          opacity: visible ? "var(--ds-overlay-backdrop-opacity)" : (0 as never),
          zIndex: 50,
          pointerEvents: visible ? "all" : "none",
          transition: `opacity ${DURATION}ms ${TIMING}`,
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
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.98)",
            transition: `opacity ${DURATION}ms ${TIMING}, transform ${DURATION}ms ${TIMING}`,
          }}
        >
          {/* Modal body */}
          <div
            style={{
              padding: stickyHeader ? "0 24px 24px" : 24,
              overflowX: "hidden",
              overflowY: "auto",
              position: "relative",
              borderTopLeftRadius: stickyHeader ? 12 : undefined,
              borderTopRightRadius: stickyHeader ? 12 : undefined,
            }}
          >
            {(title || subtitle) && (
              <header
                style={
                  stickyHeader
                    ? {
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        margin: "0 -24px 24px",
                        padding: "20px 24px",
                        background: "var(--ds-modal-section-bg)",
                        borderBottom: "1px solid var(--ds-gray-alpha-400)",
                      }
                    : { marginBottom: 24, zIndex: 10 }
                }
              >
                {title && (
                  <h3
                    style={{
                      color: "var(--ds-gray-1000)",
                      fontSize: stickyHeader ? 20 : 24,
                      fontWeight: 600,
                      lineHeight: stickyHeader ? "24px" : "32px",
                      letterSpacing: stickyHeader
                        ? "-0.47px"
                        : "-0.029375rem",
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
                background: "var(--ds-modal-section-bg)",
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

Modal.Inset = ModalInset;
