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
  | "ghost";

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
      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.25 7H7H7.74999C8.30227 7 8.74999 7.44772 8.74999 8V11.5V12.25H7.24999V11.5V8.5H7H6.25V7ZM8 6C8.55229 6 9 5.55228 9 5C9 4.44772 8.55229 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6Z" fill="currentColor" />
    </svg>
  );
}

function SuccessIcon({ color }: { color: string }) {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z" fill="currentColor" />
    </svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z" fill="currentColor" />
    </svg>
  );
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z" fill="currentColor" />
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
    textColor: "var(--ds-gray-800)",
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
    textColor: "rgba(0, 0, 0, 0.7)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-alpha-400)",
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
    textColor: "var(--ds-gray-800)",
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
    borderColor: "var(--ds-gray-300)",
    fillBorderColor: "var(--ds-gray-200)",
    textColor: "var(--ds-gray-800)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-100)",
    className: "geist-lite",
    icon: (color) => <InfoIcon color={color} />,
  },
  ghost: {
    borderColor: "var(--ds-gray-300)",
    fillBorderColor: "var(--ds-gray-200)",
    textColor: "var(--ds-gray-800)",
    iconColor: "currentColor",
    fillBg: "var(--ds-gray-100)",
    className: "geist-ghost",
    icon: (color) => <InfoIcon color={color} />,
  },
};

interface SizeConfig {
  padding: string;
  fontSize: string;
  gap: string;
  lineHeightPx: number;
}

const sizeConfigs: Record<NoteSize, SizeConfig> = {
  small: {
    padding: "6px 8px",
    fontSize: "13px",
    gap: "8px",
    lineHeightPx: 20,
  },
  default: {
    padding: "8px 12px",
    fontSize: "14px",
    gap: "12px",
    lineHeightPx: 21,
  },
  large: {
    padding: "11px 12px",
    fontSize: "16px",
    gap: "12px",
    lineHeightPx: 24,
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
      ? "var(--ds-gray-alpha-400)"
      : fill ? typeConfig.fillBorderColor : typeConfig.borderColor;
    const textColor = disabled ? "var(--ds-gray-600)" : typeConfig.textColor;
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
      fontSize: sizeConfig.fontSize,
      lineHeight: 1.5,
      color: textColor,
      wordBreak: "break-word",
      gap: 12,
      ...(fill && !disabled ? { backgroundColor: typeConfig.fillBg } : {}),
    };

    return (
      <div
        ref={ref}
        className={`${typeConfig.className}${disabled ? " ds-note-disabled" : ""} ${className}`.trim()}
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
                {typeConfig.icon(disabled ? "var(--ds-gray-600)" : typeConfig.iconColor)}
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
