"use client";

import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps {
  children: ReactNode;
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
    background-color: var(--ds-background-100);
    text-align: center;
  }

  .ds-empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--ds-gray-900);
  }

  .ds-empty-state-icon svg {
    width: 32px;
    height: 32px;
  }

  .ds-empty-state-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ds-space-2x);
  }

  .ds-empty-state-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--ds-gray-1000);
    margin: 0;
  }

  .ds-empty-state-description {
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-900);
    margin: 0;
  }

  .ds-empty-state-actions {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2x);
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function EmptyStateIcon({ children }: EmptyStateIconProps) {
  return <div className="ds-empty-state-icon">{children}</div>;
}

function EmptyStateTitle({ children }: EmptyStateTitleProps) {
  return <p className="ds-empty-state-title">{children}</p>;
}

function EmptyStateDescription({ children }: EmptyStateDescriptionProps) {
  return <p className="ds-empty-state-description">{children}</p>;
}

function EmptyStateActions({ children }: EmptyStateActionsProps) {
  return <div className="ds-empty-state-actions">{children}</div>;
}

// ============================================================================
// EmptyState
// ============================================================================

export function EmptyState({ children }: EmptyStateProps) {
  // Separate icon, text (title/description), and actions
  return (
    <>
      <style>{EMPTY_STATE_CSS}</style>
      <div className="ds-empty-state">
        {children}
      </div>
    </>
  );
}

/** Wrapper for title + description to group them with tighter spacing */
function EmptyStateText({ children }: { children: ReactNode }) {
  return <div className="ds-empty-state-text">{children}</div>;
}

EmptyState.Icon = EmptyStateIcon;
EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Text = EmptyStateText;
EmptyState.Actions = EmptyStateActions;
