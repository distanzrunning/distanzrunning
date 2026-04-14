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

  const toastElement = (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        zIndex: 9999,
        maxWidth: 420,
        transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: toast.isVisible && !toast.isExiting ? 1 : 0,
        transform:
          toast.isVisible && !toast.isExiting
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(12px)",
        pointerEvents:
          toast.isVisible && !toast.isExiting ? ("auto" as const) : ("none" as const),
      }}
    >
      <div
        style={{
          background: "var(--ds-background-100)",
          boxShadow: "var(--ds-shadow-menu)",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 14,
          color: "var(--ds-gray-1000)",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
        role="status"
        aria-live="polite"
      >
        {/* Variant left accent bar */}
        {accentColor && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              background: accentColor,
              borderRadius: "8px 0 0 8px",
            }}
          />
        )}

        {/* Variant icon */}
        {showIcon && (
          <div style={{ paddingTop: 1, marginLeft: accentColor ? 4 : 0 }}>
            <VariantIcon
              variant={toast.variant as "success" | "warning" | "error"}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginLeft: accentColor && !showIcon ? 4 : 0,
          }}
        >
          {/* JSX content */}
          {toast.jsx ? (
            <div>{toast.jsx}</div>
          ) : (
            <>
              <span
                style={{
                  fontWeight: toast.description ? 500 : 400,
                  lineHeight: "20px",
                }}
              >
                {toast.message}
              </span>
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
            </>
          )}

          {/* Action / Undo / Link row */}
          {(toast.action || toast.undo || toast.link) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss();
                  }}
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
                  onClick={() => {
                    toast.undo?.();
                    onDismiss();
                  }}
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
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.textDecoration =
                      "underline";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.textDecoration =
                      "none";
                  }}
                >
                  {toast.link.label}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          style={{
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            borderRadius: 4,
            color: "var(--ds-gray-900)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "color 150ms, background 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--ds-gray-1000)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ds-gray-100)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--ds-gray-900)";
            (e.currentTarget as HTMLButtonElement).style.background = "none";
          }}
        >
          <CloseIcon />
        </button>
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
