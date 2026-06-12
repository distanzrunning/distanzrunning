"use client";

import React from "react";

// ============================================================================
// Label — Geist's accessible form-control label
// ============================================================================
// A <label> wrapping a 13px block of subtle text. `capitalize` (the Geist
// default) title-cases the text via text-transform so a sentence-case string
// like "email address" renders "Email Address"; pass `capitalize={false}` to
// bypass the casing and render the text exactly as written.

export interface LabelProps {
  /** id of the form control this labels (sets the `for` attribute). */
  htmlFor?: string;
  /** Title-case the text via text-transform (default true, Geist behaviour). */
  capitalize?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Label({
  htmlFor,
  capitalize = true,
  children,
  className,
  style,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={className}>
      <div
        style={{
          display: "block",
          fontSize: 13,
          maxWidth: "100%",
          color: "hsl(var(--color-textSubtle))",
          marginBottom: 8,
          cursor: "text",
          ...(capitalize ? { textTransform: "capitalize" } : {}),
          ...style,
        }}
      >
        {children}
      </div>
    </label>
  );
}

export default Label;
