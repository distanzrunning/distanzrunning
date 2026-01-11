import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element (typically an SVG or Lucide icon) */
  children: ReactNode;
  /** Visual style variant */
  variant?: "primary" | "secondary";
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
      focus:outline-none focus:ring-2 focus:ring-borderNeutral
      active:scale-[0.98] active:duration-100
    `;

    // Variant + inverse color combinations
    // When ignoreDarkMode is true, no dark: modifiers are used (for design system docs)
    // When ignoreDarkMode is false, dark: modifiers enable automatic theme switching
    const getVariantClasses = () => {
      if (disabled) {
        // Disabled state: subtle, recessive styling for premium feel
        if (variant === "primary") {
          return "bg-asphalt-90 dark:bg-asphalt-20 text-asphalt-50 cursor-not-allowed";
        }
        if (variant === "secondary") {
          return "bg-transparent text-asphalt-50 cursor-not-allowed";
        }
      }

      if (variant === "primary") {
        if (inverse) {
          // Inverse primary: dark button for light backgrounds
          return "bg-asphalt-10 text-white hover:bg-asphalt-20";
        }
        // Primary: light button in light mode, dark button in dark mode
        if (ignoreDarkMode) {
          return "bg-asphalt-95 text-asphalt-10 hover:bg-asphalt-90";
        }
        return "bg-asphalt-95 dark:bg-asphalt-10 text-asphalt-10 dark:text-white hover:bg-asphalt-90 dark:hover:bg-asphalt-20";
      }

      if (variant === "secondary") {
        if (inverse) {
          // Inverse secondary: dark icon for light backgrounds
          return "bg-transparent border border-asphalt-10 text-asphalt-10 hover:bg-asphalt-10/10";
        }
        // Secondary: visible in both light and dark modes
        if (ignoreDarkMode) {
          return "bg-transparent text-asphalt-10 hover:bg-asphalt-95/50";
        }
        return "bg-transparent text-asphalt-10 dark:text-asphalt-95 hover:bg-asphalt-95/50 dark:hover:bg-asphalt-20/30";
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
