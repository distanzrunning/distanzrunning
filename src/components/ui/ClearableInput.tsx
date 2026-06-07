"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Input } from "./Input";
import { Kbd } from "./Kbd";

export interface ClearableInputProps {
  /** Controlled value. */
  value?: string;
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Fired on every change with the next value. */
  onChange?: (value: string) => void;
  /** Fired after the value is cleared (Esc key or the clear button). */
  onClear?: () => void;
  placeholder?: string;
  /** Optional field label rendered above the input. */
  label?: string;
  disabled?: boolean;
  /**
   * Show a ⌘K command-menu hint while the field is empty; it swaps to the
   * Esc clear affordance once there's text.
   */
  cmdk?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * ClearableInput — a text input with an Esc-key clear affordance. Pressing
 * Escape (or clicking the Esc key hint) resets the value to empty and fires
 * `onClear`. With `cmdk`, an empty field shows a ⌘K hint instead.
 */
export const ClearableInput = forwardRef<HTMLInputElement, ClearableInputProps>(
  function ClearableInput(
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onClear,
      placeholder,
      label,
      disabled = false,
      cmdk = false,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement>(null);
    const inputRef =
      (ref as React.RefObject<HTMLInputElement> | null) ?? innerRef;

    const [internal, setInternal] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internal;
    const hasValue = value.length > 0;

    const setValue = useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const clear = useCallback(() => {
      if (disabled || !hasValue) return;
      setValue("");
      onClear?.();
      inputRef.current?.focus();
    }, [disabled, hasValue, setValue, onClear, inputRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && hasValue && !disabled) {
        e.preventDefault();
        clear();
      }
    };

    // Suffix: the Esc clear button once there's text (kept visible while
    // disabled so the affordance doesn't pop); the ⌘K hint when empty + cmdk.
    let suffix: ReactNode;
    if (hasValue) {
      suffix = (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear input"
          onClick={clear}
          disabled={disabled}
          className="flex items-center border-0 bg-transparent p-0 transition-colors duration-150 hover:text-[hsl(var(--color-textDefault))] disabled:cursor-not-allowed"
        >
          <Kbd size="small">Esc</Kbd>
        </button>
      );
    } else if (cmdk && !disabled) {
      // Geist renders ⌘ and K as two separate key boxes, not one combined.
      suffix = (
        <span className="flex items-center gap-1">
          <Kbd size="small" meta />
          <Kbd size="small">K</Kbd>
        </span>
      );
    }

    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        label={label}
        disabled={disabled}
        aria-label={ariaLabel}
        suffix={suffix}
        suffixStyling={false}
        className={className}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
      />
    );
  },
);

export default ClearableInput;
