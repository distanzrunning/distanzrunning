"use client";

import React, {
  createContext,
  useContext,
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
// Context
// ============================================================================

interface ModalContextValue {
  titleId: string;
  /**
   * True when the component is rendering inside a <Modal.Header>.
   * Modal.Header uses `gap` to space its children, so Modal.Title's
   * standalone bottom margin would collide with the gap; we suppress
   * it here and let the Header own the spacing.
   */
  inHeader: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(componentName: string): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Modal>`);
  }
  return ctx;
}

// ============================================================================
// Types
// ============================================================================

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal contents — compose with Modal.Title / Modal.P / Modal.Header / Modal.Footer / Modal.Inset */
  children?: ReactNode;
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
// Subcomponents
// ============================================================================

function ModalTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { titleId } = useModalContext("Modal.Title");
  return (
    <h3
      id={titleId}
      className={className}
      style={{
        color: "var(--ds-gray-1000)",
        fontSize: 24,
        fontWeight: 600,
        lineHeight: "32px",
        letterSpacing: "-0.029375rem",
        // Title sits flush against the next element so it groups
        // tightly with a following Modal.P. The bottom rhythm to the
        // body is owned by Modal.P (or Modal.Header's gap when
        // wrapped).
        margin: 0,
      }}
    >
      {children}
    </h3>
  );
}

function ModalP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { inHeader } = useModalContext("Modal.P");
  return (
    <div
      className={className}
      style={{
        color: "var(--ds-gray-1000)",
        fontSize: 16,
        lineHeight: "24px",
        fontWeight: 400,
        // Inside <Modal.Header>, the header's `gap` owns spacing.
        // Standalone, the paragraph needs its own bottom rhythm so the
        // body content below sits 24px clear.
        margin: inHeader ? 0 : "0 0 24px",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Optional wrapper around Modal.Title + Modal.P that turns the header
 * into a sticky band that stays visible while the body scrolls.
 */
function ModalHeader({
  children,
  sticky = false,
  className,
}: {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}) {
  const parent = useModalContext("Modal.Header");
  return (
    <ModalContext.Provider value={{ ...parent, inHeader: true }}>
      <header
        className={className}
        style={
          sticky
            ? {
                position: "sticky",
                top: 0,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
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
        {children}
      </header>
    </ModalContext.Provider>
  );
}

function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Marker only — Modal pulls this out of the scrollable body and
  // renders it in the panel's footer slot.
  return (
    <div
      className={className}
      style={{
        borderTop: "1px solid var(--ds-gray-alpha-400)",
        background: "var(--ds-modal-section-bg)",
      }}
    >
      {children}
    </div>
  );
}

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

// ============================================================================
// Modal
// ============================================================================

export function Modal({
  open,
  onClose,
  children,
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

  // Split children: Modal.Footer renders outside the scrollable body,
  // everything else stays inside. We also flag whether a sticky header
  // is in play so the body can drop its top padding.
  const { bodyChildren, footerChild, hasStickyHeader } = React.useMemo(() => {
    let footer: ReactNode = null;
    let stickyHeader = false;
    const rest: ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === ModalFooter) {
          footer = child;
          return;
        }
        if (child.type === ModalHeader) {
          const props = child.props as { sticky?: boolean };
          if (props.sticky) stickyHeader = true;
        }
      }
      rest.push(child);
    });
    // When the last body child is a full-bleed Inset, the body's bottom
    // padding would leave a gap before the footer; flag it so we can drop
    // that padding and let the inset meet the footer (Geist).
    const lastChild = rest[rest.length - 1];
    const lastChildIsInset =
      React.isValidElement(lastChild) && lastChild.type === ModalInset;
    return {
      bodyChildren: rest,
      footerChild: footer,
      hasStickyHeader: stickyHeader,
      lastChildIsInset,
    };
  }, [children]);

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

  // Body scroll lock. We don't compensate for the freed
  // scrollbar width because globals.css sets
  // `scrollbar-gutter: stable` on <html>, which reserves the
  // gutter unconditionally — there's nothing to compensate
  // for, and adding padding-right here on top of that
  // *causes* a layout shift (pushes content inward by the
  // gutter width since clientWidth always reads as
  // viewport-width − gutter).
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
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
    <ModalContext.Provider value={{ titleId, inHeader: false }}>
      {/* Backdrop. backdrop-filter: blur frosts the page behind
          the modal so even when the colour-contrast is subtle
          (notably dark mode, where a pure-black scrim on a
          pure-black page would be invisible), the modal still
          reads as elevated over a visually different surface.
          Tokens for colour + opacity are theme-aware
          (var(--ds-overlay-backdrop-*)). */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--ds-overlay-backdrop-color)",
          opacity: visible ? "var(--ds-overlay-backdrop-opacity)" : (0 as never),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
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
          aria-labelledby={titleId}
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
              padding: `${hasStickyHeader ? 0 : 24}px 24px ${
                lastChildIsInset && footerChild ? 0 : 24
              }px`,
              overflowX: "hidden",
              overflowY: "auto",
              position: "relative",
              borderTopLeftRadius: hasStickyHeader ? 12 : undefined,
              borderTopRightRadius: hasStickyHeader ? 12 : undefined,
            }}
          >
            {bodyChildren}
          </div>

          {/* Footer (outside scrollable body) */}
          {footerChild}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

Modal.Title = ModalTitle;
Modal.P = ModalP;
Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Inset = ModalInset;
