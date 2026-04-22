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
  | "bottom-end";

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
  menuWidth?: number;
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
}

export function Menu({ children, position = "bottom-start", width }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemCountRef = useRef(0);

  // Reset item count on each render cycle
  itemCountRef.current = 0;

  const registerItem = useCallback(() => {
    return itemCountRef.current++;
  }, []);

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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reset active index when menu opens/closes
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const positionStyles: React.CSSProperties = (() => {
    switch (position) {
      case "bottom-start":
        return { top: "100%", left: 0, marginTop: 4 };
      case "bottom-end":
        return { top: "100%", right: 0, marginTop: 4 };
      case "left-start":
        return { right: "100%", top: 0, marginRight: 4 };
      case "left-end":
        return { right: "100%", bottom: 0, marginRight: 4 };
      case "right-start":
        return { left: "100%", top: 0, marginLeft: 4 };
      case "right-end":
        return { left: "100%", bottom: 0, marginLeft: 4 };
      default:
        return { top: "100%", left: 0, marginTop: 4 };
    }
  })();

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
              positionStyles={positionStyles}
              menuWidth={width}
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
  positionStyles,
  menuWidth,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  position: MenuPosition;
  menuWidth?: number;
  positionStyles: React.CSSProperties;
  children: ReactNode;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    if (position.startsWith("bottom")) {
      top = rect.bottom + scrollY + 4;
      left = position === "bottom-end" ? rect.right + scrollX : rect.left + scrollX;
    } else if (position.startsWith("left")) {
      // For left positions, we store the right edge of viewport minus button's left edge
      // This will be used as CSS `right` to position dropdown to the left of the button
      left = rect.left + scrollX;
      top = position === "left-end" ? rect.bottom + scrollY : rect.top + scrollY;
    } else if (position.startsWith("right")) {
      left = rect.right + scrollX + 4;
      top = position === "right-end" ? rect.bottom + scrollY : rect.top + scrollY;
    }

    setCoords({ top, left });
  }, [containerRef, position]);

  return (
    <>
      <div
        ref={dropdownRef}
        role="menu"
        style={{
          position: "absolute",
          top: coords.top,
          left: position.startsWith("left") || position === "bottom-end" ? undefined : coords.left,
          right: position.startsWith("left")
            ? document.documentElement.clientWidth - coords.left + 4
            : position === "bottom-end"
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
  const { isOpen, setIsOpen } = useMenuContext();

  if (unstyled) {
    return (
      <button
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
