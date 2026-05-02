"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector — looks like a FilterChip but reads conceptually
// as a control rather than a filter. The chip always shows the
// active sort label (no "Sort" placeholder); there's no clear-X
// because sort is always set, just defaulting to "Date (soonest)"
// when the URL omits it.

import { ArrowDownUp } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import {
  DEFAULT_SORT,
  type RaceSortKey,
} from "@/sanity/queries/raceIndexQuery";

interface SortOption {
  value: RaceSortKey;
  label: string;
}

const OPTIONS: SortOption[] = [
  { value: "date-asc", label: "Date (soonest)" },
  { value: "date-desc", label: "Date (latest)" },
  { value: "distance-asc", label: "Distance (shortest)" },
  { value: "distance-desc", label: "Distance (longest)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "popularity", label: "Most popular" },
];

interface SortFilterProps {
  value: RaceSortKey;
  onChange: (next: RaceSortKey) => void;
}

export default function SortFilter({ value, onChange }: SortFilterProps) {
  const active = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];
  // Always show the active label — no "Sort" placeholder, since
  // sort is always set. onClear is omitted so the chevron stays
  // (not the X clear-button).
  const activeLabel = (
    <span className="inline-flex items-center gap-1.5">
      <ArrowDownUp className="size-3.5 text-[color:var(--ds-gray-900)]" />
      <span>{active.label}</span>
    </span>
  );

  return (
    <FilterChip label="Sort" activeLabel={activeLabel} panelWidth={240}>
      {({ close }) => (
        <ul className="-mx-2 list-none p-0">
          {OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    // Default sort isn't worth committing to the
                    // URL — buildFilterParams strips it anyway.
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
}

export { DEFAULT_SORT };
