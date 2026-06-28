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
  | "cyan"
  | "tertiary"
  | "alert"
  | "lite"
  | "ghost"
  | "rotate-ccw";

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
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M6.25 7h1.5a1 1 0 0 1 1 1v4.25h-1.5V8.5h-1zM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    </svg>
  );
}

function SuccessIcon({ color }: { color: string }) {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.47-1.47.53-.53L11 4.94l-.53.53L6.5 9.44l-.97-.97L5 7.94 3.94 9l.53.53 1.5 1.5c.3.3.77.3 1.06 0z" />
    </svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  // Geist's error/destructive glyph is a diamond (gem) with "!", not an octagon.
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fill="currentColor" d="M10.9 0a1 1 0 0 1 .7.3l4.1 4.1.07.07a1 1 0 0 1 .23.63v5.8a1 1 0 0 1-.3.7l-4.1 4.1a1 1 0 0 1-.7.3H5a1 1 0 0 1-.53-.23l-.08-.06-4.1-4.1A1 1 0 0 1 0 10.9V5.1a1 1 0 0 1 .3-.7L4.4.3A1 1 0 0 1 5 0h5.9M1.5 5.3v5.4l3.8 3.8h5.4l3.8-3.8V5.3l-3.8-3.8H5.3zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-5h1.5z" />
    </svg>
  );
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fill="currentColor" d="M8.56.5c.57 0 1.1.33 1.35.85l5.9 12.22a1 1 0 0 1-.9 1.43H1.09a1 1 0 0 1-.9-1.43L6.1 1.35A1.5 1.5 0 0 1 7.44.5zm-6.67 13h12.22L8.56 2H7.44zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-4h1.5z" />
    </svg>
  );
}

// ============================================================================
// Style Maps
// ============================================================================

interface TypeConfig {
  borderColor: string;
  fillBorderColor: string;
  textColor: string;
  iconColor: string;
  fillBg: string;
  className: string;
  icon: (color: string) => React.ReactNode;
}

const typeConfigs: Record<NoteType, TypeConfig> = {
  default: {
    borderColor: "var(--ds-gray-400)",
    fillBorderColor: "var(--ds-gray-400)",
    textColor: "var(--ds-gray-900)",
    iconColor: "currentColor",
    fillBg: "transparent",
    className: "",
    icon: (color) => <InfoIcon color={color} />,
  },
  success: {
    borderColor: "var(--ds-blue-400)",
    fillBorderColor: "var(--ds-blue-100)",
    textColor: "var(--ds-blue-900)",
    iconColor: "var(--ds-blue-900)",
    fillBg: "var(--ds-blue-200)",
    className: "geist-success",
    icon: (color) => <SuccessIcon color={color} />,
  },
  error: {
    borderColor: "var(--ds-red-400)",
    fillBorderColor: "var(--ds-red-100)",
    textColor: "var(--ds-red-900)",
    iconColor: "var(--ds-red-900)",
    fillBg: "var(--ds-red-200)",
    className: "geist-error",
    icon: (color) => <ErrorIcon color={color} />,
  },
  warning: {
    borderColor: "var(--ds-amber-400)",
    fillBorderColor: "var(--ds-amber-100)",
    textColor: "var(--ds-amber-900)",
    iconColor: "var(--ds-amber-900)",
    fillBg: "var(--ds-amber-200)",
    className: "geist-warning",
    icon: (color) => <WarningIcon color={color} />,
  },
  secondary: {
    borderColor: "var(--ds-gray-alpha-400)",
    fillBorderColor: "transparent",
    textColor: "var(--ds-gray-alpha-900)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-alpha-200)",
    className: "geist-secondary",
    icon: (color) => <InfoIcon color={color} />,
  },
  violet: {
    borderColor: "var(--ds-purple-400)",
    fillBorderColor: "var(--ds-purple-100)",
    textColor: "var(--ds-purple-900)",
    iconColor: "currentColor",
    fillBg: "var(--ds-purple-200)",
    className: "geist-violet",
    icon: (color) => <InfoIcon color={color} />,
  },
  cyan: {
    borderColor: "var(--ds-teal-400)",
    fillBorderColor: "var(--ds-teal-100)",
    textColor: "var(--ds-teal-900)",
    iconColor: "currentColor",
    fillBg: "var(--ds-teal-200)",
    className: "geist-cyan",
    icon: (color) => <InfoIcon color={color} />,
  },
  tertiary: {
    borderColor: "var(--ds-gray-400)",
    fillBorderColor: "var(--ds-gray-400)",
    textColor: "var(--ds-gray-900)",
    iconColor: "currentColor",
    fillBg: "transparent",
    className: "geist-tertiary",
    icon: (color) => <InfoIcon color={color} />,
  },
  alert: {
    borderColor: "var(--ds-red-400)",
    fillBorderColor: "var(--ds-red-100)",
    textColor: "var(--ds-red-900)",
    iconColor: "var(--ds-red-900)",
    fillBg: "var(--ds-red-200)",
    className: "geist-alert",
    icon: (color) => <InfoIcon color={color} />,
  },
  lite: {
    borderColor: "var(--ds-gray-400)",
    fillBorderColor: "var(--ds-gray-400)",
    textColor: "var(--ds-gray-900)",
    iconColor: "currentColor",
    fillBg: "transparent",
    className: "geist-lite",
    icon: (color) => <InfoIcon color={color} />,
  },
  ghost: {
    borderColor: "var(--ds-gray-400)",
    fillBorderColor: "var(--ds-gray-400)",
    textColor: "var(--ds-gray-900)",
    iconColor: "currentColor",
    fillBg: "transparent",
    className: "geist-ghost",
    icon: (color) => <InfoIcon color={color} />,
  },
  "rotate-ccw": {
    borderColor: "var(--ds-gray-400)",
    fillBorderColor: "var(--ds-gray-400)",
    textColor: "var(--ds-gray-900)",
    iconColor: "currentColor",
    fillBg: "transparent",
    className: "geist-rotate-ccw",
    icon: (color) => <InfoIcon color={color} />,
  },
};

/**
 * Inline-link colour per type (Geist `--note-link`). Types without their own
 * `.v3-colors` override fall back to the base blue-700.
 */
const noteLinkColors: Record<NoteType, string> = {
  default: "var(--ds-blue-700)",
  success: "var(--ds-blue-1000)",
  error: "var(--ds-red-1000)",
  warning: "var(--ds-amber-1000)",
  secondary: "var(--ds-gray-1000)",
  violet: "var(--ds-purple-1000)",
  cyan: "var(--ds-teal-1000)",
  alert: "var(--ds-red-1000)",
  tertiary: "var(--ds-blue-700)",
  lite: "var(--ds-blue-700)",
  ghost: "var(--ds-blue-700)",
  "rotate-ccw": "var(--ds-blue-700)",
};

interface SizeConfig {
  padding: string;
  fontSize: string;
  gap: string;
  lineHeightPx: number;
  minHeight: number;
}

const sizeConfigs: Record<NoteSize, SizeConfig> = {
  small: {
    padding: "6px 8px",
    fontSize: "13px",
    gap: "8px",
    lineHeightPx: 20,
    minHeight: 34,
  },
  default: {
    padding: "8px 12px",
    fontSize: "14px",
    gap: "12px",
    lineHeightPx: 21,
    minHeight: 40,
  },
  large: {
    padding: "11px 12px",
    fontSize: "16px",
    gap: "12px",
    lineHeightPx: 24,
    minHeight: 48,
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

    const borderColor = disabled
      ? "var(--ds-gray-alpha-200)"
      : fill ? typeConfig.fillBorderColor : typeConfig.borderColor;
    const textColor = disabled ? "var(--ds-gray-700)" : typeConfig.textColor;
    const paddingRight = action ? "8px" : undefined;

    const containerStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexGrow: 1,
      border: `1px solid ${borderColor}`,
      borderRadius: action ? 10 : 6,
      padding: sizeConfig.padding,
      ...(paddingRight ? { paddingRight } : {}),
      minHeight: sizeConfig.minHeight,
      fontSize: sizeConfig.fontSize,
      lineHeight: 1.5,
      color: textColor,
      wordBreak: "break-word",
      gap: 12,
      ["--note-link" as string]: disabled
        ? "var(--ds-gray-700)"
        : noteLinkColors[type],
      ...(fill && !disabled ? { backgroundColor: typeConfig.fillBg } : {}),
    };

    return (
      <div
        ref={ref}
        className={`ds-note ${typeConfig.className}${disabled ? " ds-note-disabled" : ""} ${className}`.trim()}
        style={containerStyle}
        role="note"
      >
            <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: contentGap,
              margin: 0,
            }}
          >
            {showIcon && (
              <span style={{ display: "flex", height: sizeConfig.lineHeightPx, alignItems: "center" }}>
                {typeConfig.icon(disabled ? "var(--ds-gray-700)" : typeConfig.iconColor)}
              </span>
            )}
            {showLabel && (
              <span style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{label}: </span>
            )}
            <span>{children}</span>
          </div>
          {action && (
            <div style={{ flexShrink: 0 }}>{action}</div>
          )}
      </div>
    );
  },
);

Note.displayName = "Note";

export default Note;
