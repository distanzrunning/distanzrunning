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
  "aria-label"?: string;
  "aria-labelledby"?: string;
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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
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
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`flex flex-col gap-6 ${className}`}
      >
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
      className={`inline-flex items-center text-copy-13 ${
        isDisabled ? "cursor-not-allowed text-textDisabled" : "cursor-pointer text-textDefault"
      }`}
    >
      <span className="ds-radio-box -m-0.5 flex items-center p-0.5">
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onChange(value)}
          disabled={isDisabled}
          required={required}
          className="ds-radio-input sr-only"
        />
        <span aria-hidden="true" className="ds-radio-control" />
      </span>
      <span className="ml-1.5 select-none">{children}</span>
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
  "aria-label"?: string;
  "aria-labelledby"?: string;
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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
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
        className={`ds-radio-box -m-0.5 flex items-center p-0.5 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${className}`.trim()}
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className="ds-radio-input sr-only"
        />
        <span aria-hidden="true" className="ds-radio-control" />
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
