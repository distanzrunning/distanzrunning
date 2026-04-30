"use client";

import React from "react";

interface StatusDotProps {
  status: "queued" | "building" | "error" | "ready" | "canceled";
  label?: string;
  className?: string;
}

const statusColors: Record<StatusDotProps["status"], string> = {
  queued: "#eaeaea",
  building: "#f5a623",
  error: "#ee0000",
  ready: "#50e3c2",
  canceled: "#eaeaea",
};

const statusDescriptions: Record<StatusDotProps["status"], string> = {
  queued: "This deployment is queued.",
  building: "This deployment is building.",
  error: "This deployment had an error.",
  ready: "This deployment is ready.",
  canceled: "This deployment was canceled.",
};

export function StatusDot({ status, label, className }: StatusDotProps) {
  const color = statusColors[status];
  const description = statusDescriptions[status];

  return (
    <span
      style={{ display: "flex", alignItems: "center" }}
      className={className}
      aria-label={description}
      title={description}
    >
      <span
        style={{
          display: "block",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 14,
            lineHeight: "16px",
            color: "var(--ds-gray-1000)",
            marginLeft: 8,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
