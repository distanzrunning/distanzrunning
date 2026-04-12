"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";

// ============================================================================
// Types
// ============================================================================

interface SliderBaseProps {
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
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
  allowCrossover?: boolean;
}

type SliderProps = SingleSliderProps | RangeSliderProps;

// ============================================================================
// Helpers
// ============================================================================

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function snapToStep(val: number, min: number, step: number) {
  return Math.round((val - min) / step) * step + min;
}

function getPercentFromEvent(
  e: React.PointerEvent | PointerEvent,
  trackEl: HTMLElement,
) {
  const rect = trackEl.getBoundingClientRect();
  return clamp((e.clientX - rect.left) / rect.width, 0, 1);
}

// ============================================================================
// Single Slider
// ============================================================================

const SingleSlider = forwardRef<HTMLDivElement, SingleSliderProps>(
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
    const trackRef = useRef<HTMLSpanElement>(null);
    const dragging = useRef(false);

    useEffect(() => {
      if (isControlled) setInternalValue(controlledValue);
    }, [isControlled, controlledValue]);

    const percent = max !== min ? ((currentValue - min) / (max - min)) * 100 : 0;

    const updateValue = useCallback(
      (newVal: number) => {
        const snapped = snapToStep(clamp(newVal, min, max), min, step);
        if (!isControlled) setInternalValue(snapped);
        onChange?.(snapped);
      },
      [isControlled, min, max, step, onChange],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !trackRef.current) return;
        e.preventDefault();
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const pct = getPercentFromEvent(e, trackRef.current);
        updateValue(min + pct * (max - min));
      },
      [disabled, min, max, updateValue],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragging.current || !trackRef.current) return;
        const pct = getPercentFromEvent(e, trackRef.current);
        updateValue(min + pct * (max - min));
      },
      [min, max, updateValue],
    );

    const handlePointerUp = useCallback(() => {
      dragging.current = false;
    }, []);

    return (
      <div ref={ref} className={className} style={{ width, minWidth: width }}>
        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={currentValue} />

        {/* Slider root */}
        <span
          ref={trackRef}
          role="group"
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: 8,
            touchAction: "none",
            userSelect: "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Track */}
          <span
            style={{
              display: "block",
              flexGrow: 1,
              height: 8,
              borderRadius: 5,
              background: "var(--ds-gray-400)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Range fill */}
            <span
              style={{
                display: "block",
                position: "absolute",
                height: "100%",
                left: 0,
                width: `${percent}%`,
                background: color,
                borderRadius: "9999px 0 0 9999px",
              }}
            />
          </span>

          {/* Thumb */}
          <span
            style={{
              position: "absolute",
              left: `calc(${percent}% + 0px)`,
              transform: "translateX(-50%)",
            }}
          >
            <span
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue}
              aria-orientation="horizontal"
              style={{
                display: "block",
                width: 6,
                height: 14,
                borderRadius: 1,
                background: "var(--ds-background-100)",
                boxShadow:
                  "rgba(0, 0, 0, 0.21) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease",
                position: "relative",
              }}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  updateValue(currentValue + step);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  updateValue(currentValue - step);
                }
              }}
            />
          </span>
        </span>
      </div>
    );
  },
);

SingleSlider.displayName = "SingleSlider";

// ============================================================================
// Range Slider
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
    const trackRef = useRef<HTMLSpanElement>(null);
    const activeThumb = useRef<0 | 1 | null>(null);

    useEffect(() => {
      if (isControlled) setInternalValue(controlledValue);
    }, [isControlled, controlledValue]);

    const lowValue = Math.min(currentValue[0], currentValue[1]);
    const highValue = Math.max(currentValue[0], currentValue[1]);
    const lowPercent = max !== min ? ((lowValue - min) / (max - min)) * 100 : 0;
    const highPercent = max !== min ? ((highValue - min) / (max - min)) * 100 : 0;

    const pct0 = max !== min ? ((currentValue[0] - min) / (max - min)) * 100 : 0;
    const pct1 = max !== min ? ((currentValue[1] - min) / (max - min)) * 100 : 0;

    const updateValues = useCallback(
      (newVals: [number, number]) => {
        const snapped: [number, number] = [
          snapToStep(clamp(newVals[0], min, max), min, step),
          snapToStep(clamp(newVals[1], min, max), min, step),
        ];
        if (!isControlled) setInternalValue(snapped);
        onChange?.(snapped);
      },
      [isControlled, min, max, step, onChange],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !trackRef.current) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const pct = getPercentFromEvent(e, trackRef.current);
        const rawVal = min + pct * (max - min);

        // Determine which thumb is closer
        const dist0 = Math.abs(currentValue[0] - rawVal);
        const dist1 = Math.abs(currentValue[1] - rawVal);
        const thumb = dist0 <= dist1 ? 0 : 1;
        activeThumb.current = thumb;

        const newVals: [number, number] = [...currentValue];
        newVals[thumb] = rawVal;
        updateValues(newVals);
      },
      [disabled, min, max, currentValue, updateValues],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (activeThumb.current === null || !trackRef.current) return;
        const pct = getPercentFromEvent(e, trackRef.current);
        const rawVal = min + pct * (max - min);
        const newVals: [number, number] = [...currentValue];
        newVals[activeThumb.current] = rawVal;
        updateValues(newVals);
      },
      [min, max, currentValue, updateValues],
    );

    const handlePointerUp = useCallback(() => {
      activeThumb.current = null;
    }, []);

    const handleThumbKeyDown = useCallback(
      (thumbIndex: 0 | 1, e: React.KeyboardEvent) => {
        if (disabled) return;
        const delta =
          e.key === "ArrowRight" || e.key === "ArrowUp"
            ? step
            : e.key === "ArrowLeft" || e.key === "ArrowDown"
              ? -step
              : 0;
        if (delta === 0) return;
        e.preventDefault();
        const newVals: [number, number] = [...currentValue];
        newVals[thumbIndex] = currentValue[thumbIndex] + delta;
        updateValues(newVals);
      },
      [disabled, step, currentValue, updateValues],
    );

    return (
      <div ref={ref} className={className} style={{ width, minWidth: width }}>
        <input type="hidden" name={name ? `${name}-min` : undefined} value={lowValue} />
        <input type="hidden" name={name ? `${name}-max` : undefined} value={highValue} />

        <span
          ref={trackRef}
          role="group"
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: 8,
            touchAction: "none",
            userSelect: "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Track */}
          <span
            style={{
              display: "block",
              flexGrow: 1,
              height: 8,
              borderRadius: 5,
              background: "var(--ds-gray-400)",
              position: "relative",
            }}
          >
            {/* Range fill */}
            <span
              style={{
                display: "block",
                position: "absolute",
                height: "100%",
                left: `${lowPercent}%`,
                right: `${100 - highPercent}%`,
                background: color,
              }}
            />
          </span>

          {/* Thumb 0 */}
          <span
            style={{
              position: "absolute",
              left: `calc(${pct0}%)`,
              transform: "translateX(-50%)",
              zIndex: activeThumb.current === 0 ? 5 : 3,
            }}
          >
            <span
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue[0]}
              aria-orientation="horizontal"
              style={{
                display: "block",
                width: 6,
                height: 14,
                borderRadius: 1,
                background: "var(--ds-background-100)",
                boxShadow:
                  "rgba(0, 0, 0, 0.21) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease",
                position: "relative",
              }}
              onKeyDown={(e) => handleThumbKeyDown(0, e)}
            />
          </span>

          {/* Thumb 1 */}
          <span
            style={{
              position: "absolute",
              left: `calc(${pct1}%)`,
              transform: "translateX(-50%)",
              zIndex: activeThumb.current === 1 ? 5 : 4,
            }}
          >
            <span
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue[1]}
              aria-orientation="horizontal"
              style={{
                display: "block",
                width: 6,
                height: 14,
                borderRadius: 1,
                background: "var(--ds-background-100)",
                boxShadow:
                  "rgba(0, 0, 0, 0.21) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease",
                position: "relative",
              }}
              onKeyDown={(e) => handleThumbKeyDown(1, e)}
            />
          </span>
        </span>
      </div>
    );
  },
);

RangeSlider.displayName = "RangeSlider";

// ============================================================================
// Unified Slider export
// ============================================================================

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (props, ref) => {
    if (props.range) {
      return <RangeSlider ref={ref} {...props} />;
    }
    return <SingleSlider ref={ref} {...props} />;
  },
);

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps, SingleSliderProps, RangeSliderProps };
