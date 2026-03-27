"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface MultiSelectItem {
  value: string;
  label: string;
}

interface MultiSelectProps {
  items: MultiSelectItem[];
  selected?: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// MultiSelect Component
// ============================================================================

export function MultiSelect({
  items,
  selected: controlledSelected,
  defaultSelected,
  onChange,
  placeholder = "Select items...",
  className = "",
}: MultiSelectProps) {
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(
    defaultSelected || [],
  );
  const selected = isControlled ? controlledSelected : internalSelected;

  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(-1);
  const [activeFocus, setActiveFocus] = useState<"checkbox" | "button">(
    "checkbox",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updateSelected = useCallback(
    (newSelected: string[]) => {
      if (!isControlled) {
        setInternalSelected(newSelected);
      }
      onChange?.(newSelected);
    },
    [isControlled, onChange],
  );

  // Toggle individual item
  const toggleItem = useCallback(
    (value: string) => {
      const newSelected = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      updateSelected(newSelected);
    },
    [selected, updateSelected],
  );

  // Smart action for button click
  const smartAction = useCallback(
    (value: string) => {
      const isSelected = selected.includes(value);
      const othersSelected = selected.filter((v) => v !== value);
      const allOthersSelected = items
        .filter((item) => item.value !== value)
        .every((item) => selected.includes(item.value));

      if (!isSelected) {
        // Select Only: select just this item
        updateSelected([value]);
      } else if (allOthersSelected) {
        // Select All: all others are selected, so select all including this
        updateSelected(items.map((item) => item.value));
      } else {
        // Toggle: deselect this item
        updateSelected(othersSelected);
      }
    },
    [selected, items, updateSelected],
  );

  // Get action label for an item
  const getActionLabel = useCallback(
    (value: string): string => {
      const isSelected = selected.includes(value);
      const allOthersSelected = items
        .filter((item) => item.value !== value)
        .every((item) => selected.includes(item.value));

      if (!isSelected) return "Select Only";
      if (allOthersSelected) return "Select All";
      return "Toggle";
    },
    [selected, items],
  );

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger = containerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset active row when menu closes
  useEffect(() => {
    if (!isOpen) {
      setActiveRow(-1);
      setActiveFocus("checkbox");
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setActiveRow(0);
          return;
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveRow((prev) => Math.max(prev - 1, 0));
          break;
        case "ArrowRight":
          e.preventDefault();
          setActiveFocus("button");
          break;
        case "ArrowLeft":
          e.preventDefault();
          setActiveFocus("checkbox");
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeRow >= 0 && activeRow < items.length) {
            if (activeFocus === "checkbox") {
              toggleItem(items[activeRow].value);
            } else {
              smartAction(items[activeRow].value);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, activeRow, activeFocus, items, toggleItem, smartAction],
  );

  // Selection count text
  const selectionText =
    selected.length === 0
      ? placeholder
      : `${selected.length} selected`;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
      className={className}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          inline-flex items-center justify-center select-none cursor-pointer border-none
          transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-[var(--ds-transition-timing)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
          rounded-[var(--ds-radius-small)]
          h-[var(--ds-button-height-medium)] px-[var(--ds-button-padding-medium)] text-button-14 gap-[var(--ds-button-gap-medium)]
          bg-[var(--ds-background-100)] text-[var(--ds-gray-1000)]
          shadow-[0_0_0_1px_var(--ds-gray-400)]
          hover:bg-[var(--ds-gray-100)] hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]
          dark:hover:bg-[var(--ds-gray-200)] dark:hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]
        `
          .replace(/\s+/g, " ")
          .trim()}
      >
        <span className="content px-[var(--ds-button-content-padding)]">
          {selectionText}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transition: "transform 200ms",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Portal */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <MultiSelectDropdown
            containerRef={containerRef}
            dropdownRef={dropdownRef}
            items={items}
            selected={selected}
            activeRow={activeRow}
            activeFocus={activeFocus}
            onToggleItem={toggleItem}
            onSmartAction={smartAction}
            getActionLabel={getActionLabel}
            onKeyDown={handleKeyDown}
            setActiveRow={setActiveRow}
          />,
          document.body,
        )}
    </div>
  );
}

// ============================================================================
// Dropdown (Portal)
// ============================================================================

function MultiSelectDropdown({
  containerRef,
  dropdownRef,
  items,
  selected,
  activeRow,
  activeFocus,
  onToggleItem,
  onSmartAction,
  getActionLabel,
  onKeyDown,
  setActiveRow,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  items: MultiSelectItem[];
  selected: string[];
  activeRow: number;
  activeFocus: "checkbox" | "button";
  onToggleItem: (value: string) => void;
  onSmartAction: (value: string) => void;
  getActionLabel: (value: string) => string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  setActiveRow: (index: number) => void;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    setCoords({
      top: rect.bottom + scrollY + 4,
      left: rect.left + scrollX,
      width: Math.max(rect.width, 260),
    });
  }, [containerRef]);

  // Focus the dropdown for keyboard events
  useEffect(() => {
    dropdownRef.current?.focus();
  }, [dropdownRef]);

  return (
    <>
      <div
        ref={dropdownRef}
        role="listbox"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        aria-multiselectable="true"
        style={{
          position: "absolute",
          top: coords.top,
          left: coords.left,
          background: "var(--ds-background-100)",
          borderRadius: 12,
          boxShadow: "var(--ds-shadow-menu)",
          padding: 8,
          width: coords.width,
          minWidth: 260,
          zIndex: 2001,
          fontSize: 14,
          overflowY: "auto",
          overscrollBehavior: "contain",
          animation: "multiselect-enter 150ms ease-out",
          outline: "none",
        }}
      >
        {items.map((item, index) => (
          <MultiSelectRow
            key={item.value}
            item={item}
            isSelected={selected.includes(item.value)}
            isActive={activeRow === index}
            activeFocus={activeFocus}
            actionLabel={getActionLabel(item.value)}
            onToggle={() => onToggleItem(item.value)}
            onAction={() => onSmartAction(item.value)}
            onMouseEnter={() => setActiveRow(index)}
          />
        ))}
      </div>
      <style>{`
        @keyframes multiselect-enter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Row Item
// ============================================================================

function MultiSelectRow({
  item,
  isSelected,
  isActive,
  activeFocus,
  actionLabel,
  onToggle,
  onAction,
  onMouseEnter,
}: {
  item: MultiSelectItem;
  isSelected: boolean;
  isActive: boolean;
  activeFocus: "checkbox" | "button";
  actionLabel: string;
  onToggle: () => void;
  onAction: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 8px",
        height: 40,
        borderRadius: 6,
        fontSize: 14,
        color: "var(--ds-gray-1000)",
        cursor: "pointer",
        background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
        transition: "background 150ms ease",
        position: "relative",
      }}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        tabIndex={-1}
        aria-label={`Toggle ${item.label}`}
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: isSelected
            ? "var(--ds-gray-1000)"
            : "var(--ds-background-100)",
          boxShadow: isSelected
            ? "none"
            : "inset 0 0 0 1px var(--ds-gray-400)",
          border: "none",
          padding: 0,
          outline:
            isActive && activeFocus === "checkbox"
              ? "2px solid var(--ds-focus-color)"
              : "none",
          outlineOffset: 1,
          transition: "background 150ms ease, box-shadow 150ms ease",
        }}
      >
        {isSelected && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="var(--ds-background-100)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6L5 9L10 3" />
          </svg>
        )}
      </button>

      {/* Label */}
      <span
        style={{ flex: 1, userSelect: "none" }}
        onClick={onToggle}
      >
        {item.label}
      </span>

      {/* Action Button - visible on hover/active */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
        tabIndex={-1}
        className="multiselect-action-btn"
        style={{
          fontSize: 12,
          color: "var(--ds-gray-900)",
          background: "transparent",
          border: "none",
          padding: "2px 6px",
          borderRadius: 4,
          cursor: "pointer",
          flexShrink: 0,
          opacity: isActive ? 1 : 0,
          transition: "opacity 150ms ease",
          outline:
            isActive && activeFocus === "button"
              ? "2px solid var(--ds-focus-color)"
              : "none",
          outlineOffset: 1,
          whiteSpace: "nowrap",
        }}
      >
        {actionLabel}
      </button>

      <style>{`
        .multiselect-action-btn {
          opacity: 0;
        }
        div[role="option"]:hover .multiselect-action-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
