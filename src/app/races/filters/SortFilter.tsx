"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Two controls:
//   - DS Select for the sort *field* (date / name / distance /
//     elevation / price). Same visual treatment as the currency
//     dropdown in RaceUnitControls.
//   - Square icon button next to it that toggles direction
//     (asc ↔ desc). Shows ↑ when ascending, ↓ when descending,
//     so the icon reflects current state.
//
// The combined RaceSortKey ("date-asc", "price-desc", …) splits
// into {field, dir} for the UI and rejoins on change. Switching
// field preserves direction; switching direction preserves field.

import { ArrowDown, ArrowUp } from "lucide-react";

import { Select } from "@/components/ui/Select";
import {
  DEFAULT_SORT,
  type RaceSortKey,
} from "@/sanity/queries/raceIndexQuery";

type SortField = "date" | "name" | "distance" | "elevation" | "price";
type SortDir = "asc" | "desc";

const FIELD_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "Sort by date" },
  { value: "name", label: "Sort by name" },
  { value: "distance", label: "Sort by distance" },
  { value: "elevation", label: "Sort by elevation" },
  { value: "price", label: "Sort by price" },
];

function splitKey(key: RaceSortKey): { field: SortField; dir: SortDir } {
  const [field, dir] = key.split("-") as [SortField, SortDir];
  return { field, dir };
}

function joinKey(field: SortField, dir: SortDir): RaceSortKey {
  return `${field}-${dir}` as RaceSortKey;
}

interface SortFilterProps {
  value: RaceSortKey;
  onChange: (next: RaceSortKey) => void;
}

export default function SortFilter({ value, onChange }: SortFilterProps) {
  const { field, dir } = splitKey(value);
  const nextDir: SortDir = dir === "asc" ? "desc" : "asc";

  return (
    <div className="inline-flex items-center gap-1">
      <Select
        size="small"
        value={field}
        onChange={(e) => onChange(joinKey(e.target.value as SortField, dir))}
        // Width set to fit "Sort by elevation" — the longest
        // option label — without per-pick reflow.
        className="w-[170px]"
        aria-label="Sort field"
      >
        {FIELD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <button
        type="button"
        onClick={() => onChange(joinKey(field, nextDir))}
        aria-label={`Sort direction: ${
          dir === "asc" ? "ascending" : "descending"
        } — click to toggle`}
        // Mirrors the DS Select's hairline ring + corner radius so
        // the field selector and direction toggle read as one
        // control. Hover lifts the ring opacity to gray-alpha-600.
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] text-[color:var(--ds-gray-900)] transition-[box-shadow,color] duration-200 [box-shadow:0_0_0_1px_rgba(var(--ds-gray-1000-rgb),0.1)] hover:text-[color:var(--ds-gray-1000)] hover:[box-shadow:0_0_0_1px_var(--ds-gray-alpha-600)]"
      >
        {dir === "asc" ? (
          <ArrowUp className="size-4" strokeWidth={2} />
        ) : (
          <ArrowDown className="size-4" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}

export { DEFAULT_SORT };
