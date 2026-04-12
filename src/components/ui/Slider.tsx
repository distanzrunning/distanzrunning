"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";

// ============================================================================
// Types
// ============================================================================

interface SliderBaseProps {
  min?: number;
  max?: number;
  step?: number;
  /** Fill color — accepts any CSS color or design token variable */
  color?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  /** Width of the slider in pixels */
  width?: number;
}

interface SingleSliderProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

interface RangeSliderProps extends SliderBaseProps {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Allow thumbs to cross over each other */
  allowCrossover?: boolean;
}

type SliderProps = SingleSliderProps | RangeSliderProps;

// ============================================================================
// Shared CSS for thumbs (rendered inline with component)
// ============================================================================

const SLIDER_CSS = `
  .ds-slider-input {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
  }
  .ds-slider-input::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 6px;
    height: 14px;
    border-radius: 1px;
    background: var(--ds-background-100);
    border: none;
    box-shadow: rgba(0, 0, 0, 0.21) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
    cursor: pointer;
    transition: box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
    position: relative;
    z-index: 2;
  }
  .ds-slider-input::-webkit-slider-thumb:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
  }
  .ds-slider-input::-moz-range-thumb {
    width: 6px;
    height: 14px;
    border-radius: 1px;
    background: var(--ds-background-100);
    border: none;
    box-shadow: rgba(0, 0, 0, 0.21) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
    cursor: pointer;
    transition: box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
    position: relative;
    z-index: 2;
  }
  .ds-slider-input::-moz-range-thumb:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
  }
  .ds-slider-input::-moz-range-track {
    background: transparent;
    border: none;
    height: 8px;
  }
  .ds-slider-input::-webkit-slider-runnable-track {
    height: 8px;
  }
`;

function SliderStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SLIDER_CSS }} />;
}

// ============================================================================
// Single Slider (original behavior)
// ============================================================================

const SingleSlider = forwardRef<HTMLInputElement, SingleSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      color = "var(--ds-blue-700)",
      disabled = false,
      className = "",
      name,
      width = 216,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;


    useEffect(() => {
      if (isControlled) setInternalValue(controlledValue);
    }, [isControlled, controlledValue]);

    const fillPercent =
      max !== min ? ((currentValue - min) / (max - min)) * 100 : 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    return (
      <div
        className={className}
        style={{
          position: "relative",
          width,
          height: 20,
        }}
      >
        <SliderStyles />
        {/* Visual track */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: 0,
            right: 0,
            height: 8,
            borderRadius: 5,
            background: `linear-gradient(to right, ${color} 0%, ${color} ${fillPercent}%, var(--ds-gray-400) ${fillPercent}%, var(--ds-gray-400) 100%)`,
            pointerEvents: "none",
          }}
        />
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
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            width,
            minWidth: width,
            height: 8,
            outline: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            background: "transparent",
            margin: 0,
            padding: 0,
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
          className="ds-slider-input"
        />
      </div>
    );
  },
);

SingleSlider.displayName = "SingleSlider";

// ============================================================================
// Range Slider (two thumbs, overlaid inputs)
// ============================================================================

const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = [25, 75],
      min = 0,
      max = 100,
      step = 1,
      onChange,
      color = "var(--ds-blue-700)",
      disabled = false,
      className = "",
      name,
      width = 216,
      allowCrossover = true,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    // Track which thumb is being dragged to handle crossover
    const activeThumbRef = useRef<"min" | "max" | null>(null);


    useEffect(() => {
      if (isControlled) setInternalValue(controlledValue);
    }, [isControlled, controlledValue]);

    // For visual track, always use sorted values
    const lowValue = Math.min(currentValue[0], currentValue[1]);
    const highValue = Math.max(currentValue[0], currentValue[1]);

    const lowPercent =
      max !== min ? ((lowValue - min) / (max - min)) * 100 : 0;
    const highPercent =
      max !== min ? ((highValue - min) / (max - min)) * 100 : 0;

    const handleFirstChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(e.target.value);
        let newValues: [number, number];

        if (allowCrossover) {
          // True crossover — value[0] can exceed value[1]
          newValues = [raw, currentValue[1]];
        } else {
          const clamped = Math.min(raw, currentValue[1]);
          newValues = [clamped, currentValue[1]];
        }

        if (!isControlled) setInternalValue(newValues);
        onChange?.(newValues);
      },
      [isControlled, currentValue, onChange, allowCrossover],
    );

    const handleSecondChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(e.target.value);
        let newValues: [number, number];

        if (allowCrossover) {
          newValues = [currentValue[0], raw];
        } else {
          const clamped = Math.max(raw, currentValue[0]);
          newValues = [currentValue[0], clamped];
        }

        if (!isControlled) setInternalValue(newValues);
        onChange?.(newValues);
      },
      [isControlled, currentValue, onChange, allowCrossover],
    );

    const trackBackground = `linear-gradient(to right, var(--ds-gray-400) 0%, var(--ds-gray-400) ${lowPercent}%, ${color} ${lowPercent}%, ${color} ${highPercent}%, var(--ds-gray-400) ${highPercent}%, var(--ds-gray-400) 100%)`;

    const inputBaseStyle: React.CSSProperties = {
      WebkitAppearance: "none",
      MozAppearance: "none",
      appearance: "none",
      width,
      minWidth: width,
      height: 8,
      borderRadius: 5,
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      margin: 0,
      padding: 0,
      position: "absolute",
      top: "50%",
      left: 0,
      transform: "translateY(-50%)",
      background: "transparent",
      pointerEvents: "none",
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "relative",
          width,
          height: 20,
        }}
      >
        <SliderStyles />
        {/* Visual track background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: 0,
            right: 0,
            height: 8,
            borderRadius: 5,
            background: trackBackground,
            pointerEvents: "none",
          }}
        />

        {/* First thumb input (value[0]) */}
        <input
          type="range"
          name={name ? `${name}-min` : undefined}
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={handleFirstChange}
          onPointerDown={() => { activeThumbRef.current = "min"; }}
          onPointerUp={() => { activeThumbRef.current = null; }}
          disabled={disabled}
          aria-label="First value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue[0]}
          style={{
            ...inputBaseStyle,
            pointerEvents: "auto",
            zIndex: activeThumbRef.current === "min" ? 5 : 3,
          }}
          className="ds-slider-input"
        />

        {/* Second thumb input (value[1]) */}
        <input
          type="range"
          name={name ? `${name}-max` : undefined}
          min={min}
          max={max}
          step={step}
          value={currentValue[1]}
          onChange={handleSecondChange}
          onPointerDown={() => { activeThumbRef.current = "max"; }}
          onPointerUp={() => { activeThumbRef.current = null; }}
          disabled={disabled}
          aria-label="Second value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue[1]}
          style={{
            ...inputBaseStyle,
            pointerEvents: "auto",
            zIndex: activeThumbRef.current === "max" ? 5 : 4,
          }}
          className="ds-slider-input"
        />
      </div>
    );
  },
);

RangeSlider.displayName = "RangeSlider";

// ============================================================================
// Unified Slider export
// ============================================================================

const Slider = forwardRef<HTMLInputElement | HTMLDivElement, SliderProps>(
  (props, ref) => {
    if (props.range) {
      return <RangeSlider ref={ref as React.Ref<HTMLDivElement>} {...props} />;
    }
    return <SingleSlider ref={ref as React.Ref<HTMLInputElement>} {...props} />;
  },
);

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps, SingleSliderProps, RangeSliderProps };
