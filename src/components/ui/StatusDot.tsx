"use client";

import React from "react";

interface StatusDotProps {
  status: "queued" | "building" | "error" | "ready" | "canceled";
  label?: string;
  className?: string;
}

const statusColors: Record<StatusDotProps["status"], string> = {
  queued: "var(--ds-gray-700)",
  building: "var(--ds-amber-700)",
  error: "var(--ds-red-700)",
  ready: "var(--ds-green-700)",
  canceled: "var(--ds-gray-500)",
};

const statusDescriptions: Record<StatusDotProps["status"], string> = {
  queued: "This deployment is queued.",
  building: "This deployment is building.",
  error: "This deployment has an error.",
  ready: "This deployment is ready.",
  canceled: "This deployment is canceled.",
};

export function StatusDot({ status, label, className }: StatusDotProps) {
  const color = statusColors[status];
  const description = statusDescriptions[status];
  const isBuilding = status === "building";

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      className={className}
      aria-label={description}
      title={description}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
          animation: isBuilding ? "statusDotPulse 1.5s ease-in-out infinite" : undefined,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 14,
            lineHeight: "20px",
            color: "var(--ds-gray-1000)",
          }}
        >
          {label}
        </span>
      )}
      {isBuilding && (
        <style>{`
          @keyframes statusDotPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.4);
              opacity: 0.7;
            }
          }
        `}</style>
      )}
    </span>
  );
}
