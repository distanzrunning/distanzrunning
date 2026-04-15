"use client";

import React, { forwardRef, useState, useCallback } from "react";

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "default" | "large";
  label?: string;
  labelPosition?: "left" | "right";
  thumbIcon?: React.ReactNode;
  checkedColor?: string;
  uncheckedColor?: string;
  className?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      size = "default",
      label,
      labelPosition = "right",
      thumbIcon,
      checkedColor,
      uncheckedColor,
      className,
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        if (!isControlled) {
          setInternalChecked(newChecked);
        }
        onChange?.(newChecked);
      },
      [isControlled, onChange],
    );

    // Size config
    const trackWidth = size === "large" ? 48 : 40;
    const trackHeight = size === "large" ? 28 : 24;
    const thumbSize = size === "large" ? 24 : 20;
    const borderRadius = size === "large" ? 14 : 12;
    const thumbOffset = 2;
    const thumbTranslate = trackWidth - thumbSize - thumbOffset;

    // Colors
    const trackBg = isChecked
      ? checkedColor || "var(--ds-gray-1000)"
      : uncheckedColor || "var(--ds-gray-alpha-400)";

    // Visually hidden input styles
    const srOnlyStyle: React.CSSProperties = {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      borderWidth: 0,
    };

    const trackStyle: React.CSSProperties = {
      position: "relative",
      width: trackWidth,
      height: trackHeight,
      borderRadius,
      backgroundColor: trackBg,
      transition: "background-color 0.2s ease",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      flexShrink: 0,
    };

    const thumbStyle: React.CSSProperties = {
      position: "absolute",
      top: thumbOffset,
      left: thumbOffset,
      width: thumbSize,
      height: thumbSize,
      borderRadius: "50%",
      backgroundColor: "#fff",
      transform: isChecked ? `translateX(${thumbTranslate}px)` : "translateX(0)",
      transition: "transform 0.2s ease, background-color 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const labelStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    };

    const labelTextStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--ds-gray-1000)",
    };

    const toggle = (
      <span style={trackStyle}>
        <div style={thumbStyle}>
          {thumbIcon && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {thumbIcon}
            </span>
          )}
        </div>
      </span>
    );

    // labelPosition="right" means label text first, then toggle (Geist switchFirst)
    // labelPosition="left" means toggle first, then label text
    const content = label ? (
      labelPosition === "right" ? (
        <>
          <span style={labelTextStyle}>{label}</span>
          {toggle}
        </>
      ) : (
        <>
          {toggle}
          <span style={labelTextStyle}>{label}</span>
        </>
      )
    ) : (
      toggle
    );

    return (
      <label style={label ? labelStyle : { display: "inline-flex", cursor: disabled ? "not-allowed" : "pointer" }} className={className}>
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          style={srOnlyStyle}
        />
        {content}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
