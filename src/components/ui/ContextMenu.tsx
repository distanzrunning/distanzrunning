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
    padding: 8px;
    border-radius: 12px;
    background: var(--ds-background-100);
    box-shadow: var(--ds-shadow-menu);
    color: var(--ds-gray-1000);
    font-size: 14px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style-type: none;
    z-index: 100;
    will-change: transform, opacity;
    animation-duration: 200ms;
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  .ds-context-menu-content[data-state="open"] {
    animation-name: ds-context-menu-in;
  }

  @keyframes ds-context-menu-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .ds-context-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 20px;
    color: var(--ds-gray-1000);
    cursor: pointer;
    user-select: none;
    outline: none;
    text-decoration: none;
    transition: background 0.1s ease;
  }

  .ds-context-menu-item[data-highlighted] {
    background: var(--ds-gray-alpha-200);
  }

  .ds-context-menu-item[data-disabled] {
    color: var(--ds-gray-600);
    cursor: default;
  }

  .ds-context-menu-separator {
    height: 1px;
    background: var(--ds-gray-alpha-400);
    margin: 4px;
  }

  .ds-context-menu-label {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 8px;
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
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: disabled ? "var(--ds-gray-600)" : "var(--ds-gray-900)",
          }}
        >
          {prefix}
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
      {suffix && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "var(--ds-gray-700)",
            flexShrink: 0,
          }}
        >
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
