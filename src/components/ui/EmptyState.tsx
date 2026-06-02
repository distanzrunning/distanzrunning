"use client";

import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps {
  children: ReactNode;
  /**
   * When true, render the container as a polite live region so screen
   * readers announce the empty state as it appears. Pass for
   * async-filtered lists where the empty state can replace results
   * after the user changes the filter; leave false for static "blank
   * slate" / permission / onboarding states the user navigates to.
   */
  live?: boolean;
}

interface EmptyStateIconProps {
  children: ReactNode;
}

interface EmptyStateTitleProps {
  children: ReactNode;
}

interface EmptyStateDescriptionProps {
  children: ReactNode;
}

interface EmptyStateActionsProps {
  children: ReactNode;
}

// ============================================================================
// Styles — Geist computed values, scoped to .ds-empty-state-*
// ============================================================================

const EMPTY_STATE_CSS = `
  .ds-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-6x);
    padding: 48px 70px;
    border: 1px solid var(--ds-gray-400);
    border-radius: var(--ds-radius-small);
    background-color: rgb(var(--color-surface));
    text-align: center;
  }

  .ds-empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 60px;
    padding: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    background-color: rgb(var(--color-surface));
    color: var(--ds-gray-900);
  }

  :is(.dark, [data-theme="dark"]) .ds-empty-state-icon {
    border-color: rgba(255, 255, 255, 0.14);
  }

  .ds-empty-state-icon svg {
    width: 32px;
    height: 32px;
  }

  .ds-empty-state-text {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--ds-space-2x);
  }

  .ds-empty-state-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.32px;
    color: var(--ds-gray-1000);
    margin: 0;
    max-width: 340px;
    text-align: center;
    text-wrap: balance;
  }

  .ds-empty-state-description {
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-900);
    margin: 0;
    max-width: 340px;
    text-align: center;
    text-wrap: balance;
  }

  .ds-empty-state-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-6x);
  }

  .ds-empty-state-btn-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border: none;
    border-radius: 6px;
    background-color: rgb(var(--color-surface));
    color: var(--ds-gray-1000);
    box-shadow: var(--ds-gray-400) 0px 0px 0px 1px;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  }

  .ds-empty-state-btn-secondary:hover {
    background-color: var(--ds-gray-100);
  }

  :is(.dark, [data-theme="dark"]) .ds-empty-state-btn-secondary:hover {
    background-color: var(--ds-gray-200);
  }

  .ds-empty-state-link {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 14px;
    color: var(--ds-gray-800);
    text-decoration: none;
    transition: color 0.1s ease;
  }

  .ds-empty-state-link:hover {
    color: var(--ds-gray-1000);
  }

  .ds-empty-state-link svg {
    width: 16px;
    height: 16px;
  }
`;

// ============================================================================
// Compound Components
// ============================================================================
//
// Each sub-component is ALSO a named export. The `EmptyState.X` static-
// property attachments below are kept for client-component callers
// (RecentDecisionsTable, DS docs), but server components MUST import
// the named exports directly — static properties on a `"use client"`
// export don't survive the RSC serialization boundary and resolve to
// `undefined` at render time (React error #130). See
// feedback_rsc_static_property_compound memory for the full incident.

export function EmptyStateIcon({ children }: EmptyStateIconProps) {
  return <div className="ds-empty-state-icon">{children}</div>;
}

export function EmptyStateTitle({ children }: EmptyStateTitleProps) {
  return <p className="ds-empty-state-title">{children}</p>;
}

export function EmptyStateDescription({ children }: EmptyStateDescriptionProps) {
  return <p className="ds-empty-state-description">{children}</p>;
}

export function EmptyStateActions({ children }: EmptyStateActionsProps) {
  return <div className="ds-empty-state-actions">{children}</div>;
}

// ============================================================================
// EmptyState
// ============================================================================

export function EmptyState({ children, live = false }: EmptyStateProps) {
  return (
    <>
      <style>{EMPTY_STATE_CSS}</style>
      <div
        className="ds-empty-state"
        role={live ? "status" : undefined}
        aria-live={live ? "polite" : undefined}
      >
        {children}
      </div>
    </>
  );
}

/** Wrapper for title + description to group them with tighter spacing */
export function EmptyStateText({ children }: { children: ReactNode }) {
  return <div className="ds-empty-state-text">{children}</div>;
}

EmptyState.Icon = EmptyStateIcon;
EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Text = EmptyStateText;
EmptyState.Actions = EmptyStateActions;
