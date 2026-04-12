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
  /** Disable pulse animation */
  noAnimation?: boolean;
  /** Children to wrap - skeleton hides when children are present and show is false */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

const shapeRadiusMap: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  default: "4px",
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

  const resolvedWidth =
    typeof width === "number" ? `${width}px` : width;
  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height;

  // When wrapping children and show is false, just render children
  if (children && !show) {
    return <>{children}</>;
  }

  // When wrapping children and show is true, render children hidden behind skeleton
  if (children && show) {
    return (
      <span
        className={`skeleton-wrapper ${className}`}
        style={{
          display: "inline-block",
          position: "relative",
          width: resolvedWidth,
          minHeight: resolvedHeight,
          borderRadius,
          ...style,
        }}
      >
        <span
          style={{
            opacity: 0,
            visibility: "hidden",
          }}
        >
          {children}
        </span>
        <span
          className={noAnimation ? "" : "skeleton-pulse"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--ds-gray-200)",
            borderRadius,
          }}
        />
        <style jsx>{`
          @keyframes skeletonPulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
          .skeleton-pulse {
            animation: skeletonPulse 1.5s ease-in-out infinite;
          }
        `}</style>
      </span>
    );
  }

  // Default: render a plain skeleton block
  return (
    <span
      className={`${noAnimation ? "" : "skeleton-pulse"} ${className}`}
      style={{
        display: "inline-block",
        width: resolvedWidth,
        minHeight: resolvedHeight,
        background: "var(--ds-gray-200)",
        borderRadius,
        ...style,
      }}
    >
      <style jsx>{`
        @keyframes skeletonPulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
}

export default Skeleton;
