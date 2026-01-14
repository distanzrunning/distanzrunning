import { forwardRef, InputHTMLAttributes } from "react";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Whether the toggle is checked/on */
  checked?: boolean;
  /** Callback when toggle state changes */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Size variant */
  size?: "default" | "small";
  /** Use inverse colors for dark backgrounds */
  inverse?: boolean;
  /** Skip automatic dark mode switching (used by design system docs) */
  ignoreDarkMode?: boolean;
  /** Associated label text (for accessibility) */
  label?: string;
  /** Position of the label */
  labelPosition?: "left" | "right";
}

/**
 * Toggle/Switch component for binary on/off states.
 *
 * A polished switch control that follows the design system's premium aesthetic
 * with smooth transitions and proper accessibility support.
 *
 * @example
 * // Basic toggle
 * <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
 *
 * // With label
 * <Toggle label="Enable notifications" checked={enabled} onChange={handleChange} />
 *
 * // Small size
 * <Toggle size="small" checked={active} onChange={handleChange} />
 *
 * // Inverse for dark backgrounds
 * <Toggle inverse checked={on} onChange={handleChange} />
 */
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked = false,
      onChange,
      size = "default",
      inverse = false,
      ignoreDarkMode = false,
      label,
      labelPosition = "right",
      disabled,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    // Generate a unique ID if not provided
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    // Size dimensions
    const sizes = {
      default: {
        track: "w-11 h-6", // 44px x 24px
        thumb: "w-5 h-5", // 20px
        translate: "translate-x-5", // 20px
      },
      small: {
        track: "w-9 h-5", // 36px x 20px
        thumb: "w-4 h-4", // 16px
        translate: "translate-x-4", // 16px
      },
    };

    const currentSize = sizes[size];

    // Track colors based on state
    const getTrackClasses = () => {
      if (disabled) {
        if (inverse) {
          return checked
            ? "bg-asphalt-40"
            : "bg-asphalt-30";
        }
        if (ignoreDarkMode) {
          return checked
            ? "bg-asphalt-60"
            : "bg-asphalt-80";
        }
        return checked
          ? "bg-asphalt-60 dark:bg-asphalt-40"
          : "bg-asphalt-80 dark:bg-asphalt-30";
      }

      if (inverse) {
        return checked
          ? "bg-electric-pink hover:bg-electric-pink-45"
          : "bg-asphalt-40 hover:bg-asphalt-50";
      }

      if (ignoreDarkMode) {
        return checked
          ? "bg-electric-pink hover:bg-electric-pink-45"
          : "bg-asphalt-70 hover:bg-asphalt-60";
      }

      return checked
        ? "bg-electric-pink hover:bg-electric-pink-45"
        : "bg-asphalt-70 dark:bg-asphalt-40 hover:bg-asphalt-60 dark:hover:bg-asphalt-50";
    };

    // Thumb colors
    const getThumbClasses = () => {
      if (disabled) {
        if (inverse) {
          return "bg-asphalt-50";
        }
        if (ignoreDarkMode) {
          return "bg-asphalt-90";
        }
        return "bg-asphalt-90 dark:bg-asphalt-50";
      }

      if (inverse) {
        return "bg-white";
      }

      if (ignoreDarkMode) {
        return "bg-white";
      }

      return "bg-white dark:bg-asphalt-95";
    };

    // Label text color
    const getLabelClasses = () => {
      if (disabled) {
        if (inverse) {
          return "text-asphalt-50";
        }
        if (ignoreDarkMode) {
          return "text-asphalt-60";
        }
        return "text-asphalt-60 dark:text-asphalt-50";
      }

      if (inverse) {
        return "text-white";
      }

      if (ignoreDarkMode) {
        return "text-asphalt-20";
      }

      return "text-textDefault";
    };

    const toggleElement = (
      <label
        htmlFor={toggleId}
        className={`
          relative inline-flex items-center
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Hidden checkbox for accessibility */}
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />

        {/* Track */}
        <div
          className={`
            ${currentSize.track}
            ${getTrackClasses()}
            rounded-full
            transition-colors duration-200 ease-out
            peer-focus:ring-2 peer-focus:ring-borderNeutral peer-focus:ring-offset-2
            ${inverse ? "peer-focus:ring-offset-asphalt-10" : "peer-focus:ring-offset-white dark:peer-focus:ring-offset-asphalt-10"}
          `}
        >
          {/* Thumb */}
          <div
            className={`
              ${currentSize.thumb}
              ${getThumbClasses()}
              rounded-full
              shadow-sm
              transition-transform duration-200 ease-out
              absolute top-1/2 -translate-y-1/2
              ${checked ? currentSize.translate : "translate-x-0.5"}
            `}
          />
        </div>
      </label>
    );

    // If no label, just return the toggle
    if (!label) {
      return toggleElement;
    }

    // With label
    return (
      <div
        className={`
          inline-flex items-center gap-3
          ${className}
        `}
      >
        {labelPosition === "left" && (
          <span
            className={`
              text-sm font-medium
              ${getLabelClasses()}
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() => {
              if (!disabled) {
                const input = document.getElementById(toggleId) as HTMLInputElement;
                input?.click();
              }
            }}
          >
            {label}
          </span>
        )}

        {toggleElement}

        {labelPosition === "right" && (
          <span
            className={`
              text-sm font-medium
              ${getLabelClasses()}
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() => {
              if (!disabled) {
                const input = document.getElementById(toggleId) as HTMLInputElement;
                input?.click();
              }
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
