"use client";

import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ContextMenuProps {
  /** Root wrapper — contains Trigger and menu content */
  children: ReactNode;
}

interface ContextMenuTriggerProps {
  /** The element that activates the context menu on right-click */
  children: ReactNode;
}

interface ContextMenuContentProps {
  /** Menu items, separators, and labels */
  children: ReactNode;
  /** Width of the menu content */
  width?: number;
}

interface ContextMenuItemProps {
  /** Item label content */
  children: ReactNode;
  /** Called when the item is clicked */
  onClick?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional element rendered before the label */
  prefix?: ReactNode;
  /** Optional element rendered after the label (e.g. keyboard shortcut) */
  suffix?: ReactNode;
  /** If provided, renders as a link */
  href?: string;
  /** Optional value for the item */
  value?: string;
}

interface ContextMenuLabelProps {
  /** Label text */
  children: ReactNode;
}

// ============================================================================
// Styles — Geist computed values, scoped to .ds-context-menu-*
// ============================================================================

const CONTEXT_MENU_CSS = `
  .ds-context-menu-content {
    padding: var(--ds-space-2x);
    border-radius: var(--ds-radius-large);
    background: hsl(var(--color-surface));
    box-shadow: var(--ds-shadow-menu);
    color: var(--ds-gray-1000);
    font-size: 14px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style-type: none;
    z-index: 100;
  }

  /* Geist: the context menu opens instantly and only fades out on close */
  .ds-context-menu-content[data-state="closed"] {
    animation: ds-context-menu-fade-out 150ms ease forwards;
  }

  @keyframes ds-context-menu-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  .ds-context-menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--ds-space-medium);
    padding: 0 var(--ds-space-2x);
    border-radius: var(--ds-radius-small);
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-1000);
    cursor: pointer;
    user-select: none;
    outline: none;
    text-decoration: none;
  }

  /* Geist: items grow to a 48px touch target and 16px text below the sm
     breakpoint (h-10 max-sm:h-12, text-sm max-sm:text-base). */
  @media (max-width: 639px) {
    .ds-context-menu-item {
      height: 48px;
      font-size: 16px;
    }
  }

  .ds-context-menu-item[data-highlighted] {
    background: var(--ds-gray-alpha-100);
  }

  .ds-context-menu-item[data-disabled] {
    color: var(--ds-gray-700);
    cursor: default;
    pointer-events: none;
  }

  .ds-context-menu-separator {
    height: 1px;
    background: var(--ds-gray-alpha-400);
    margin: var(--ds-space);
  }

  .ds-context-menu-label {
    display: flex;
    align-items: center;
    height: var(--ds-space-small);
    padding: 0 var(--ds-space-2x);
    font-size: 12px;
    color: var(--ds-gray-700);
    user-select: none;
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function ContextMenuTrigger({ children }: ContextMenuTriggerProps) {
  return (
    <RadixContextMenu.Trigger asChild>
      <span>{children}</span>
    </RadixContextMenu.Trigger>
  );
}

function ContextMenuContent({ children, width = 160 }: ContextMenuContentProps) {
  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.Content
        className="ds-context-menu-content"
        style={{ width }}
      >
        {children}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  );
}

function ContextMenuItem({
  children,
  onClick,
  disabled = false,
  prefix,
  suffix,
  href,
  value,
}: ContextMenuItemProps) {
  const content = (
    <>
      {prefix && (
        <span style={{ display: "flex", marginRight: 8 }}>{prefix}</span>
      )}
      {children}
      {suffix && (
        <span style={{ display: "flex", marginLeft: "auto", paddingLeft: 12 }}>
          {suffix}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <RadixContextMenu.Item asChild disabled={disabled} textValue={value}>
        <a className="ds-context-menu-item" href={href}>
          {content}
        </a>
      </RadixContextMenu.Item>
    );
  }

  return (
    <RadixContextMenu.Item
      className="ds-context-menu-item"
      onSelect={onClick}
      disabled={disabled}
      textValue={value}
    >
      {content}
    </RadixContextMenu.Item>
  );
}

function ContextMenuSeparator() {
  return <RadixContextMenu.Separator className="ds-context-menu-separator" />;
}

function ContextMenuLabel({ children }: ContextMenuLabelProps) {
  return (
    <RadixContextMenu.Label className="ds-context-menu-label">
      {children}
    </RadixContextMenu.Label>
  );
}

// ============================================================================
// ContextMenu
// ============================================================================

export function ContextMenu({ children }: ContextMenuProps) {
  return (
    <>
      <style>{CONTEXT_MENU_CSS}</style>
      <RadixContextMenu.Root>{children}</RadixContextMenu.Root>
    </>
  );
}

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
ContextMenu.Label = ContextMenuLabel;
