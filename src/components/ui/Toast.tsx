"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastLink {
  label: string;
  href: string;
}

export interface ToastOptions {
  message: string;
  description?: string;
  action?: ToastAction;
  undo?: () => void;
  link?: ToastLink;
  preserve?: boolean;
  variant?: "default" | "success" | "warning" | "error";
  jsx?: ReactNode;
}

interface ToastItem {
  id: number;
  message: string;
  description?: string;
  action?: ToastAction;
  undo?: () => void;
  link?: ToastLink;
  preserve?: boolean;
  variant: "default" | "success" | "warning" | "error";
  jsx?: ReactNode;
  exiting?: boolean;
}

// ============================================================================
// Global Toast Manager
// ============================================================================

type ToastListener = (toasts: ToastItem[]) => void;

let toastIdCounter = 0;
let globalToasts: ToastItem[] = [];
const listeners = new Set<ToastListener>();

function notifyListeners() {
  listeners.forEach((fn) => fn([...globalToasts]));
}

function addToast(options: string | ToastOptions) {
  const opts: ToastOptions =
    typeof options === "string" ? { message: options } : options;

  const item: ToastItem = {
    id: ++toastIdCounter,
    message: opts.message,
    description: opts.description,
    action: opts.action,
    undo: opts.undo,
    link: opts.link,
    preserve: opts.preserve,
    variant: opts.variant || "default",
    jsx: opts.jsx,
  };

  globalToasts = [item, ...globalToasts].slice(0, 3);
  notifyListeners();

  if (!opts.preserve) {
    setTimeout(() => {
      removeToast(item.id);
    }, 5000);
  }
}

function removeToast(id: number) {
  // Mark as exiting for animation
  globalToasts = globalToasts.map((t) =>
    t.id === id ? { ...t, exiting: true } : t,
  );
  notifyListeners();

  // Remove after animation completes
  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 350);
}

// ============================================================================
// Variant Icons
// ============================================================================

function VariantIcon({ variant }: { variant: "success" | "warning" | "error" }) {
  const colors = { success: "#17B26A", warning: "#F79009", error: "#F04438" };
  const color = colors[variant];

  if (variant === "success") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.707 7.707l-5.5 5.5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 111.414-1.414L8.5 11.086l4.793-4.793a1 1 0 111.414 1.414z" fill={color} />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zm0 10a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill={color} />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.536 12.536a1 1 0 11-1.414 1.414L10 11.828l-2.122 2.122a1 1 0 01-1.414-1.414L8.586 10.5 6.464 8.378a1 1 0 011.414-1.414L10 9.086l2.122-2.122a1 1 0 111.414 1.414L11.414 10.5l2.122 2.036z" fill={color} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z" fill="currentColor" />
    </svg>
  );
}

// ============================================================================
// Single Toast Card
// ============================================================================

function ToastCard({
  item,
  index,
  total,
  isHovered,
  stackOffset,
  onDismiss,
  onHeightMeasured,
}: {
  item: ToastItem;
  index: number;
  total: number;
  isHovered: boolean;
  stackOffset: number;
  frontHeight: number;
  onDismiss: () => void;
  onHeightMeasured: (id: number, height: number) => void;
}) {
  const [entered, setEntered] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(63);
  const cardRef = useRef<HTMLDivElement>(null);
  const showIcon = item.variant !== "default";
  const zIndex = 5000 - index;

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      if (cardRef.current) {
        const h = cardRef.current.scrollHeight;
        setMeasuredHeight(h);
        onHeightMeasured(item.id, h);
      }
      const raf2 = requestAnimationFrame(() => {
        setEntered(true);
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Geist approach: entry from below, visible = transform:none,
  // hiding = scale(.98) + opacity:0 with fast timing
  // Stacking handled by parent hover + CSS variables

  // Use cumulative stack offset from container for accurate positioning
  const stackY = index === 0 ? 0 : -stackOffset;
  const stackZ = -index;

  let containerStyle: React.CSSProperties;

  if (item.exiting) {
    // Exit: scale down slightly, fade out, fast
    containerStyle = {
      opacity: 0,
      transform: "scale(0.98)",
      transition: "all 0.16s cubic-bezier(0.6, 0.3, 0.98, 0.5)",
    };
  } else if (!entered) {
    // Entry: below viewport
    containerStyle = {
      opacity: 0,
      transform: "translate3d(0, 100%, 150px) scale(1)",
      transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
    };
  } else if (index === 0) {
    // Front toast: visible, no transform
    containerStyle = {
      opacity: 1,
      transform: "none",
      transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
    };
  } else if (index === 1) {
    // Second toast: peek 10px above the front toast
    const peekOffset = frontHeight + 10;
    containerStyle = {
      opacity: 1,
      maxHeight: 50,
      transform: `translate3d(0, -${peekOffset}px, -1px) scale(0.95)`,
      transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
    };
  } else if (index === 2) {
    // Third toast: peek 20px above front toast
    const peekOffset = frontHeight + 20;
    containerStyle = {
      opacity: 1,
      maxHeight: 50,
      transform: `translate3d(0, -${peekOffset}px, -2px) scale(0.9)`,
      transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
    };
  } else {
    // 4th+: hidden
    const peekOffset = frontHeight + 20;
    containerStyle = {
      opacity: 0,
      pointerEvents: "none",
      transform: `translate3d(0, -${peekOffset}px, -2px) scale(0.9)`,
      transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
    };
  }

  // Message opacity: non-front toasts hide message when not hovered
  const messageOpacity = entered && !item.exiting && index > 0 && !isHovered ? 0 : 1;

  return (
    <div
      ref={cardRef}
      role="status"
      aria-atomic="true"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 420,
        maxWidth: "min(420px, calc(100vw - 48px))",
        backgroundColor: "var(--ds-background-100)",
        boxShadow: "var(--ds-shadow-menu)",
        borderRadius: 12,
        padding: 16,
        lineHeight: "20px",
        color: "var(--ds-gray-1000)",
        zIndex,
        overflow: "hidden",
        pointerEvents: item.exiting || index >= 3 ? "none" as const : "auto" as const,
        // CSS custom properties for hover expansion
        "--y": `${stackY}px`,
        "--z": `${stackZ}px`,
        "--max-height": `${measuredHeight}px`,
        ...containerStyle,
      } as React.CSSProperties}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          maxWidth: "100%",
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        <div
          className="ds-toast-message"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            width: "100%",
            marginTop: -1,
            wordBreak: "break-word",
            opacity: messageOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {showIcon && (
                <div style={{ flexShrink: 0 }}>
                  <VariantIcon variant={item.variant as "success" | "warning" | "error"} />
                </div>
              )}
              {item.jsx ? (
                <span style={{ display: "block", lineHeight: "20px" }}>{item.jsx}</span>
              ) : (
                <span style={{ display: "block", fontWeight: item.description ? 500 : 400, lineHeight: "20px" }}>
                  {item.message}
                </span>
              )}
            </div>
            {item.description && (
              <span style={{ color: "var(--ds-gray-900)", fontSize: 13, lineHeight: "18px" }}>
                {item.description}
              </span>
            )}
            {(item.action || item.undo || item.link) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                {item.action && (
                  <button type="button" onClick={() => { item.action?.onClick(); onDismiss(); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--ds-gray-1000)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                    {item.action.label}
                  </button>
                )}
                {item.undo && (
                  <button type="button" onClick={() => { item.undo?.(); onDismiss(); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--ds-gray-1000)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                    Undo
                  </button>
                )}
                {item.link && (
                  <a href={item.link.href} style={{ fontSize: 13, fontWeight: 500, color: "var(--ds-blue-700)", textDecoration: "none" }}>
                    {item.link.label}
                  </a>
                )}
              </div>
            )}
          </div>

          {(index === 0 || isHovered) && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "nowrap" }}>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss toast"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: 6,
                  color: "var(--ds-gray-900)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--ds-gray-100)";
                  e.currentTarget.style.color = "var(--ds-gray-1000)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--ds-gray-900)";
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Toast Container (renders all stacked toasts)
// ============================================================================

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [heights, setHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    setMounted(true);
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const handleHeightMeasured = useCallback((id: number, height: number) => {
    setHeights((prev) => ({ ...prev, [id]: height }));
  }, []);

  if (!mounted || toasts.length === 0) return null;

  const hasMultiple = toasts.filter((t) => !t.exiting).length > 1;

  // Compute cumulative stack offsets based on actual heights
  const gap = 16;
  const stackOffsets: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < toasts.length; i++) {
    stackOffsets.push(cumulative);
    cumulative += (heights[toasts[i].id] || 63) + gap;
  }

  // Total height of all toasts expanded (for hover hit area)
  const totalExpandedHeight = cumulative - gap; // remove last gap

  return createPortal(
    <div
      className={`ds-toast-area${hasMultiple ? " ds-toast-area--multiple" : ""}`}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 5000,
        width: 420,
        height: isHovered ? totalExpandedHeight : (heights[toasts[0]?.id] || 63),
        transition: "transform 0.4s ease, bottom 0.4s ease, height 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {toasts.map((item, index) => (
        <ToastCard
          key={item.id}
          item={item}
          index={index}
          total={toasts.length}
          isHovered={isHovered && hasMultiple}
          stackOffset={stackOffsets[index]}
          frontHeight={heights[toasts[0]?.id] || 63}
          onDismiss={() => removeToast(item.id)}
          onHeightMeasured={handleHeightMeasured}
        />
      ))}
    </div>,
    document.body,
  );
}

// ============================================================================
// Legacy Toast component (backwards-compatible wrapper)
// ============================================================================

export function Toast({
  toast,
  onDismiss,
}: {
  toast: { message: string; isVisible: boolean; isExiting?: boolean; variant?: string; [key: string]: unknown };
  onDismiss: () => void;
}) {
  // This is a no-op — the ToastContainer handles rendering now
  return null;
}

// ============================================================================
// useToast Hook
// ============================================================================

export function useToast() {
  const showToast = useCallback((options: string | ToastOptions) => {
    addToast(options);
  }, []);

  const dismissToast = useCallback(() => {
    // Dismiss the most recent toast
    if (globalToasts.length > 0) {
      removeToast(globalToasts[0].id);
    }
  }, []);

  // Return a dummy toast object for backwards compatibility
  const toast = { message: "", isVisible: false, isExiting: false, variant: "default" as const };

  return { toast, showToast, dismissToast };
}
