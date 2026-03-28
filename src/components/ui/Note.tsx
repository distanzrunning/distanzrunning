"use client";

import { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Note type options */
export type NoteType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "secondary"
  | "violet"
  | "cyan";

/** Note size options */
export type NoteSize = "small" | "default" | "large";

/** Props for the Note component */
export interface NoteProps {
  /** The note content */
  children: React.ReactNode;
  /** Visual type of the note */
  type?: NoteType;
  /** Size of the note */
  size?: NoteSize;
  /** Filled background variant */
  fill?: boolean;
  /** Custom label text, or false to hide icon/label entirely */
  label?: string | false;
  /** Optional action button */
  action?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Icons (16x16 SVGs)
// ============================================================================

function InfoIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color, flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function SuccessIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color, flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8l1.75 1.75L10.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color, flexShrink: 0 }}
    >
      <path
        d="M6.457 1.89c.683-1.187 2.403-1.187 3.086 0l5.142 8.93c.69 1.197-.164 2.68-1.543 2.68H2.858c-1.38 0-2.233-1.483-1.543-2.68l5.142-8.93z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color, flexShrink: 0 }}
    >
      <path
        d="M6.457 1.89c.683-1.187 2.403-1.187 3.086 0l5.142 8.93c.69 1.197-.164 2.68-1.543 2.68H2.858c-1.38 0-2.233-1.483-1.543-2.68l5.142-8.93z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ============================================================================
// Style Maps
// ============================================================================

interface TypeConfig {
  borderColor: string;
  iconColor: string;
  fillBg: string;
  className: string;
  icon: (color: string) => React.ReactNode;
}

const typeConfigs: Record<NoteType, TypeConfig> = {
  default: {
    borderColor: "var(--ds-gray-alpha-400)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-alpha-100)",
    className: "",
    icon: (color) => <InfoIcon color={color} />,
  },
  success: {
    borderColor: "var(--ds-blue-400)",
    iconColor: "var(--ds-blue-900)",
    fillBg: "var(--ds-blue-100)",
    className: "geist-success",
    icon: (color) => <SuccessIcon color={color} />,
  },
  error: {
    borderColor: "var(--ds-red-400)",
    iconColor: "var(--ds-red-900)",
    fillBg: "var(--ds-red-100)",
    className: "geist-error",
    icon: (color) => <ErrorIcon color={color} />,
  },
  warning: {
    borderColor: "var(--ds-amber-400)",
    iconColor: "var(--ds-amber-900)",
    fillBg: "var(--ds-amber-100)",
    className: "geist-warning",
    icon: (color) => <WarningIcon color={color} />,
  },
  secondary: {
    borderColor: "var(--ds-gray-alpha-400)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-alpha-100)",
    className: "geist-secondary",
    icon: (color) => <InfoIcon color={color} />,
  },
  violet: {
    borderColor: "var(--ds-purple-400)",
    iconColor: "currentColor",
    fillBg: "var(--ds-purple-100)",
    className: "geist-violet",
    icon: (color) => <InfoIcon color={color} />,
  },
  cyan: {
    borderColor: "var(--ds-teal-400)",
    iconColor: "currentColor",
    fillBg: "var(--ds-teal-100)",
    className: "geist-cyan",
    icon: (color) => <InfoIcon color={color} />,
  },
};

interface SizeConfig {
  padding: string;
  fontSize: string;
  gap: string;
}

const sizeConfigs: Record<NoteSize, SizeConfig> = {
  small: {
    padding: "8px 12px",
    fontSize: "13px",
    gap: "8px",
  },
  default: {
    padding: "12px 16px",
    fontSize: "14px",
    gap: "12px",
  },
  large: {
    padding: "16px 20px",
    fontSize: "14px",
    gap: "12px",
  },
};

// ============================================================================
// Note Component
// ============================================================================

/**
 * Note component for displaying important information.
 *
 * @example
 * <Note type="success">This note details some success information.</Note>
 * <Note type="warning" fill>This filled note details some warning information.</Note>
 */
export const Note = forwardRef<HTMLDivElement, NoteProps>(
  (
    {
      children,
      type = "default",
      size = "default",
      fill = false,
      label,
      action,
      disabled = false,
      className = "",
    },
    ref,
  ) => {
    const typeConfig = typeConfigs[type];
    const sizeConfig = sizeConfigs[size];

    const showIcon = label !== false && label === undefined;
    const showLabel = label !== false && label !== undefined;
    const contentGap = showLabel ? "4px" : sizeConfig.gap;

    const containerStyle: React.CSSProperties = {
      boxShadow: `inset 0 0 0 1px ${typeConfig.borderColor}`,
      borderRadius: "6px",
      padding: sizeConfig.padding,
      fontSize: sizeConfig.fontSize,
      lineHeight: "1.5",
      ...(fill ? { backgroundColor: typeConfig.fillBg } : {}),
      ...(disabled ? { opacity: 0.5, pointerEvents: "none" as const } : {}),
    };

    return (
      <div
        ref={ref}
        className={`${typeConfig.className} ${className}`.trim()}
        style={containerStyle}
        role="note"
      >
        <div
          style={{
            display: "flex",
            alignItems: action ? "center" : "flex-start",
            justifyContent: action ? "space-between" : "flex-start",
            gap: action ? "12px" : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: contentGap,
              flex: action ? 1 : undefined,
              minWidth: 0,
            }}
          >
            {showIcon && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {typeConfig.icon(typeConfig.iconColor)}
              </span>
            )}
            {showLabel && (
              <span style={{ fontWeight: 600, flexShrink: 0 }}>{label}:</span>
            )}
            <span style={{ minWidth: 0 }}>{children}</span>
          </div>
          {action && (
            <span style={{ flexShrink: 0 }}>{action}</span>
          )}
        </div>
      </div>
    );
  },
);

Note.displayName = "Note";

export default Note;
