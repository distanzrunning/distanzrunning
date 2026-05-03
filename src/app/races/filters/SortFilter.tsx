"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Renders as a DS Select to match the currency
// dropdown in RaceUnitControls — native <select> with a hairline
// ring + chevron suffix, h-8 to align with the filter chip row.
// Labels are intentionally compact (no parens, single-clause) so
// the trigger stays narrow as the user cycles through options.

import { Select } from "@/components/ui/Select";
import {
  DEFAULT_SORT,
  type RaceSortKey,
} from "@/sanity/queries/raceIndexQuery";

interface SortOption {
  value: RaceSortKey;
  label: string;
}

const OPTIONS: SortOption[] = [
  { value: "date-asc", label: "Earliest date" },
  { value: "date-desc", label: "Latest date" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "distance-asc", label: "Shortest distance" },
  { value: "distance-desc", label: "Longest distance" },
  { value: "elevation-asc", label: "Lowest elevation" },
  { value: "elevation-desc", label: "Highest elevation" },
  { value: "price-asc", label: "Cheapest price" },
  { value: "price-desc", label: "Highest price" },
];

interface SortFilterProps {
  value: RaceSortKey;
  onChange: (next: RaceSortKey) => void;
}

export default function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as RaceSortKey)}
      // Width set to fit "Highest elevation" — the longest label
      // — without per-pick reflow. ~70 px narrower than the legacy
      // "Date (Earliest First)" form took.
      className="w-[180px]"
      aria-label="Sort races"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

export { DEFAULT_SORT };
