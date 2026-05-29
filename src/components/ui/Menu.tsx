"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

type MenuPosition =
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end"
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
  menuWidth?: number;
  /** Trigger button ref so focus can be restored on close. */
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu components must be used within a <Menu>");
  return ctx;
}

// ============================================================================
// Menu Container
// ============================================================================

interface MenuProps {
  children: ReactNode;
  position?: MenuPosition;
  width?: number;
  /** Pixel gap between the trigger and the dropdown along the
   *  primary axis. Defaults to 4 — matches the header menu and
   *  existing DS-docs usage. Pass 12 to align with the calendar
   *  preset dropdown gap (used by the consent env filter). */
  sideOffset?: number;
}

export function Menu({
  children,
  position = "bottom-start",
  width,
  sideOffset = 4,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemCountRef = useRef(0);
  // Track whether the menu was open in the previous render so we can
  // restore focus to the trigger when it closes.
  const wasOpenRef = useRef(false);

  // Reset item count on each render cycle
  itemCountRef.current = 0;

  const registerItem = useCallback(() => {
    return itemCountRef.current++;
  }, []);

  // Click outside / Escape / window scroll or resize → close. The
  // dropdown is portaled to document.body with position: absolute
  // anchored to coords computed once on open, so any subsequent
  // viewport shift would visually orphan it from the trigger
  // (especially when the trigger lives inside a sticky header).
  // Closing matches Geist/Material/Radix popover behaviour.
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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleViewportShift() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleViewportShift, { passive: true });
    window.addEventListener("resize", handleViewportShift);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleViewportShift);
      window.removeEventListener("resize", handleViewportShift);
    };
  }, [isOpen]);

  // Reset active index when menu opens/closes, and restore focus to
  // the trigger when the menu transitions from open → closed so a
  // keyboard user lands back where they came from.
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      if (wasOpenRef.current) {
        // Wait for the dropdown unmount + portal cleanup before
        // moving focus; rAF keeps the call in the same paint frame.
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Positioning is now resolved inside <MenuDropdown> (it can flip the
  // requested side when the viewport would clip the menu). The
  // dropdown is portaled, so no inline offset on the trigger
  // container is needed here.

  // Separate children into MenuButton and menu content
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === MenuButton,
  );
  const items = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === MenuButton),
  );

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeIndex,
        setActiveIndex,
        itemCount: itemCountRef.current,
        registerItem,
        menuWidth: width,
        triggerRef,
      }}
    >
      <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
        {trigger}
        {isOpen && typeof document !== "undefined" &&
          createPortal(
            <MenuDropdown
              containerRef={containerRef}
              dropdownRef={dropdownRef}
              position={position}
              menuWidth={width}
              sideOffset={sideOffset}
            >
              {items}
            </MenuDropdown>,
            document.body,
          )}
      </div>
    </MenuContext.Provider>
  );
}

// ============================================================================
// MenuDropdown (Portal)
// ============================================================================

function MenuDropdown({
  containerRef,
  dropdownRef,
  position,
  menuWidth,
  sideOffset,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  position: MenuPosition;
  menuWidth?: number;
  sideOffset: number;
  children: ReactNode;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  // Resolved position after auto-flip — may differ from the prop
  // when the requested side would overflow the viewport.
  const [resolvedPosition, setResolvedPosition] = useState(position);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;
    const widthPx = menuWidth || 200;
    // Estimated dropdown height — refined on mount below if needed,
    // but most menus are short so this works for the initial flip
    // decision. Caller can pass a tighter width if it matters.
    const estimatedH = Math.min(
      8 + 40 * React.Children.count(children) + 8,
      viewportH - 16,
    );

    // Auto-flip: if the requested side would clip, swap to its
    // mirror. Vertical (bottom ↔ top) and horizontal (right ↔ left).
    let resolved: MenuPosition = position;
    if (position.startsWith("bottom")) {
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < estimatedH && spaceAbove > spaceBelow) {
        resolved = (position === "bottom-end" ? "top-end" : "top-start") as MenuPosition;
      }
    } else if (position.startsWith("right")) {
      const spaceRight = viewportW - rect.right;
      const spaceLeft = rect.left;
      if (spaceRight < widthPx && spaceLeft > spaceRight) {
        resolved = (position === "right-end" ? "left-end" : "left-start") as MenuPosition;
      }
    } else if (position.startsWith("left")) {
      const spaceLeft = rect.left;
      const spaceRight = viewportW - rect.right;
      if (spaceLeft < widthPx && spaceRight > spaceLeft) {
        resolved = (position === "left-end" ? "right-end" : "right-start") as MenuPosition;
      }
    }
    setResolvedPosition(resolved);

    let top = 0;
    let left = 0;

    if (resolved.startsWith("bottom")) {
      top = rect.bottom + scrollY + sideOffset;
      left = resolved === "bottom-end" ? rect.right + scrollX : rect.left + scrollX;
    } else if (resolved.startsWith("top")) {
      // Anchored to the bottom of the menu — `bottom` is computed by
      // the consumer using viewport height + scroll.
      top = rect.top + scrollY - sideOffset;
      left = resolved === "top-end" ? rect.right + scrollX : rect.left + scrollX;
    } else if (resolved.startsWith("left")) {
      left = rect.left + scrollX;
      top = resolved === "left-end" ? rect.bottom + scrollY : rect.top + scrollY;
    } else if (resolved.startsWith("right")) {
      left = rect.right + scrollX + sideOffset;
      top = resolved === "right-end" ? rect.bottom + scrollY : rect.top + scrollY;
    }

    setCoords({ top, left });
  }, [containerRef, position, menuWidth, children, sideOffset]);

  // Auto-focus the first non-disabled item when the dropdown mounts,
  // then handle Up/Down/Home/End at the container level. Roving
  // tabindex isn't needed — each item is tabindex=0 and we just call
  // .focus() on the right one.
  //
  // `preventScroll` is essential on this first focus: at the moment
  // it fires, the dropdown's coords useEffect has scheduled a setState
  // but the new position hasn't been committed to the DOM, so the
  // dropdown is still anchored at top:0, left:0. A plain .focus()
  // would scroll the page to that origin (jumping the viewport to
  // the top). Subsequent focus() calls from arrow keys happen after
  // the menu is positioned and should keep their default scroll-into-
  // view behaviour so long menus reveal the focused row.
  // Typeahead state lives in refs so it persists across keystrokes
  // without forcing re-renders.
  const typeaheadBufferRef = useRef("");
  const typeaheadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ),
    );
    if (items.length === 0) return;
    items[0].focus({ preventScroll: true });

    function handleKey(e: KeyboardEvent) {
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])',
        ),
      );
      if (items.length === 0) return;
      const currentIdx = items.findIndex(
        (item) => item === document.activeElement,
      );
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = currentIdx < 0 ? 0 : (currentIdx + 1) % items.length;
          items[next].focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev =
            currentIdx < 0
              ? items.length - 1
              : (currentIdx - 1 + items.length) % items.length;
          items[prev].focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          items[0].focus();
          break;
        }
        case "End": {
          e.preventDefault();
          items[items.length - 1].focus();
          break;
        }
        default: {
          // Typeahead: printable single-character key, no modifiers,
          // not Space (which activates the focused item).
          if (
            e.key.length !== 1 ||
            e.key === " " ||
            e.metaKey ||
            e.ctrlKey ||
            e.altKey
          ) {
            break;
          }

          // Append to the buffer and reset the idle timer (500ms is
          // the standard WAI-ARIA typeahead window).
          if (typeaheadTimerRef.current !== null) {
            window.clearTimeout(typeaheadTimerRef.current);
          }
          typeaheadBufferRef.current += e.key.toLowerCase();
          typeaheadTimerRef.current = window.setTimeout(() => {
            typeaheadBufferRef.current = "";
            typeaheadTimerRef.current = null;
          }, 500);

          // When the buffer is a single repeated character, cycle
          // through items starting with that character. Otherwise match
          // the full buffered prefix.
          const buf = typeaheadBufferRef.current;
          const isRepeatedChar =
            buf.length > 1 && buf.split("").every((c) => c === buf[0]);
          const needle = isRepeatedChar ? buf[0] : buf;

          // Start the search at the next item so repeated presses cycle.
          const startIdx = currentIdx >= 0 ? currentIdx + 1 : 0;
          for (let i = 0; i < items.length; i++) {
            const idx = (startIdx + i) % items.length;
            const label = (items[idx].textContent || "")
              .trim()
              .toLowerCase();
            if (label.startsWith(needle)) {
              e.preventDefault();
              items[idx].focus();
              break;
            }
          }
          break;
        }
      }
    }
    el.addEventListener("keydown", handleKey);
    return () => {
      el.removeEventListener("keydown", handleKey);
      if (typeaheadTimerRef.current !== null) {
        window.clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = null;
      }
      typeaheadBufferRef.current = "";
    };
  }, [dropdownRef]);

  // For top-anchored positions, we need `bottom` rather than `top`
  // so the menu's bottom edge sits above the trigger.
  const isTop = resolvedPosition.startsWith("top");
  const isLeft = resolvedPosition.startsWith("left");
  const isBottomEnd = resolvedPosition === "bottom-end";
  const isTopEnd = resolvedPosition === "top-end";

  return (
    <>
      <div
        ref={dropdownRef}
        role="menu"
        style={{
          position: "absolute",
          top: isTop ? undefined : coords.top,
          bottom: isTop
            ? document.documentElement.clientHeight -
              coords.top +
              window.scrollY
            : undefined,
          left:
            isLeft || isBottomEnd || isTopEnd ? undefined : coords.left,
          right:
            isLeft
              ? document.documentElement.clientWidth - coords.left + 4
              : isBottomEnd || isTopEnd
                ? document.documentElement.clientWidth - coords.left
                : undefined,
          background: "var(--ds-background-100)",
          borderRadius: 12,
          boxShadow: "var(--ds-shadow-menu)",
          padding: 8,
          width: menuWidth || 200,
          minWidth: menuWidth || 200,
          zIndex: 2001,
          listStyle: "none",
          fontSize: 14,
          overflowY: "auto",
          overscrollBehavior: "contain",
          animation: "menu-enter 150ms ease-out",
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes menu-enter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// MenuButton (Trigger)
// ============================================================================

interface MenuButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: "primary" | "secondary";
  size?: "small" | "default";
  shape?: "square";
  chevron?: boolean;
  unstyled?: boolean;
  children: ReactNode;
}

export function MenuButton({
  variant = "primary",
  size = "default",
  shape,
  chevron,
  unstyled,
  children,
  className = "",
  ...props
}: MenuButtonProps) {
  const { isOpen, setIsOpen, triggerRef } = useMenuContext();

  if (unstyled) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className={`inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2 rounded-full ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        {...props}
      >
        {children}
      </button>
    );
  }

  const baseStyles = `
    inline-flex items-center justify-center select-none cursor-pointer border-none
    transition-[border-color,background,color,transform,box-shadow] duration-[var(--ds-transition-duration)] ease-[var(--ds-transition-timing)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2
    rounded-[var(--ds-radius-small)]
  `;

  const sizeStyles = (() => {
    if (shape === "square") {
      return size === "small"
        ? "h-[var(--ds-button-height-small)] w-[var(--ds-button-height-small)] text-button-12"
        : "h-[var(--ds-button-height-medium)] w-[var(--ds-button-height-medium)] text-button-14";
    }
    return size === "small"
      ? "h-[var(--ds-button-height-small)] px-[var(--ds-button-padding-small)] text-button-12 gap-[var(--ds-button-gap-small)]"
      : "h-[var(--ds-button-height-medium)] px-[var(--ds-button-padding-medium)] text-button-14 gap-[var(--ds-button-gap-medium)]";
  })();

  const variantStyles =
    variant === "secondary"
      ? `
        bg-[var(--ds-background-100)] text-[var(--ds-gray-1000)]
        shadow-[0_0_0_1px_var(--ds-gray-400)]
        hover:bg-[var(--ds-gray-100)] hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]
        dark:hover:bg-[var(--ds-gray-200)] dark:hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]
      `
      : `
        bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]
        hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),white_15%)]
        dark:hover:bg-[color-mix(in_srgb,var(--ds-gray-1000),black_15%)]
      `;

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      ref={triggerRef}
      type="button"
      className={combinedClasses}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      {...props}
    >
      {shape !== "square" && (
        <span className="content px-[var(--ds-button-content-padding)]">
          {children}
        </span>
      )}
      {shape === "square" && children}
      {chevron && (
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
      )}
    </button>
  );
}

// ============================================================================
// MenuItem
// ============================================================================

interface MenuItemProps {
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
  destructive?: boolean;
  href?: string;
  children: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /**
   * Fires when the pointer enters the item. Useful for warming caches
   * (image preloads, prefetch hints) before the user actually clicks.
   * The internal hover-background handler still runs.
   */
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  /**
   * Fires when keyboard focus reaches the item. Pair with
   * `onMouseEnter` to also cover keyboard-only users who arrow into
   * the item before activating it.
   */
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
}

export function MenuItem({
  onClick,
  disabled = false,
  locked = false,
  destructive = false,
  href,
  children,
  prefix,
  suffix,
  onMouseEnter,
  onFocus,
}: MenuItemProps) {
  const { setIsOpen } = useMenuContext();
  const isDisabled = disabled || locked;

  const handleClick = () => {
    if (isDisabled) return;
    onClick?.();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const lockIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color: "currentcolor", flexShrink: 0 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 5.5V4C10.5 2.61929 9.38071 1.5 8 1.5C6.61929 1.5 5.5 2.61929 5.5 4V5.5H10.5ZM4 5.5V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V5.5H13.25C13.6642 5.5 14 5.83579 14 6.25V15.25C14 15.6642 13.6642 16 13.25 16H2.75C2.33579 16 2 15.6642 2 15.25V6.25C2 5.83579 2.33579 5.5 2.75 5.5H4ZM3.5 7V14.5H12.5V7H3.5Z"
        fill="currentColor"
      />
    </svg>
  );

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 8px",
    height: 40,
    borderRadius: 6,
    fontSize: 14,
    color: destructive ? "var(--ds-red-900)" : "var(--ds-gray-1000)",
    cursor: isDisabled ? "default" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    textDecoration: "none",
    transition: "background 150ms ease",
    outline: "none",
    listStyle: "none",
  };

  const content = (
    <>
      {prefix && (
        <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {prefix}
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
      {locked && lockIcon}
      {suffix && !locked && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            color: "var(--ds-gray-900)",
          }}
        >
          {suffix}
        </span>
      )}
    </>
  );

  const hoverBg = destructive ? "var(--ds-red-100)" : "var(--ds-gray-alpha-100)";
  const activeBg = destructive ? "var(--ds-red-200)" : "var(--ds-gray-alpha-200)";

  const hoverHandlers = isDisabled
    ? {}
    : {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = hoverBg;
          onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = "transparent";
        },
        onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = activeBg;
        },
        onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = hoverBg;
        },
        onFocus,
      };

  if (href && !isDisabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        role="menuitem"
        style={itemStyle}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(false)}
        {...hoverHandlers}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      style={itemStyle}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...hoverHandlers}
    >
      {content}
    </button>
  );
}

// ============================================================================
// MenuSeparator
// ============================================================================

export function MenuSeparator() {
  return (
    <div
      role="separator"
      style={{
        height: 1,
        background: "var(--ds-gray-alpha-400)",
        margin: "4px 0",
      }}
    />
  );
}

// ============================================================================
// MenuSection
// ============================================================================

interface MenuSectionProps {
  /** Short Title Case header (1–2 words, e.g. "Workspace", "Recent Projects"). */
  title: string;
  children: ReactNode;
}

/**
 * Group related items under a small-caps Title Case header. Use when
 * a menu's item count starts to crowd past ~10 and items split into
 * natural buckets ("Workspace" / "Account", etc.).
 */
export function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div role="group" aria-label={title}>
      <div
        style={{
          padding: "8px 8px 4px",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--ds-gray-800)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
