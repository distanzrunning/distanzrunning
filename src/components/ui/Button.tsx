import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: "primary" | "secondary";
  /** Use inverse colors for dark backgrounds */
  inverse?: boolean;
  /** Size variant - default (h-12, px-5) or slim (h-9, px-4) */
  size?: "default" | "slim";
  /** Skip automatic dark mode switching (used by design system docs) */
  ignoreDarkMode?: boolean;
  /** Additional CSS classes for custom sizing/layout */
  className?: string;
}

/**
 * Shared Button component with consistent design system styles.
 *
 * Styling is fixed (colors, border radius, font, focus ring) but dimensions
 * can be customized via the `size` prop or `className` overrides.
 *
 * @example
 * // Primary button (default)
 * <Button>Subscribe</Button>
 *
 * // Secondary button
 * <Button variant="secondary">Cancel</Button>
 *
 * // Inverse for dark backgrounds
 * <Button inverse>Learn More</Button>
 *
 * // Slim variant
 * <Button size="slim">Sign In</Button>
 *
 * // Custom dimensions via className
 * <Button className="h-14 px-8">Large Button</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
    // Size classes
    const sizeClasses = {
      default: "h-12 px-5",
      slim: "h-9 px-4",
    };

    // Base classes (shared across all variants)
    const baseClasses = `
      inline-flex items-center justify-center
      ${sizeClasses[size]}
      rounded-md
      font-sans font-semibold text-sm
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
        // Inverse disabled should match the opposite theme's primary disabled
        if (variant === "primary") {
          if (inverse) {
            // Inverse disabled: dark grey for dark backgrounds (no dark mode switch)
            return "bg-asphalt-20 text-asphalt-50 cursor-not-allowed";
          }
          // Primary disabled: light grey in light mode, dark grey in dark mode
          return "bg-asphalt-90 dark:bg-asphalt-20 text-asphalt-60 dark:text-asphalt-50 cursor-not-allowed";
        }
        if (variant === "secondary") {
          if (inverse) {
            // Inverse secondary disabled: light border for dark backgrounds (no dark mode switch)
            return "bg-transparent border border-asphalt-30 text-asphalt-50 cursor-not-allowed";
          }
          // Secondary disabled: visible border in both modes
          return "bg-transparent border border-asphalt-80 dark:border-asphalt-30 text-asphalt-60 dark:text-asphalt-50 cursor-not-allowed";
        }
      }

      if (variant === "primary") {
        if (inverse) {
          // Inverse primary: light button for dark backgrounds (no dark mode switch)
          return "bg-white text-asphalt-10 hover:bg-asphalt-95";
        }
        // Primary: dark button in light mode, light button in dark mode
        if (ignoreDarkMode) {
          return "bg-asphalt-10 text-white hover:bg-asphalt-20";
        }
        return "bg-asphalt-10 dark:bg-asphalt-95 text-white dark:text-asphalt-10 hover:bg-asphalt-20 dark:hover:bg-asphalt-90";
      }

      if (variant === "secondary") {
        if (inverse) {
          // Inverse secondary: light border/text for dark backgrounds (no dark mode switch)
          return "bg-transparent border border-white text-white hover:bg-white/10";
        }
        // Secondary: visible border in both light and dark modes
        if (ignoreDarkMode) {
          return "bg-transparent border border-asphalt-70 text-asphalt-10 hover:border-asphalt-40 hover:bg-asphalt-95/50";
        }
        return "bg-transparent border border-asphalt-70 dark:border-asphalt-40 text-asphalt-10 dark:text-asphalt-95 hover:border-asphalt-40 dark:hover:border-asphalt-60 hover:bg-asphalt-95/50 dark:hover:bg-asphalt-20/30";
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

Button.displayName = "Button";

export default Button;
