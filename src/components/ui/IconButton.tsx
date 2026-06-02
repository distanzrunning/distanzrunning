import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element (typically an SVG or Lucide icon) */
  children: ReactNode;
  /** Visual style variant */
  variant?: "primary" | "secondary" | "tertiary";
  /** Use inverse colors for dark backgrounds */
  inverse?: boolean;
  /** Size variant - default (40px) or small (32px) */
  size?: "default" | "small";
  /** Skip automatic dark mode switching (used by design system docs) */
  ignoreDarkMode?: boolean;
  /** Accessible label for the button (required for icon-only buttons) */
  "aria-label": string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Icon-only button component with consistent design system styles.
 *
 * Icon buttons are square buttons that contain only an icon, typically used
 * for common actions like search, menu toggles, or closing dialogs.
 *
 * @example
 * // Primary icon button (default)
 * <IconButton aria-label="Search">
 *   <SearchIcon className="w-5 h-5" />
 * </IconButton>
 *
 * // Secondary icon button
 * <IconButton variant="secondary" aria-label="Close">
 *   <XIcon className="w-5 h-5" />
 * </IconButton>
 *
 * // Inverse for dark backgrounds
 * <IconButton inverse aria-label="Menu">
 *   <MenuIcon className="w-5 h-5" />
 * </IconButton>
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = "primary",
      inverse = false,
      size = "default",
      ignoreDarkMode = false,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Size classes - square buttons
    const sizeClasses = {
      default: "w-10 h-10", // 40px
      small: "w-8 h-8", // 32px
    };

    // Base classes (shared across all variants)
    const baseClasses = `
      inline-flex items-center justify-center
      ${sizeClasses[size]}
      rounded-md
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-ring)]
      active:scale-[0.98] active:duration-100
    `;

    const getVariantClasses = () => {
      if (disabled) {
        if (variant === "primary") {
          if (inverse) {
            return "bg-[var(--ds-gray-600)] text-[var(--ds-gray-300)] cursor-not-allowed";
          }
          return "bg-[var(--ds-gray-300)] text-textDisabled cursor-not-allowed";
        }
        if (variant === "secondary") {
          if (inverse) {
            return "bg-transparent border border-[var(--ds-gray-600)] text-[var(--ds-gray-500)] cursor-not-allowed";
          }
          return "bg-transparent border border-borderSubtle text-textDisabled cursor-not-allowed";
        }
        if (variant === "tertiary") {
          if (inverse) {
            return "bg-transparent text-[var(--ds-gray-500)] cursor-not-allowed";
          }
          return "bg-transparent text-textDisabled cursor-not-allowed";
        }
      }

      if (variant === "primary") {
        if (inverse) {
          return "bg-surface text-textDefault hover:bg-[var(--ds-gray-100)]";
        }
        if (ignoreDarkMode) {
          return "bg-[var(--ds-gray-200)] text-textDefault hover:bg-[var(--ds-gray-300)]";
        }
        return "bg-[var(--ds-gray-200)] dark:bg-[var(--ds-gray-1000)] text-textDefault dark:text-textInverted hover:bg-[var(--ds-gray-300)] dark:hover:bg-[var(--ds-gray-900)]";
      }

      if (variant === "secondary") {
        if (inverse) {
          return "bg-transparent border border-[rgb(var(--color-textInverted))] text-textInverted hover:bg-[var(--ds-gray-alpha-100)]";
        }
        if (ignoreDarkMode) {
          return "bg-transparent border border-borderDefaultHover text-textDefault hover:border-[var(--ds-gray-1000)] hover:bg-[var(--ds-gray-100)]";
        }
        return "bg-transparent border border-borderDefaultHover dark:border-[var(--ds-gray-600)] text-textDefault dark:text-[var(--ds-gray-200)] hover:border-[var(--ds-gray-1000)] dark:hover:border-[var(--ds-gray-400)] hover:bg-[var(--ds-gray-100)] dark:hover:bg-[var(--ds-gray-900)]/30";
      }

      if (variant === "tertiary") {
        if (inverse) {
          return "bg-transparent text-textInverted hover:bg-[var(--ds-gray-alpha-100)]";
        }
        if (ignoreDarkMode) {
          return "bg-transparent text-textSubtler hover:text-textDefault hover:bg-[var(--ds-gray-100)]";
        }
        return "bg-transparent text-textSubtler dark:text-[var(--ds-gray-600)] hover:text-textDefault dark:hover:text-[var(--ds-gray-200)] hover:bg-[var(--ds-gray-100)] dark:hover:bg-[var(--ds-gray-900)]/30";
      }

      return "";
    };

    const combinedClasses = `${baseClasses} ${getVariantClasses()} ${className}`
      .replace(/\s+/g, " ")
      .trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combinedClasses}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
