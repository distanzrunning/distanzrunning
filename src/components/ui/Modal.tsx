"use client";

import {
  useEffect,
  useState,
  useRef,
  useId,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  /** Max width of the modal panel (default 540px). */
  maxWidth?: number | string;
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
        background: "var(--ds-modal-section-bg)",
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
  maxWidth = 540,
  className = "",
}: ModalProps) {
  // Animation state: mounted keeps DOM alive during exit, visible drives CSS
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const subtitleId = useId();

  // Respect the user's OS-level "reduce motion" preference. When true we
  // drop the opacity/scale transitions (enter/exit are instantaneous).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveDuration = reducedMotion ? 0 : DURATION;

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
      }, effectiveDuration);
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

  // Capture the element that was focused when the modal opened so we can
  // return focus to it on close (WCAG 2.4.3).
  useEffect(() => {
    if (open) {
      openerRef.current =
        typeof document !== "undefined"
          ? (document.activeElement as HTMLElement | null)
          : null;
      return;
    }
    const opener = openerRef.current;
    openerRef.current = null;
    // Only restore focus if it's still in the body (e.g. user didn't navigate
    // away) and the element is actually focusable.
    if (opener && typeof opener.focus === "function") {
      opener.focus();
    }
  }, [open]);

  // Initial focus — prefer explicit ref, otherwise first focusable in panel.
  useEffect(() => {
    if (!visible) return;
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
      return;
    }
    const first = panelRef.current?.querySelector<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    first?.focus();
  }, [visible, initialFocusRef]);

  // Escape key + focus trap
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (el) =>
          !el.hasAttribute("aria-hidden") &&
          el.offsetParent !== null, // skip hidden
      );
      if (focusables.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
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
          transition: `opacity ${effectiveDuration}ms ${TIMING}`,
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
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={subtitle ? subtitleId : undefined}
          tabIndex={-1}
          className={`relative w-full mx-4 ${className}`}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth,
            maxHeight: "min(800px, 80vh)",
            borderRadius: 12,
            background: "var(--ds-modal-panel-bg)",
            boxShadow: "var(--ds-shadow-modal)",
            color: "var(--ds-gray-1000)",
            overflow: "hidden",
            pointerEvents: "all",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.98)",
            transition: `opacity ${effectiveDuration}ms ${TIMING}, transform ${effectiveDuration}ms ${TIMING}`,
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
                    : {
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginBottom: 24,
                        zIndex: 10,
                      }
                }
              >
                {title && (
                  <h3
                    id={titleId}
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
                    id={subtitleId}
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
