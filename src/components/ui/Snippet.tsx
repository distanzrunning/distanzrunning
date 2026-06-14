"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// Types
// ============================================================================

interface SnippetProps {
  /**
   * Command text. Accepts a string, an array of strings (one per line),
   * or a ReactNode for rich highlights — pair the ReactNode form with
   * `copyText` so the clipboard payload is plain text.
   */
  text: React.ReactNode;
  /**
   * Explicit clipboard payload. Use when `text` contains rich nodes
   * (highlights, conditional fragments) and you want the clipboard to
   * receive plain text. Redundant when `text` is already a string.
   */
  copyText?: string;
  /**
   * Empty-state copy shown when `text === ""`. Sentence case, no
   * trailing period, informational only (not copied).
   */
  placeholder?: string;
  /** Show $ prompt before each line */
  prompt?: boolean;
  /** Dark/inverted theme */
  dark?: boolean;
  /** Color variant */
  variant?: "default" | "success" | "error" | "warning";
  /** Width of the snippet */
  width?: string | number;
  /** Callback when text is copied */
  onCopy?: () => void;
  /** Externally controlled copied state */
  copied?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Icons
// ============================================================================

function CopyIcon() {
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
        d="M8.25 2c.14 0 .25.11.25.25V3H10v-.75C10 1.28 9.22.5 8.25.5h-5.5C1.78.5 1 1.28 1 2.25v7.5c0 .97.78 1.75 1.75 1.75H4.5V10H2.75a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm5 4c.14 0 .25.11.25.25v7.5q-.02.23-.25.25h-5.5a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm0 9.5c.97 0 1.75-.78 1.75-1.75v-7.5c0-.97-.78-1.75-1.75-1.75h-5.5C6.78 4.5 6 5.28 6 6.25v7.5c0 .97.78 1.75 1.75 1.75z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
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
        d="m15.56 4-.53.53-8.8 8.8c-.68.68-1.78.68-2.47 0l.53-.54-.53.53-2.79-2.79L.44 10 1.5 8.94l.53.53 2.8 2.8c.1.09.25.09.35 0l8.79-8.8.53-.53z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Snippet Component
// ============================================================================

// Geist's geist-new-themed.* tokens: each variant sets fg + bg + border.
const variantStyles: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  success: {
    bg: "var(--ds-blue-100)",
    color: "var(--ds-blue-900)",
    border: "var(--ds-blue-400)",
  },
  error: {
    bg: "var(--ds-red-100)",
    color: "var(--ds-red-900)",
    border: "var(--ds-red-400)",
  },
  warning: {
    bg: "var(--ds-amber-100)",
    color: "var(--ds-amber-900)",
    border: "var(--ds-amber-400)",
  },
};

function resolveClipboardText(
  text: React.ReactNode,
  copyText: string | undefined,
): string {
  if (copyText !== undefined) return copyText;
  if (typeof text === "string") return text;
  if (
    Array.isArray(text) &&
    text.every((item) => typeof item === "string")
  ) {
    return (text as string[]).join("\n");
  }
  return "";
}

export function Snippet({
  text,
  copyText,
  placeholder,
  prompt = true,
  dark = false,
  variant = "default",
  width = 300,
  onCopy,
  copied: controlledCopied,
  className = "",
}: SnippetProps) {
  const [internalCopied, setInternalCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isCopied = controlledCopied !== undefined ? controlledCopied : internalCopied;

  const isEmpty =
    text === "" ||
    (Array.isArray(text) && text.length === 0);
  const showPlaceholder = isEmpty && placeholder !== undefined;

  // Lines for the string / string[] render paths
  const lines: string[] = (() => {
    if (typeof text === "string") return [text];
    if (
      Array.isArray(text) &&
      text.every((item) => typeof item === "string")
    ) {
      return text as string[];
    }
    return [];
  })();
  const isStringText = lines.length > 0 || isEmpty;
  const fullText = resolveClipboardText(text, copyText);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullText);
    if (controlledCopied === undefined) {
      setInternalCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setInternalCopied(false), 2000);
    }
    onCopy?.();
  }, [fullText, onCopy, controlledCopied]);

  const resolvedWidth = typeof width === "number" ? `${width}px` : width;

  const hasVariant = variant !== "default";
  const vs = hasVariant ? variantStyles[variant] : null;

  return (
    <div
      className={`font-mono text-[13px] leading-5 ${className}`}
      style={{
        width: resolvedWidth,
        maxWidth: "100%",
        height: "auto",
        borderRadius: 6,
        padding: "10px 48px 10px 12px",
        // Inverted (dark) keeps the gray-alpha-400 border; variants recolour it.
        border: `1px solid ${vs ? vs.border : "var(--ds-gray-alpha-400)"}`,
        background: vs
          ? vs.bg
          : dark
            ? "var(--ds-gray-1000)"
            : "hsl(var(--color-surface))",
        color: vs
          ? vs.color
          : dark
            ? "var(--ds-gray-100)"
            : "hsl(var(--color-textDefault))",
        position: "relative",
      }}
    >
      {showPlaceholder ? (
        <pre
          style={{
            margin: 0,
            padding: 0,
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "20px",
            overflowY: "auto",
            whiteSpace: "nowrap",
            textAlign: "left",
            opacity: 0.6,
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          {placeholder}
        </pre>
      ) : isStringText ? (
        lines.map((line, i) => (
          <pre
            key={i}
            style={{
              margin: 0,
              padding: 0,
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "20px",
              overflowY: "auto",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
          >
            {prompt && (
              <span
                style={{
                  color: "inherit",
                  opacity: 0.7,
                  userSelect: "none",
                  marginRight: 8,
                }}
              >
                $
              </span>
            )}
            {line}
          </pre>
        ))
      ) : (
        // Rich ReactNode — render as-is. Caller should supply copyText
        // so the clipboard payload matches what users see.
        <div
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "20px",
            overflowY: "auto",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {prompt && (
            <span
              style={{
                color: "inherit",
                opacity: 0.7,
                userSelect: "none",
                marginRight: 8,
              }}
            >
              $
            </span>
          )}
          {text}
        </div>
      )}

      {/* Copy button — absolute positioned */}
      <button
        type="button"
        onClick={handleCopy}
        disabled={isEmpty}
        aria-label="Copy to clipboard"
        className="ds-snippet-copy-btn"
        style={{
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: isEmpty ? "not-allowed" : "pointer",
          opacity: isEmpty ? 0.4 : 1,
          transition: "opacity 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (isEmpty) return;
          e.currentTarget.style.boxShadow = dark
            ? "0 0 0 1px var(--ds-gray-700)"
            : "0 0 0 1px var(--ds-gray-400)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ position: "relative", height: 16, width: 16 }}>
          <span
            className={`absolute inset-0 transition-all duration-200 ease-in-out ${
              isCopied ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <CheckIcon />
          </span>
          <span
            className={`absolute inset-0 transition-all duration-200 ease-in-out ${
              isCopied ? "opacity-0 scale-50" : "opacity-100 scale-100"
            }`}
          >
            <CopyIcon />
          </span>
        </div>
      </button>
    </div>
  );
}

export default Snippet;
