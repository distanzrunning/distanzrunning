"use client";

import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
} from "react";

// ============================================================================
// RadioGroup Context
// ============================================================================

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}

// ============================================================================
// RadioGroup
// ============================================================================

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

function RadioGroupRoot({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  disabled = false,
  required = false,
  className = "",
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value: currentValue,
        onChange: handleChange,
        disabled,
        required,
      }}
    >
      <div role="radiogroup" className={`flex flex-col gap-3 ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// ============================================================================
// RadioGroupItem
// ============================================================================

export interface RadioGroupItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function RadioGroupItem({ value, children, disabled: itemDisabled }: RadioGroupItemProps) {
  const context = useRadioGroupContext();
  const autoId = useId();

  if (!context) {
    throw new Error("RadioGroup.Item must be used within a RadioGroup");
  }

  const { name, value: groupValue, onChange, disabled: groupDisabled, required } = context;
  const isDisabled = itemDisabled || groupDisabled;
  const isChecked = groupValue === value;
  const inputId = `radio-${autoId}-${value}`;

  return (
    <label
      htmlFor={inputId}
      className={`
        group/radio inline-flex items-center gap-3
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span className="relative inline-flex items-center justify-center">
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onChange(value)}
          disabled={isDisabled}
          required={required}
          className="sr-only peer"
        />
        <span
          aria-hidden="true"
          className={`
            relative flex items-center justify-center
            w-4 h-4 rounded-full border border-solid
            ${
              isDisabled
                ? isChecked
                  ? "border-[var(--ds-gray-600)] bg-[var(--ds-gray-100)]"
                  : "border-[var(--ds-gray-400)] bg-[var(--ds-gray-100)]"
                : isChecked
                  ? "border-[var(--ds-gray-1000)] bg-[var(--ds-background-100)]"
                  : "border-[var(--ds-gray-alpha-400)] bg-[var(--ds-background-100)] group-hover/radio:bg-[var(--ds-gray-200)]"
            }
            ${!isDisabled ? "peer-focus-visible:shadow-[0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)]" : ""}
          `}
          style={{
            transition:
              "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {isChecked && (
            <span
              className="block w-2 h-2 rounded-full"
              style={{
                backgroundColor: isDisabled
                  ? "var(--ds-gray-600)"
                  : "var(--ds-gray-1000)",
              }}
            />
          )}
        </span>
      </span>
      <span
        className={`text-sm select-none ${
          isDisabled ? "text-[var(--ds-gray-500)]" : "text-[var(--ds-gray-1000)]"
        }`}
      >
        {children}
      </span>
    </label>
  );
}

// ============================================================================
// Standalone Radio
// ============================================================================

export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  value?: string;
  name?: string;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked,
      onChange,
      disabled = false,
      value,
      name,
      className = "",
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      defaultChecked ?? false
    );

    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setUncontrolledChecked(e.target.checked);
        }
        onChange?.(e.target.checked);
      },
      [isControlled, onChange]
    );

    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <span
          aria-hidden="true"
          className={`
            relative flex items-center justify-center
            w-4 h-4 rounded-full border border-solid cursor-pointer
            ${
              disabled
                ? isChecked
                  ? "border-[var(--ds-gray-600)] bg-[var(--ds-gray-100)] cursor-not-allowed"
                  : "border-[var(--ds-gray-400)] bg-[var(--ds-gray-100)] cursor-not-allowed"
                : isChecked
                  ? "border-[var(--ds-gray-1000)] bg-[var(--ds-background-100)]"
                  : "border-[var(--ds-gray-alpha-400)] bg-[var(--ds-background-100)] hover:bg-[var(--ds-gray-200)]"
            }
            ${!disabled ? "peer-focus-visible:shadow-[0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)]" : ""}
          `}
          style={{
            transition:
              "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {isChecked && (
            <span
              className="block w-2 h-2 rounded-full"
              style={{
                backgroundColor: disabled
                  ? "var(--ds-gray-600)"
                  : "var(--ds-gray-1000)",
              }}
            />
          )}
        </span>
      </span>
    );
  }
);

Radio.displayName = "Radio";

// ============================================================================
// RadioGroup compound component
// ============================================================================

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});

export default RadioGroup;
