"use client";

import React from "react";

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton (sets min-height) */
  height?: string | number;
  /** Shape variant */
  shape?: "default" | "pill" | "rounded" | "squared";
  /** Whether to show the skeleton (loading state) */
  show?: boolean;
  /** Disable the shimmer animation */
  noAnimation?: boolean;
  /** Children to wrap — skeleton hides when present and show is false */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// Geist-verbatim radii (skeleton-module): default 5px, pill 9999px,
// rounded 50% (ellipse/circle), squared 0.
const shapeRadiusMap: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  default: "5px",
  pill: "9999px",
  rounded: "50%",
  squared: "0px",
};

export function Skeleton({
  width,
  height,
  shape = "default",
  show = true,
  noAnimation = false,
  children,
  className = "",
  style,
}: SkeletonProps) {
  const borderRadius = shapeRadiusMap[shape];

  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <span
      className={`ds-skeleton ${show ? "ds-skeleton--show" : "ds-skeleton--hide"} ${
        noAnimation ? "" : "ds-skeleton--anim"
      } ${className}`}
      data-geist-skeleton=""
      style={{
        width: resolvedWidth,
        minHeight: resolvedHeight,
        borderRadius,
        ...style,
      }}
    >
      {children}
      {/*
        Geist shimmer model: the box is `overflow:hidden` and its `::after`
        is a left→right sweeping gradient (gray-100 → gray-200 → gray-100).
        When wrapping children we hide them with `visibility:hidden` on the
        box and keep the `::after` visible (Geist's invisible + after:visible).
        When `show` is false the children render normally and the shimmer is
        removed (`content:none`).
      */}
      <style jsx>{`
        .ds-skeleton {
          display: block;
          position: relative;
          overflow: hidden;
        }
        /* show: hide the wrapped content, keep the shimmer overlay */
        .ds-skeleton--show {
          visibility: hidden;
        }
        /* hide: reveal the wrapped content, drop the shimmer */
        .ds-skeleton--hide {
          overflow: visible;
        }
        .ds-skeleton::after {
          content: "";
          position: absolute;
          inset: 0 -200% 0 0;
          border-radius: inherit;
          background: linear-gradient(
              90deg,
              var(--ds-gray-100),
              var(--ds-gray-200),
              var(--ds-gray-100)
            )
            0 0 / 50% 100%;
          visibility: visible;
        }
        .ds-skeleton--hide::after {
          content: none;
        }
        /*
          Geist-verbatim: the ::after is 300% wide (inset right -200%) and the
          gradient tiles at 50% (one tile === 150% of the box). Translating it
          by -50% of its own width moves exactly one tile, so the loop is
          seamless. The reverse keyword makes the band sweep left-to-right;
          ease-in-out gives Geist's gentle pulse-and-sweep cadence.
        */
        .ds-skeleton--anim::after {
          animation: 1.5s ease-in-out infinite reverse dsLoadingSkeleton;
        }
        @keyframes dsLoadingSkeleton {
          to {
            transform: translate(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ds-skeleton::after {
            animation: none;
          }
        }
      `}</style>
    </span>
  );
}

export default Skeleton;
