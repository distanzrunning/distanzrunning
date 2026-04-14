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
    }, 3000);
  }
}

function removeToast(id: number) {
  globalToasts = globalToasts.filter((t) => t.id !== id);
  notifyListeners();
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
  onDismiss,
}: {
  item: ToastItem;
  index: number;
  onDismiss: () => void;
}) {
  const showIcon = item.variant !== "default";

  // Geist stacking: front toast is normal, behind toasts use
  // translate3d(0, calc(100% - Npx), -Zpx) scale(S)
  const scale = index === 0 ? 1 : 1 - index * 0.05;
  const yCalc =
    index === 0
      ? "none"
      : index === 1
        ? "translate3d(0px, calc(100% - 83px), -1px)"
        : "translate3d(0px, calc(100% - 103px), -2px)";
  const maxHeight = index === 0 ? 63 : 50;
  const zIndex = 5000 - index;

  return (
    <div
      role="status"
      aria-atomic="true"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 420,
        maxWidth: 420,
        maxHeight,
        backgroundColor: "var(--ds-background-100)",
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, rgb(250, 250, 250) 0px 0px 0px 1px",
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        lineHeight: "21px",
        color: "var(--ds-gray-1000)",
        transform: index === 0 ? "none" : `${yCalc} scale(${scale})`,
        transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
        zIndex,
        opacity: index > 2 ? 0 : 1,
      }}
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
          lineHeight: "21px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            width: "100%",
            marginTop: -1,
            wordBreak: "break-word",
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
                <div>{item.jsx}</div>
              ) : (
                <span style={{ display: "block", fontWeight: item.description ? 500 : 400, lineHeight: "21px" }}>
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

          {index === 0 && (
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

  useEffect(() => {
    setMounted(true);
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 5000,
        width: 0,
        height: 0,
      }}
    >
      {toasts.map((item, index) => (
        <ToastCard
          key={item.id}
          item={item}
          index={index}
          onDismiss={() => removeToast(item.id)}
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
