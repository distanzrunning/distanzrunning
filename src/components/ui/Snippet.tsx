"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

interface SnippetProps {
  /** Command text (string or array for multi-line) */
  text: string | string[];
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
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
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
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Snippet Component
// ============================================================================

const variantStyles: Record<string, { bg: string; color: string }> = {
  success: { bg: "var(--ds-blue-100)", color: "var(--ds-blue-900)" },
  error: { bg: "var(--ds-red-100)", color: "var(--ds-red-900)" },
  warning: { bg: "var(--ds-amber-100)", color: "var(--ds-amber-900)" },
};

export function Snippet({
  text,
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

  const lines = Array.isArray(text) ? text : [text];
  const fullText = lines.join("\n");

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
        border: dark ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(0, 0, 0, 0.08)",
        background: vs ? vs.bg : dark ? "var(--ds-gray-1000)" : "var(--ds-background-100)",
        color: vs ? vs.color : dark ? "var(--ds-background-100)" : "var(--ds-gray-1000)",
        position: "relative",
      }}
    >
      {lines.map((line, i) => (
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
      ))}

      {/* Copy button — absolute positioned */}
      <button
        type="button"
        onClick={handleCopy}
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
          cursor: "pointer",
          transition: "opacity 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
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
            className={`absolute inset-0 transition-all duration-150 ease-out ${
              isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <CheckIcon />
          </span>
          <span
            className={`absolute inset-0 transition-all duration-150 ease-out ${
              isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"
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
