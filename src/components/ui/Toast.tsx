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

export interface ToastState {
  message: string;
  description?: string;
  action?: ToastAction;
  undo?: () => void;
  link?: ToastLink;
  preserve?: boolean;
  variant: "default" | "success" | "warning" | "error";
  jsx?: ReactNode;
  isVisible: boolean;
  isExiting: boolean;
}

// ============================================================================
// Variant Styles
// ============================================================================

function getVariantAccentColor(
  variant: "default" | "success" | "warning" | "error",
): string | null {
  switch (variant) {
    case "success":
      return "#17B26A";
    case "warning":
      return "#F79009";
    case "error":
      return "#F04438";
    default:
      return null;
  }
}

function VariantIcon({
  variant,
}: {
  variant: "success" | "warning" | "error";
}) {
  const color = getVariantAccentColor(variant);
  if (variant === "success") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.707 7.707l-5.5 5.5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 111.414-1.414L8.5 11.086l4.793-4.793a1 1 0 111.414 1.414z"
          fill={color!}
        />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zm0 10a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
          fill={color!}
        />
      </svg>
    );
  }
  // error
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.536 12.536a1 1 0 11-1.414 1.414L10 11.828l-2.122 2.122a1 1 0 01-1.414-1.414L8.586 10.5 6.464 8.378a1 1 0 011.414-1.414L10 9.086l2.122-2.122a1 1 0 111.414 1.414L11.414 10.5l2.122 2.036z"
        fill={color!}
      />
    </svg>
  );
}

// ============================================================================
// Close Icon
// ============================================================================

function CloseIcon() {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
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
// Toast Component
// ============================================================================

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const accentColor = getVariantAccentColor(toast.variant);
  const showIcon = toast.variant !== "default";

  const isVisible = toast.isVisible && !toast.isExiting;

  const toastElement = (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 5000,
        width: 0,
        height: 0,
        transition: "transform 0.4s ease, bottom 0.4s ease",
      }}
    >
      <div
        role="status"
        aria-atomic="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 420,
          maxWidth: 420,
          backgroundColor: "var(--ds-background-100)",
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, rgb(250, 250, 250) 0px 0px 0px 1px",
          borderRadius: 12,
          padding: 16,
          fontSize: 14,
          lineHeight: "21px",
          color: "var(--ds-gray-1000)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "none" : "translateY(12px)",
          transition: "all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)",
          pointerEvents: isVisible ? ("auto" as const) : ("none" as const),
        }}
      >
        {/* Toast inner */}
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
          {/* Message row */}
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
            {/* Left content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Variant icon + message */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {showIcon && (
                  <div style={{ flexShrink: 0 }}>
                    <VariantIcon variant={toast.variant as "success" | "warning" | "error"} />
                  </div>
                )}
                {toast.jsx ? (
                  <div>{toast.jsx}</div>
                ) : (
                  <span
                    style={{
                      display: "block",
                      fontWeight: toast.description ? 500 : 400,
                      lineHeight: "21px",
                    }}
                  >
                    {toast.message}
                  </span>
                )}
              </div>
              {toast.description && (
                <span
                  style={{
                    color: "var(--ds-gray-900)",
                    fontSize: 13,
                    lineHeight: "18px",
                  }}
                >
                  {toast.description}
                </span>
              )}
              {/* Action / Undo / Link */}
              {(toast.action || toast.undo || toast.link) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  {toast.action && (
                    <button
                      type="button"
                      onClick={() => { toast.action?.onClick(); onDismiss(); }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ds-gray-1000)",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      {toast.action.label}
                    </button>
                  )}
                  {toast.undo && (
                    <button
                      type="button"
                      onClick={() => { toast.undo?.(); onDismiss(); }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ds-gray-1000)",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      Undo
                    </button>
                  )}
                  {toast.link && (
                    <a
                      href={toast.link.href}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ds-blue-700)",
                        textDecoration: "none",
                      }}
                    >
                      {toast.link.label}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Dismiss button */}
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
                  color: "var(--ds-gray-1000)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  transition: "border-color 0.15s, background 0.15s, color 0.15s",
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(toastElement, document.body);
}

// ============================================================================
// useToast Hook
// ============================================================================

const initialState: ToastState = {
  message: "",
  variant: "default",
  isVisible: false,
  isExiting: false,
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>(initialState);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = useCallback(() => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    // Start exit animation
    setToast((prev) => ({ ...prev, isExiting: true }));
    exitTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false, isExiting: false }));
    }, 300);
  }, []);

  const showToast = useCallback(
    (options: string | ToastOptions) => {
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);

      const opts: ToastOptions =
        typeof options === "string" ? { message: options } : options;

      setToast({
        message: opts.message,
        description: opts.description,
        action: opts.action,
        undo: opts.undo,
        link: opts.link,
        preserve: opts.preserve,
        variant: opts.variant || "default",
        jsx: opts.jsx,
        isVisible: true,
        isExiting: false,
      });

      if (!opts.preserve) {
        dismissTimeoutRef.current = setTimeout(() => {
          dismissToast();
        }, 3000);
      }
    },
    [dismissToast],
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  return { toast, showToast, dismissToast };
}
