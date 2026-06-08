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

// Geist-verbatim radii: default rounded-[5px], pill/avatar full,
// rounded button/chip 6px, squared image-tile 0.
const shapeRadiusMap: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  default: "5px",
  pill: "9999px",
  rounded: "6px",
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
          inset: 0;
          right: -200%;
          border-radius: inherit;
          background-image: linear-gradient(
            to right,
            var(--ds-gray-100),
            var(--ds-gray-200),
            var(--ds-gray-100)
          );
          background-size: 50% 100%;
          background-position: 0 0;
          visibility: visible;
        }
        .ds-skeleton--hide::after {
          content: none;
        }
        /* one tile of travel === one full gradient period → seamless loop */
        .ds-skeleton--anim::after {
          animation: dsLoadingSkeleton 2s linear infinite;
        }
        @keyframes dsLoadingSkeleton {
          from {
            background-position: 0% 0;
          }
          to {
            background-position: 100% 0;
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
