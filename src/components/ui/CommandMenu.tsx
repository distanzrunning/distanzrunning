"use client";

import { Command } from "cmdk";
import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface CommandMenuProps {
  /** Whether the command menu is open */
  open: boolean;
  /** Called when the command menu should close */
  onClose: () => void;
  /** Command groups and items */
  children?: ReactNode;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

interface CommandMenuGroupProps {
  /** Optional heading label for the group */
  heading?: string;
  /** Command items */
  children: ReactNode;
}

interface CommandMenuItemProps {
  /** Item label content */
  children: ReactNode;
  /** Called when the item is selected */
  onSelect?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional icon rendered before the label */
  icon?: ReactNode;
  /** Optional keyboard shortcut label (e.g. "⌘K") */
  shortcut?: string;
}

// ============================================================================
// Styles — Geist computed values, scoped to .ds-cmdk-content
// ============================================================================

const CMDK_CSS = `
  .ds-cmdk-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: var(--ds-overlay-backdrop-color);
    opacity: var(--ds-overlay-backdrop-opacity);
    animation: ds-cmdk-fade-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  .ds-cmdk-content {
    position: fixed;
    top: 20vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: 640px;
    max-width: calc(100vw - 32px);
    border-radius: 12px;
    background: var(--ds-background-100);
    box-shadow: var(--ds-shadow-modal);
    color: var(--ds-gray-1000);
    overflow: hidden;
    outline: none;
    animation: ds-cmdk-scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  @keyframes ds-cmdk-fade-in {
    from { opacity: 0; }
  }

  @keyframes ds-cmdk-scale-in {
    from {
      opacity: 0;
      transform: translateX(-50%) scale(0.98);
    }
  }

  .ds-cmdk-content [cmdk-input] {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 18px;
    color: var(--ds-gray-1000);
    padding: 0;
    font-family: inherit;
  }

  .ds-cmdk-content [cmdk-input]::placeholder {
    color: var(--ds-gray-700);
  }

  .ds-cmdk-content [cmdk-list] {
    overflow: hidden auto;
    overscroll-behavior: contain;
    padding: 8px;
    max-height: 436px;
    height: min(var(--cmdk-list-height, 300px), 436px);
    transition: height 0.1s ease;
    background: var(--ds-background-100);
  }

  .ds-cmdk-content [cmdk-group-heading] {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 8px;
    font-size: 13px;
    color: var(--ds-gray-700);
    user-select: none;
  }

  .ds-cmdk-content [cmdk-item] {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    min-height: 40px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 14px;
    color: var(--ds-gray-1000);
    cursor: pointer;
    scroll-margin: 8px 0;
    transition: background 0.1s ease;
    user-select: none;
  }

  .ds-cmdk-content [cmdk-item][data-selected="true"] {
    background: var(--ds-gray-alpha-200);
  }

  .ds-cmdk-content [cmdk-item][data-disabled="true"] {
    color: var(--ds-gray-600);
    cursor: default;
  }

  .ds-cmdk-content [cmdk-empty] {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    font-size: 14px;
    color: var(--ds-gray-700);
    user-select: none;
  }

  .ds-cmdk-esc-button {
    display: none;
    background: var(--ds-background-100);
  }

  @media (hover: hover) and (pointer: fine) {
    .ds-cmdk-esc-button {
      display: flex;
    }
    .ds-cmdk-esc-button:hover {
      background: var(--ds-gray-100) !important;
    }
  }
`;

// ============================================================================
// Compound Components
// ============================================================================

function CommandMenuGroup({ heading, children }: CommandMenuGroupProps) {
  return <Command.Group heading={heading}>{children}</Command.Group>;
}

function CommandMenuItem({
  children,
  onSelect,
  disabled = false,
  icon,
  shortcut,
}: CommandMenuItemProps) {
  return (
    <Command.Item onSelect={() => onSelect?.()} disabled={disabled}>
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
            color: disabled ? "var(--ds-gray-600)" : "var(--ds-gray-900)",
          }}
        >
          {icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
      {shortcut && (
        <kbd
          style={{
            fontSize: 12,
            lineHeight: "16px",
            color: "var(--ds-gray-700)",
            fontFamily: "inherit",
          }}
        >
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

// ============================================================================
// CommandMenu
// ============================================================================

export function CommandMenu({
  open,
  onClose,
  children,
  placeholder = "Search for actions...",
  className = "",
}: CommandMenuProps) {
  return (
    <>
      <style>{CMDK_CSS}</style>
      <Command.Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
        label="Command Menu"
        overlayClassName="ds-cmdk-overlay"
        contentClassName={`ds-cmdk-content ${className}`.trim()}
        loop
      >
        {/* Top section — Geist: topSection */}
        <div
          style={{
            position: "relative",
            padding: 12,
            borderBottom: "1px solid var(--ds-gray-alpha-400)",
            background: "var(--ds-background-100)",
          }}
        >
          {/* Input wrapper — Geist: inputWrapper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "0 4px",
            }}
          >
            <Command.Input placeholder={placeholder} />
            <button
              type="button"
              className="ds-cmdk-esc-button"
              onClick={onClose}
              style={{
                alignItems: "center",
                padding: "0 4px",
                height: 20,
                border: "none",
                borderRadius: 4,
                boxShadow:
                  "var(--ds-gray-alpha-400) 0px 0px 0px 1px, var(--ds-gray-100) 0px 0px 0px 1px",
                color: "var(--ds-gray-1000)",
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              Esc
            </button>
          </div>
        </div>

        {/* Scrollable items — Geist: list */}
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {children}
        </Command.List>
      </Command.Dialog>
    </>
  );
}

CommandMenu.Group = CommandMenuGroup;
CommandMenu.Item = CommandMenuItem;
