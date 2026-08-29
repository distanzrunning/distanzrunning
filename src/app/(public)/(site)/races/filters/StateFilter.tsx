"use client";

// src/app/races/filters/StateFilter.tsx
//
// Multi-select US-state filter — a thin wrapper over the shared
// MultiFilterChip. State is conceptually US-only — other countries'
// subdivisions don't fit the same model — so the option list is a
// hardcoded canonical set of 50 states + DC from US_STATES, not
// derived from race data.
//
// On Apply, the parent (FiltersShell) narrows the country filter to
// USA so the resulting combination is always coherent ("California"
// implies USA).

import { useMemo } from "react";

import { US_STATES } from "@/lib/usStates";
import MultiFilterChip from "./MultiFilterChip";

interface StateFilterProps {
  /** Currently selected states, or undefined/empty for "no
   *  filter". */
  value?: string[];
  onChange: (next: string[] | undefined) => void;
}

export default function StateFilter({ value, onChange }: StateFilterProps) {
  const items = useMemo(() => US_STATES.map((s) => ({ value: s })), []);
  return (
    <MultiFilterChip
      label="State"
      searchPlaceholder="Search states…"
      searchAriaLabel="Search states"
      options={items}
      value={value}
      onChange={onChange}
    />
  );
}
