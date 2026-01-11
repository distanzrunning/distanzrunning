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
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98] active:duration-100
    `;

    // Variant + inverse color combinations
    // Note: No dark: modifiers - the inverse prop controls light/dark appearance
    const getVariantClasses = () => {
      if (variant === "primary") {
        if (inverse) {
          // Inverse primary: light button for dark backgrounds
          return "bg-white text-asphalt-10 hover:bg-asphalt-95";
        }
        // Primary: dark button for light backgrounds
        return "bg-asphalt-10 text-white hover:bg-asphalt-20";
      }

      if (variant === "secondary") {
        if (inverse) {
          // Inverse secondary: light border/text for dark backgrounds
          return "bg-transparent border border-white text-white hover:bg-white/10";
        }
        // Secondary: dark border/text for light backgrounds
        return "bg-transparent border border-asphalt-70 text-asphalt-10 hover:border-asphalt-40 hover:bg-asphalt-95/50";
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
