"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface ComboboxOption {
  value: string;
  label: string;
}

export type ComboboxSize = "small" | "default" | "large";

export interface ComboboxProps {
  /** Options to display in the dropdown */
  options: ComboboxOption[] | string[];
  /** Controlled selected value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Called when the selected value changes */
  onChange?: (value: string) => void;
  /** Called when the input text changes */
  onInputChange?: (value: string) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Disables the entire combobox */
  disabled?: boolean;
  /** Shows error state with aria-invalid */
  error?: boolean;
  /** Size variant */
  size?: ComboboxSize;
  /** Custom width for the whole combobox container */
  width?: number | string;
  /** Custom width for the dropdown list only */
  listWidth?: number | string;
  /** Message shown when no options match the filter */
  emptyMessage?: string;
  /** External label text rendered above the combobox */
  label?: string;
  /** ID for label/input association */
  id?: string;
  /** Additional CSS class for the outermost wrapper */
  className?: string;
}

// ============================================================================
// Icons (internal, inline SVG)
// ============================================================================

function SearchIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.02469 13 9.42677 12.475 10.5353 11.596L13.9697 15.0303L14.5 15.5607L15.5607 14.5L15.0303 13.9697L11.596 10.5353C12.475 9.42677 13 8.02469 13 6.5C13 2.91015 10.0899 0 6.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Size helpers
// ============================================================================

function getContainerHeight(size: ComboboxSize): string {
  switch (size) {
    case "small":
      return "var(--ds-space-small)";
    case "large":
      return "var(--ds-space-large)";
    default:
      return "var(--ds-space-medium)";
  }
}

function getFontClass(size: ComboboxSize): string {
  switch (size) {
    case "small":
      return "text-label-12";
    case "large":
      return "text-label-16";
    default:
      return "text-label-14";
  }
}

// ============================================================================
// Combobox
// ============================================================================

export function Combobox({
  options,
  value,
  defaultValue = "",
  onChange,
  onInputChange,
  placeholder = "Search...",
  disabled = false,
  error = false,
  size = "default",
  width,
  listWidth,
  emptyMessage = "No results found",
  label,
  id,
  className = "",
}: ComboboxProps) {
  const reactId = useId();
  const inputId = id || `combobox-input-${reactId}`;
  const listId = `combobox-list-${reactId}`;

  // Refs
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Normalize options
  const normalizedOptions = useMemo<ComboboxOption[]>(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt,
      ),
    [options],
  );

  // State
  const isControlled = value !== undefined;
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const currentValue = isControlled ? value : selectedValue;

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => {
    const initial = isControlled ? value : defaultValue;
    if (initial) {
      const match = normalizedOptions.find((o) => o.value === initial);
      return match ? match.label : initial;
    }
    return "";
  });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue === getLabelForValue(currentValue)) {
      return normalizedOptions;
    }
    const lower = inputValue.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lower),
    );
  }, [normalizedOptions, inputValue, currentValue]);

  // Clamp highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex((prev) => {
      if (prev >= filteredOptions.length) {
        return filteredOptions.length > 0 ? 0 : -1;
      }
      return prev;
    });
  }, [filteredOptions.length]);

  // Helper: get label for a value
  function getLabelForValue(val: string): string {
    const match = normalizedOptions.find((o) => o.value === val);
    return match ? match.label : val;
  }

  // Sync input value when controlled value changes externally
  useEffect(() => {
    if (isControlled && value) {
      const label = getLabelForValue(value);
      setInputValue(label);
    } else if (isControlled && !value) {
      setInputValue("");
    }
  }, [value, isControlled]);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        // Restore input to selected value label
        if (currentValue) {
          setInputValue(getLabelForValue(currentValue));
        } else {
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, currentValue, normalizedOptions]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // Handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      onInputChange?.(val);
      if (!isOpen) setIsOpen(true);
      setHighlightedIndex(0);
    },
    [isOpen, onInputChange],
  );

  const handleInputFocus = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      setInputValue(option.label);
      if (!isControlled) {
        setSelectedValue(option.value);
      }
      onChange?.(option.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    if (!isControlled) {
      setSelectedValue("");
    }
    onChange?.("");
    onInputChange?.("");
    inputRef.current?.focus();
  }, [isControlled, onChange, onInputChange]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    inputRef.current?.focus();
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(filteredOptions.length - 1);
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (
            isOpen &&
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        }
        case "Escape": {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            if (currentValue) {
              setInputValue(getLabelForValue(currentValue));
            } else {
              setInputValue("");
            }
            setHighlightedIndex(-1);
          }
          break;
        }
        case "Tab": {
          if (isOpen) {
            setIsOpen(false);
            if (currentValue) {
              setInputValue(getLabelForValue(currentValue));
            } else {
              setInputValue("");
            }
            setHighlightedIndex(-1);
          }
          break;
        }
      }
    },
    [
      disabled,
      isOpen,
      highlightedIndex,
      filteredOptions,
      handleSelect,
      currentValue,
      normalizedOptions,
    ],
  );

  // Styles
  const containerHeight = getContainerHeight(size);
  const fontClass = getFontClass(size);

  const inputBoxShadow = error
    ? "0 0 0 1px var(--ds-red-700)"
    : "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px";

  return (
    <div className={className} style={{ width }}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-14"
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--ds-gray-900)",
          }}
        >
          {label}
        </label>
      )}

      <div
        ref={comboboxRef}
        role="combobox"
        tabIndex={-1}
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns={listId}
      >
        {/* Container - inline-block with position relative */}
        <div
          className={`${fontClass} ${disabled ? "opacity-50" : ""}`}
          style={{
            display: "inline-block",
            position: "relative",
            height: containerHeight,
            width: "100%",
            zIndex: 0,
          }}
        >
          {/* Search icon prefix - absolutely positioned */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              pointerEvents: "none",
              zIndex: 1,
              color: "var(--ds-gray-900)",
            }}
          >
            <SearchIcon />
          </div>

          {/* Input - full width with padding for icons */}
          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            id={inputId}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-label={placeholder}
            aria-invalid={error || undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className={`${fontClass}`}
            style={{
              appearance: "none",
              display: "inline-block",
              width: "100%",
              height: containerHeight,
              padding: "0 40px",
              margin: 0,
              border: "none",
              borderRadius: 6,
              boxShadow: inputBoxShadow,
              background: "var(--ds-background-100)",
              color: "var(--ds-gray-1000)",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              outline: "none",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "clip",
              transition: "box-shadow 0.2s ease, outline 0.2s ease",
              cursor: disabled ? "not-allowed" : "text",
            }}
          />

          {/* Clear button - absolutely positioned */}
          <button
            type="button"
            aria-label="Clear selected value"
            tabIndex={0}
            onClick={handleClear}
            disabled={disabled}
            style={{
              display: currentValue && !disabled ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              height: containerHeight,
              padding: "0 12px",
              border: "none",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              background: "transparent",
              color: "var(--ds-gray-900)",
              cursor: "pointer",
              userSelect: "none",
              order: 2,
              transition: "color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
            }}
          >
            <XIcon />
          </button>

          {/* Chevron toggle - absolutely positioned */}
          <button
            type="button"
            aria-label="Open menu"
            tabIndex={-1}
            onClick={handleToggle}
            disabled={disabled}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 30,
              padding: 0,
              border: "none",
              background: "transparent",
              color: "var(--ds-gray-900)",
              cursor: disabled ? "not-allowed" : "pointer",
              userSelect: "none",
              transition: "color 0.15s ease",
            }}
          >
            <svg
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              style={{
                color: "currentcolor",
                transition: "transform 0.15s ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown list */}
        {isOpen ? (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="material-menu"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              width: listWidth || "100%",
              zIndex: 50,
              margin: 0,
              padding: "4px 0",
              listStyle: "none",
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {filteredOptions.length === 0 ? (
              <li
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                  color: "var(--ds-gray-700)",
                  fontSize: 14,
                }}
              >
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === currentValue}
                  data-highlighted={index === highlightedIndex}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  style={{
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 8px",
                    cursor: "pointer",
                    borderRadius: 6,
                    fontSize: 14,
                    scrollMargin: "8px 0",
                    background:
                      index === highlightedIndex
                        ? "var(--ds-gray-100)"
                        : option.value === currentValue
                          ? "var(--ds-gray-100)"
                          : "transparent",
                    transition: "background 100ms ease",
                  }}
                >
                  <span
                    title={option.label}
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                  >
                    {option.label}
                  </span>
                </li>
              ))
            )}
          </ul>
        ) : (
          <ul
            id={listId}
            aria-hidden="true"
            style={{ display: "none", margin: 0, padding: 0, listStyle: "none" }}
          />
        )}
      </div>
    </div>
  );
}
