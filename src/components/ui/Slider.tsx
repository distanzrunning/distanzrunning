"use client";

import React, { forwardRef, useState, useCallback, useEffect } from "react";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      className = "",
      name,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    // Sync internal value when controlled value changes
    useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [isControlled, controlledValue]);

    const fillPercent =
      max !== min ? ((currentValue - min) / (max - min)) * 100 : 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange]
    );

    return (
      <form
        className={className}
        onSubmit={(e) => e.preventDefault()}
        style={{ width: "100%" }}
      >
        <input
          ref={ref}
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          style={
            {
              "--slider-fill": `${fillPercent}%`,
            } as React.CSSProperties
          }
          className="slider-input"
        />
        <style jsx>{`
          .slider-input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 5px;
            outline: none;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            opacity: ${disabled ? 0.5 : 1};
            background: linear-gradient(
              to right,
              var(--ds-blue-700) 0%,
              var(--ds-blue-700) var(--slider-fill),
              var(--ds-gray-400) var(--slider-fill),
              var(--ds-gray-400) 100%
            );
            margin: 0;
            padding: 0;
          }

          .slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background: var(--ds-background-100);
            border: none;
            box-shadow: rgba(0, 0, 0, 0.21) 0px 0px 0px 1px,
              rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            transition: box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
          }

          .slider-input::-webkit-slider-thumb:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 0px 1px,
              rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
          }

          .slider-input::-moz-range-thumb {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background: var(--ds-background-100);
            border: none;
            box-shadow: rgba(0, 0, 0, 0.21) 0px 0px 0px 1px,
              rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            transition: box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
          }

          .slider-input::-moz-range-thumb:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 0px 1px,
              rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
          }

          .slider-input::-moz-range-track {
            background: transparent;
            border: none;
            height: 8px;
          }
        `}</style>
      </form>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
