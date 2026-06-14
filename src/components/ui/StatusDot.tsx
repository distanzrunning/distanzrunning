"use client";

import React from "react";

// ============================================================================
// Types
// ============================================================================

type State =
  | "QUEUED"
  | "BUILDING"
  | "READY"
  | "ERROR"
  | "CANCELED"
  | "DELETED";

interface StatusDotProps {
  /** Deployment lifecycle state */
  state: State;
  /**
   * Noun phrase prefixed to the state message in the auto-composed
   * aria-label. Defaults to `"This deployment"`; pass the entity in
   * lists (`"vercel-site production"`).
   */
  titlePrefix?: string;
  /**
   * Show a sentence-cased state next to the dot (Building, Ready,
   * Error…). Use only when the dot stands alone without surrounding
   * text.
   */
  label?: boolean;
  /**
   * Mark the dot decorative when it sits inline with text that
   * already names the state — screen readers won't announce it twice.
   */
  "aria-hidden"?: boolean;
  className?: string;
}

// ============================================================================
// State → color / message tables
// ============================================================================

const stateColors: Record<State, string> = {
  QUEUED: "var(--ds-gray-500)",
  BUILDING: "var(--ds-amber-700)",
  READY: "var(--ds-teal-700)",
  ERROR: "var(--ds-red-700)",
  CANCELED: "var(--ds-gray-500)",
  DELETED: "var(--ds-gray-500)",
};

const stateMessages: Record<State, string> = {
  QUEUED: "is queued",
  BUILDING: "is building",
  READY: "is ready",
  ERROR: "had an error",
  CANCELED: "was canceled",
  DELETED: "was deleted",
};

const inFlightStates: Set<State> = new Set(["QUEUED", "BUILDING"]);

function sentenceCaseState(state: State): string {
  return state[0] + state.slice(1).toLowerCase();
}

// ============================================================================
// Component
// ============================================================================
// Pulse keyframes (`ds-status-dot-pulse` / `.ds-status-dot--pulse`) live in
// globals.css — not injected at runtime, which served stale CSS after edits.

export function StatusDot({
  state,
  titlePrefix = "This deployment",
  label = false,
  "aria-hidden": ariaHidden,
  className,
}: StatusDotProps) {
  const color = stateColors[state];
  const message = stateMessages[state];
  const ariaLabel = ariaHidden ? undefined : `${titlePrefix} ${message}.`;
  const title = `${titlePrefix} ${message}.`;
  const sentenceCased = sentenceCaseState(state);
  const shouldPulse = inFlightStates.has(state);

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center" }}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      title={title}
    >
      <span
        className={shouldPulse ? "ds-status-dot--pulse" : undefined}
        style={{
          display: "block",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 14,
            lineHeight: "16px",
            color: "var(--ds-gray-1000)",
            marginLeft: 8,
          }}
        >
          {sentenceCased}
        </span>
      )}
    </span>
  );
}

export default StatusDot;
