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
    "button",
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
      const allSelected = items.every((item) => selected.includes(item.value));

      if (allSelected || !isSelected) {
        // Only: select just this item
        updateSelected([value]);
      } else {
        // Check All: select all items
        updateSelected(items.map((item) => item.value));
      }
    },
    [selected, items, updateSelected],
  );

  // Get action label for the button area
  const getButtonActionLabel = useCallback(
    (value: string): string => {
      const isSelected = selected.includes(value);
      const allSelected = items.every((item) => selected.includes(item.value));

      if (allSelected) return "Only";
      if (!isSelected) return "Only";
      return "Check All";
    },
    [selected, items],
  );

  // Get action label for the checkbox area
  const getCheckboxActionLabel = useCallback(
    (value: string): string => {
      const isSelected = selected.includes(value);
      return isSelected ? "Uncheck" : "Check";
    },
    [selected],
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
      setActiveFocus("button");
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
          setActiveRow((prev) => prev === -1 ? 0 : Math.min(prev + 1, items.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveRow((prev) => prev === -1 ? items.length - 1 : Math.max(prev - 1, 0));
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
            getButtonActionLabel={getButtonActionLabel}
            getCheckboxActionLabel={getCheckboxActionLabel}
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
  getButtonActionLabel,
  getCheckboxActionLabel,
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
  getButtonActionLabel: (value: string) => string;
  getCheckboxActionLabel: (value: string) => string;
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
      width: Math.max(rect.width, 200),
    });
  }, [containerRef]);

  // Focus the dropdown for keyboard events
  useEffect(() => {
    dropdownRef.current?.focus({ preventScroll: true });
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
          minWidth: Math.max(coords.width, 200),
          width: "max-content",
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
            buttonActionLabel={getButtonActionLabel(item.value)}
            checkboxActionLabel={getCheckboxActionLabel(item.value)}
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
  buttonActionLabel,
  checkboxActionLabel,
  onToggle,
  onAction,
  onMouseEnter,
}: {
  item: MultiSelectItem;
  isSelected: boolean;
  isActive: boolean;
  activeFocus: "checkbox" | "button";
  buttonActionLabel: string;
  checkboxActionLabel: string;
  onToggle: () => void;
  onAction: () => void;
  onMouseEnter: () => void;
}) {
  const [hoverArea, setHoverArea] = useState<"checkbox" | "button" | null>(null);
  // Mouse hover takes priority, then keyboard focus
  const activeArea = hoverArea ?? (isActive ? activeFocus : null);
  const displayLabel = activeArea === "checkbox" ? checkboxActionLabel : buttonActionLabel;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setHoverArea(null)}
      className="group"
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Checkbox Area */}
      <div
        onMouseEnter={() => setHoverArea("checkbox")}
        style={{
          display: "flex",
          alignItems: "center",
          height: 32,
          width: 24,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <label
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 32,
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            background: isActive && activeFocus === "checkbox" ? "var(--ds-gray-100)" : "transparent",
            transition: "background 150ms ease",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              height: 20,
              width: 20,
              margin: -2,
              padding: 2,
              position: "relative",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 4,
                position: "relative",
                background: isSelected ? "var(--ds-gray-1000)" : "transparent",
                border: isSelected
                  ? "1px solid var(--ds-gray-1000)"
                  : "1px solid var(--ds-gray-alpha-400)",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              }}
            >
              <svg fill="none" height="16" viewBox="0 0 20 20" width="16" style={{ display: "block", flexShrink: 0 }}>
                <path
                  d="M14 7L8.5 12.5L6 10"
                  stroke="var(--ds-background-100)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  style={{ visibility: isSelected ? "visible" : "hidden" }}
                />
              </svg>
            </span>
          </span>
        </label>
      </div>

      {/* Button Area */}
      <button
        type="button"
        onMouseEnter={() => setHoverArea("button")}
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
        tabIndex={-1}
        aria-label={`${item.label}. ${buttonActionLabel}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flex: 1,
          width: "100%",
          padding: 6,
          borderRadius: 6,
          background: isActive && activeFocus === "button" ? "var(--ds-gray-alpha-100)" : "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          transition: "background 150ms ease",
          userSelect: "none",
          fontSize: 14,
        }}
        className="multiselect-row-button"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 14, lineHeight: "20px", color: "var(--ds-gray-1000)", whiteSpace: "nowrap" }}>
            {item.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            aria-hidden="true"
            className="multiselect-action-label"
            style={{
              fontWeight: 400,
              opacity: isActive ? 1 : 0,
              minWidth: 64,
              textAlign: "right",
              color: "var(--ds-gray-900)",
              marginLeft: "auto",
              padding: "2px 4px",
              borderRadius: 2,
              fontSize: 12,
              transition: "opacity 150ms ease",
            }}
          >
            {displayLabel}
          </span>
        </div>
      </button>

      <style>{`
        .group:hover .multiselect-action-label,
        .multiselect-row-button:hover .multiselect-action-label,
        .multiselect-row-button:focus-visible .multiselect-action-label {
          opacity: 1 !important;
        }
        .multiselect-row-button:hover {
          background: var(--ds-gray-alpha-100) !important;
        }
      `}</style>
    </div>
  );
}
