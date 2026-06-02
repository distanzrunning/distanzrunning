"use client";

import React, { forwardRef, useState, useCallback, useEffect } from "react";

export interface ToggleProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Initial state for uncontrolled use */
  defaultChecked?: boolean;
  /** Callback when toggled */
  onChange?: (checked: boolean) => void;
  /** Disable interaction */
  disabled?: boolean;
  /** Track + thumb size */
  size?: "default" | "large";
  /**
   * Visible label — Title Case noun phrase, 1–4 words, naming what is
   * true when ON (`Password Protection`, not `Enable Password
   * Protection`). When omitted, supply `aria-label` or
   * `aria-labelledby` instead.
   */
  children?: React.ReactNode;
  /**
   * Optional one-sentence description rendered as a sibling under the
   * label. Should explain what ON does (don't describe OFF — it's the
   * negation).
   */
  description?: string;
  /** Render order — label first then toggle (default `right`) or toggle then label. */
  labelPosition?: "left" | "right";
  /**
   * `title` (default) applies `text-transform: capitalize` so labels
   * stay consistent across surfaces; `normal` leaves casing untouched
   * when sentence-case content sits inline next to the toggle.
   */
  labelCasing?: "title" | "normal";
  /** Optional icon rendered inside the thumb (e.g. lock / lightning). */
  thumbIcon?: React.ReactNode;
  /** Override the checked-state track color (defaults to `--ds-blue-700`). */
  checkedColor?: string;
  /** Override the unchecked-state track color (defaults to `--ds-gray-300`). */
  uncheckedColor?: string;
  /** Accessible name override when no visible label is present */
  "aria-label"?: string;
  /** Id of an external label element */
  "aria-labelledby"?: string;
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
      children,
      description,
      labelPosition = "right",
      labelCasing = "title",
      thumbIcon,
      checkedColor,
      uncheckedColor,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
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

    // Warn in development if no accessible name is provided. Mirrors
    // Geist's "warns in development if all three are missing" rule.
    useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (!children && !ariaLabel && !ariaLabelledBy) {
        // eslint-disable-next-line no-console
        console.warn(
          "[Toggle] Missing accessible name. Provide `children`, `aria-label`, or `aria-labelledby`.",
        );
      }
    }, [children, ariaLabel, ariaLabelledBy]);

    // Geist sizes: default track 28x14, thumb 12x12; large track 40x24, thumb 22x22
    const trackWidth = size === "large" ? 40 : 28;
    const trackHeight = size === "large" ? 24 : 14;
    const thumbSize = size === "large" ? 22 : 12;
    const thumbTranslate = size === "large" ? 16 : 14;

    let trackBg: string;
    let trackBorder: string;
    let thumbBg: string;
    let thumbShadow: string;

    if (disabled) {
      trackBg = isChecked ? "rgb(var(--color-textDisabled))" : "rgb(var(--color-borderSubtle))";
      trackBorder = isChecked ? "rgb(var(--color-textDisabled))" : "rgb(var(--color-borderSubtle))";
      // Knob stays light in both themes (like the Slider thumb) so it
      // always reads as the raised element above the track — disabled is
      // conveyed by the muted track, not by darkening the knob.
      thumbBg = "rgba(255, 255, 255, 0.6)";
      thumbShadow = "none";
    } else {
      trackBg = isChecked
        ? checkedColor || "var(--ds-blue-700)"
        : uncheckedColor || "rgb(var(--color-borderSubtle))";
      trackBorder = "var(--ds-gray-alpha-200)";
      thumbBg = "#FFFFFF"; // white knob in both themes — pops above any track
      thumbShadow =
        "rgba(0, 0, 0, 0.12) 0px 0px 4px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px";
    }

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
      border: `1px solid ${trackBorder}`,
      boxSizing: "border-box",
      transition:
        "background 0.15s cubic-bezier(0, 0, 0.2, 1), border-color 0.15s cubic-bezier(0, 0, 0.2, 1)",
      cursor: disabled ? "not-allowed" : "pointer",
      flexShrink: 0,
    };

    const thumbTop = size === "large" ? 11 : 6;
    const thumbStyle: React.CSSProperties = {
      position: "absolute",
      top: thumbTop,
      left: 0,
      width: thumbSize,
      height: thumbSize,
      borderRadius: "50%",
      backgroundColor: thumbBg,
      border: "1px solid rgba(0, 0, 0, 0)",
      boxShadow: thumbShadow,
      transform: isChecked
        ? `translateX(${thumbTranslate}px) translateY(-${thumbTop}px)`
        : `translateX(0px) translateY(-${thumbTop}px)`,
      transition:
        "transform 0.15s cubic-bezier(0, 0, 0.2, 1), background 0.15s cubic-bezier(0, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const labelWrapperStyle: React.CSSProperties = {
      display: "flex",
      alignItems: description ? "flex-start" : "center",
      gap: 12,
      cursor: "default",
      position: "relative",
      padding: "3px 0",
      whiteSpace: "nowrap",
      userSelect: "none",
    };

    const labelTextStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "rgb(var(--color-textDefault))",
      textTransform: labelCasing === "title" ? "capitalize" : "none",
    };

    const descriptionStyle: React.CSSProperties = {
      fontSize: 13,
      lineHeight: "18px",
      color: "rgb(var(--color-textSubtle))",
      marginTop: 2,
      whiteSpace: "normal",
      maxWidth: 360,
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

    const labelBlock = children ? (
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={labelTextStyle}>{children}</span>
        {description && <span style={descriptionStyle}>{description}</span>}
      </span>
    ) : null;

    const content = labelBlock ? (
      labelPosition === "right" ? (
        <>
          {labelBlock}
          {toggle}
        </>
      ) : (
        <>
          {toggle}
          {labelBlock}
        </>
      )
    ) : (
      toggle
    );

    return (
      <label
        style={labelWrapperStyle}
        className={className}
        aria-label={!children ? ariaLabel : undefined}
        aria-labelledby={!children ? ariaLabelledBy : undefined}
      >
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
