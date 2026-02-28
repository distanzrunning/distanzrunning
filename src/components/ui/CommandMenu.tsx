"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

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
// Context
// ============================================================================

interface CommandMenuContextValue {
  search: string;
  activeId: string | null;
  registerItem: (id: string, label: string) => void;
  unregisterItem: (id: string) => void;
}

const CommandMenuContext = createContext<CommandMenuContextValue>({
  search: "",
  activeId: null,
  registerItem: () => {},
  unregisterItem: () => {},
});

// ============================================================================
// Constants
// ============================================================================

const DURATION = 300;
const TIMING = "cubic-bezier(0.175, 0.885, 0.32, 1.1)";

// ============================================================================
// Compound Components
// ============================================================================

function CommandMenuGroup({ heading, children }: CommandMenuGroupProps) {
  return (
    <div role="group" aria-label={heading}>
      {heading && (
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            height: 40,
            padding: "0 8px",
            fontSize: 13,
            color: "var(--ds-gray-700)",
            userSelect: "none",
          }}
        >
          {heading}
        </div>
      )}
      <div role="listbox">{children}</div>
    </div>
  );
}

function CommandMenuItem({
  children,
  onSelect,
  disabled = false,
  icon,
  shortcut,
}: CommandMenuItemProps) {
  const itemId = useRef(
    `cmd-item-${Math.random().toString(36).slice(2, 9)}`,
  ).current;
  const { search, activeId, registerItem, unregisterItem } =
    useContext(CommandMenuContext);

  const label =
    typeof children === "string"
      ? children
      : itemId;

  useEffect(() => {
    registerItem(itemId, label);
    return () => unregisterItem(itemId);
  }, [itemId, label, registerItem, unregisterItem]);

  // Filter: hide items that don't match search
  if (
    search &&
    typeof children === "string" &&
    !children.toLowerCase().includes(search.toLowerCase())
  ) {
    return null;
  }

  const isActive = activeId === itemId;

  return (
    <div
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled}
      data-command-item=""
      data-item-id={itemId}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 40,
        minHeight: 40,
        padding: "0 8px",
        borderRadius: 6,
        fontSize: 14,
        color: disabled ? "var(--ds-gray-600)" : "var(--ds-gray-1000)",
        cursor: disabled ? "default" : "pointer",
        background: isActive ? "var(--ds-gray-alpha-200)" : "transparent",
        transition: "background 0.1s ease",
        userSelect: "none",
        scrollMargin: "8px 0",
      }}
      onClick={() => {
        if (!disabled && onSelect) onSelect();
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "var(--ds-gray-alpha-200)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
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
    </div>
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
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Map<string, string>>(new Map());

  // Animation mount/unmount
  useEffect(() => {
    if (open) {
      setSearch("");
      setActiveId(null);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
      }, DURATION);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  // Focus input when visible
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  // Body scroll lock
  useEffect(() => {
    if (!mounted) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [mounted]);

  // Item registration for keyboard navigation
  const registerItem = useCallback((id: string, label: string) => {
    itemsRef.current.set(id, label);
  }, []);

  const unregisterItem = useCallback((id: string) => {
    itemsRef.current.delete(id);
  }, []);

  // Get visible item IDs from the DOM
  const getVisibleItemIds = useCallback(() => {
    if (typeof document === "undefined") return [];
    const items = document.querySelectorAll(
      '[data-command-item=""]:not([aria-disabled="true"])',
    );
    return Array.from(items)
      .filter((el) => el.getBoundingClientRect().height > 0)
      .map((el) => el.getAttribute("data-item-id"))
      .filter(Boolean) as string[];
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const visibleIds = getVisibleItemIds();
        if (visibleIds.length === 0) return;

        const currentIndex = activeId ? visibleIds.indexOf(activeId) : -1;
        let nextIndex: number;

        if (e.key === "ArrowDown") {
          nextIndex =
            currentIndex < visibleIds.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : visibleIds.length - 1;
        }

        setActiveId(visibleIds[nextIndex]);
      }

      if (e.key === "Enter" && activeId) {
        e.preventDefault();
        const activeEl = document.querySelector(
          `[data-item-id="${activeId}"]`,
        ) as HTMLElement | null;
        if (activeEl) activeEl.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, activeId, getVisibleItemIds]);

  // Reset active item when search changes
  useEffect(() => {
    setActiveId(null);
  }, [search]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--ds-overlay-backdrop-color)",
          opacity: visible
            ? "var(--ds-overlay-backdrop-opacity)"
            : (0 as never),
          zIndex: 100,
          pointerEvents: visible ? "all" : "none",
          transition: `opacity ${DURATION}ms ${TIMING}`,
        }}
        onClick={onClose}
      />

      {/* Overlay container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "min(120px, 15vh)",
          overflow: "auto",
          pointerEvents: "none",
        }}
      >
        {/* Command menu wrapper */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          className={`relative w-full mx-4 ${className}`}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 640,
            maxHeight: "min(600px, 70vh)",
            borderRadius: 12,
            background: "var(--ds-background-100)",
            boxShadow: "var(--ds-shadow-modal)",
            color: "var(--ds-gray-1000)",
            overflow: "hidden",
            pointerEvents: "all",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.98)",
            transition: `opacity ${DURATION}ms ${TIMING}, transform ${DURATION}ms ${TIMING}`,
          }}
        >
          {/* Search input — Geist: topSection */}
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
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 18,
                  color: "var(--ds-gray-1000)",
                  padding: 0,
                  fontFamily: "inherit",
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                  height: 20,
                  border: "none",
                  borderRadius: 4,
                  background: "var(--ds-background-100)",
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
          <div
            style={{
              overflowY: "auto",
              padding: 8,
              maxHeight: 436,
              transition: "height 0.1s ease",
            }}
          >
            <CommandMenuContext.Provider
              value={{ search, activeId, registerItem, unregisterItem }}
            >
              {children}
            </CommandMenuContext.Provider>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

CommandMenu.Group = CommandMenuGroup;
CommandMenu.Item = CommandMenuItem;
