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

    // Geist sizes: default track 28x14, thumb 12x12; large track 40x20, thumb 16x16
    const trackWidth = size === "large" ? 40 : 28;
    const trackHeight = size === "large" ? 20 : 14;
    const thumbSize = size === "large" ? 16 : 12;
    const thumbTranslate = size === "large" ? 18 : 14;

    // Colors — Geist uses blue for checked, light gray for unchecked
    const trackBg = isChecked
      ? checkedColor || "rgb(0, 112, 243)"
      : uncheckedColor || "rgb(235, 235, 235)";

    // Visually hidden input styles
    const srOnlyStyle: React.CSSProperties = {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      clipPath: "inset(100%)",
      whiteSpace: "nowrap",
      borderWidth: 0,
    };

    const trackStyle: React.CSSProperties = {
      position: "relative",
      display: "block",
      width: trackWidth,
      height: trackHeight,
      borderRadius: trackHeight,
      backgroundColor: trackBg,
      border: "1px solid rgba(0, 0, 0, 0.1)",
      boxSizing: "border-box",
      transition: "background 0.15s cubic-bezier(0, 0, 0.2, 1), border-color 0.15s cubic-bezier(0, 0, 0.2, 1)",
      cursor: disabled ? "not-allowed" : "pointer",
      flexShrink: 0,
    };

    const thumbStyle: React.CSSProperties = {
      position: "absolute",
      top: trackHeight / 2,
      left: 0,
      width: thumbSize,
      height: thumbSize,
      borderRadius: "50%",
      backgroundColor: isChecked ? "#fff" : "rgb(250, 250, 250)",
      border: "1px solid rgba(0, 0, 0, 0)",
      boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px",
      transform: isChecked
        ? `translateX(${thumbTranslate}px) translateY(-${thumbSize / 2}px)`
        : `translateX(0px) translateY(-${thumbSize / 2}px)`,
      transition: "transform 0.15s cubic-bezier(0, 0, 0.2, 1), background 0.15s cubic-bezier(0, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const labelWrapperStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      cursor: "default",
      position: "relative",
      padding: "3px 0",
      fontSize: 12,
      fontWeight: 500,
      color: "rgb(102, 102, 102)",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
      userSelect: "none",
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
      <label style={labelWrapperStyle} className={className} aria-label={!label ? "Enable Firewall" : undefined}>
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
