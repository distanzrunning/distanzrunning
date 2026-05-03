"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Renders as a DS Select to match the currency
// dropdown in RaceUnitControls — native <select> with a hairline
// ring + chevron suffix, h-8 to align with the filter chip row.
// The trigger always shows the current option label (no separate
// "active" treatment), same as the currency picker.

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
  { value: "date-asc", label: "Date (Earliest First)" },
  { value: "date-desc", label: "Date (Latest First)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "distance-asc", label: "Distance (Shortest First)" },
  { value: "distance-desc", label: "Distance (Longest First)" },
  { value: "elevation-asc", label: "Elevation (Lowest First)" },
  { value: "elevation-desc", label: "Elevation (Highest First)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
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
      // Fixed width set to fit "Distance (Shortest First)" — the
      // longest option. Keeps the trigger stable as users cycle
      // through options.
      className="w-[220px]"
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
