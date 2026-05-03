"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Two interactions inside ONE visual trigger:
//   - Left half: opens a popover with the 5 sort fields (date,
//     name, distance, elevation, price). Shows the current
//     "Sort by …" label + a chevron-down.
//   - Right half: toggles direction (asc ↔ desc). Renders a
//     single ArrowUp icon that rotates 180° on desc, with a
//     200 ms transition so the flip is visible.
//
// Visual treatment matches the DS Select used for currency:
// hairline ring, rounded-[6px], h-8. A 1 px inset divider
// separates the two halves so they read as a split control
// rather than a single button.

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ArrowUp, ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const { field, dir } = splitKey(value);
  const nextDir: SortDir = dir === "asc" ? "desc" : "asc";
  const fieldLabel =
    FIELD_OPTIONS.find((opt) => opt.value === field)?.label ?? "Sort";

  return (
    // Outer container carries the hairline ring + corner radius
    // so the two interior buttons look like one chip. The ring
    // lifts opacity on hover of either half (group-hover).
    <div className="group inline-flex h-8 items-center rounded-[6px] bg-[color:var(--ds-background-100)] transition-shadow duration-200 [box-shadow:0_0_0_1px_rgba(var(--ds-gray-1000-rgb),0.1)] hover:[box-shadow:0_0_0_1px_var(--ds-gray-alpha-600)]">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Sort field"
            // Width pinned to fit "Sort by elevation" so the
            // trigger doesn't reflow as the user picks fields.
            className="inline-flex h-full w-[170px] cursor-pointer items-center justify-between gap-1 rounded-l-[6px] pl-3 pr-2 text-[14px] leading-[20px] text-[color:var(--ds-gray-1000)] outline-none hover:bg-[color:var(--ds-gray-100)]"
          >
            <span className="truncate">{fieldLabel}</span>
            <ChevronDown className="size-4 shrink-0 text-[color:var(--ds-gray-900)]" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={6}
            className="material-menu z-[2001]"
            style={{ width: 200, padding: 16, border: "none" }}
          >
            <ul className="-mx-2 list-none p-0">
              {FIELD_OPTIONS.map((opt) => {
                const isSelected = opt.value === field;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(joinKey(opt.value, dir));
                        setOpen(false);
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
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* 1 px inset divider — uses an alpha token so it tints
          consistently in dark mode without a separate override. */}
      <div className="h-4 w-px bg-[color:var(--ds-gray-alpha-400)]" />

      <button
        type="button"
        onClick={() => onChange(joinKey(field, nextDir))}
        aria-label={`Sort direction: ${
          dir === "asc" ? "ascending" : "descending"
        } — click to toggle`}
        className="inline-flex h-full w-8 cursor-pointer items-center justify-center rounded-r-[6px] text-[color:var(--ds-gray-900)] outline-none hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
      >
        {/* Single ArrowUp rotated 180° on desc — gives a smooth
            200 ms flip rather than a swap-cut between two icons. */}
        <ArrowUp
          className={`size-4 transition-transform duration-200 ease-out ${
            dir === "desc" ? "rotate-180" : "rotate-0"
          }`}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

export { DEFAULT_SORT };
