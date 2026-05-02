"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Renders as a FilterChip in the right-aligned
// slot, but treats its "active" state visually rather than via
// the activeLabel slot — the trigger always reads "Sort", and
// the chip flips to the dark inverted treatment when the value
// is anything other than DEFAULT_SORT. That keeps the chip
// width stable as users cycle through long sort options
// (e.g. "Distance (Longest First)") without re-flowing the row.
//
// Option labels mirror the legacy filter's wording.

import { useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Tooltip } from "@/components/ui/Tooltip";
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
  const isActive = value !== DEFAULT_SORT;
  const activeOption = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  // Track popover open state so we can suppress the tooltip
  // while the panel is up — the two would otherwise overlap.
  const [open, setOpen] = useState(false);

  const chip = (
    <FilterChip
      label="Sort"
      active={isActive}
      panelWidth={260}
      onOpenChange={setOpen}
    >
      {({ close }) => (
        <ul className="-mx-2 list-none p-0">
          {OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                  className={`flex w-full cursor-pointer items-center rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                    isSelected
                      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                      : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </FilterChip>
  );

  // Skip the tooltip wrapper while the popover is open — Tooltip
  // would otherwise float above the panel awkwardly. Wrap the
  // chip in a span when tooltip is active so cloneElement on a
  // function component doesn't drop the event handlers.
  if (open) return chip;
  return (
    <Tooltip content={`Sort by ${activeOption.label}`} side="top" align="end">
      <span>{chip}</span>
    </Tooltip>
  );
}

export { DEFAULT_SORT };
