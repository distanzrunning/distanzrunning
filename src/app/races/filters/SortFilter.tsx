"use client";

// src/app/races/filters/SortFilter.tsx
//
// Sort selector. Trigger is an icon-only button (lucide
// ArrowDownUp); clicking opens a popover with one option per
// sort field (Date / Name / Distance / Elevation / Price). The
// currently-selected field shows a ↑ / ↓ next to its label
// indicating direction. Click logic:
//   - Click a NEW field → switch to that field, default asc.
//                         Closes the popover (most picks are
//                         "set and done").
//   - Click the CURRENT field → flip direction. Stays open so
//                               the user can verify the new
//                               state without re-opening.
//
// Trigger flips to the dark "active" treatment when the sort
// is anything other than DEFAULT_SORT.

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";

import {
  DEFAULT_SORT,
  type RaceSortKey,
} from "@/sanity/queries/raceIndexQuery";

type SortField = "date" | "name" | "distance" | "elevation" | "price";
type SortDir = "asc" | "desc";

const FIELD_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "distance", label: "Distance" },
  { value: "elevation", label: "Elevation" },
  { value: "price", label: "Price" },
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
  const { field: currentField, dir: currentDir } = splitKey(value);
  const isActive = value !== DEFAULT_SORT;

  const handleSelect = (field: SortField) => {
    if (field === currentField) {
      // Same field — flip direction, keep popover open so the
      // editor can see the new direction badge.
      const nextDir: SortDir = currentDir === "asc" ? "desc" : "asc";
      onChange(joinKey(field, nextDir));
      return;
    }
    // New field — default ascending, dismiss popover.
    onChange(joinKey(field, "asc"));
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Sort races"
          // Active treatment mirrors FilterChip — dark fill +
          // inverted icon when sort != default. Same hairline
          // ring + hover shift as the rest of the chip row so
          // the icon button reads as part of the same family.
          className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] outline-none [box-shadow:0_0_0_1px_rgba(var(--ds-gray-1000-rgb),0.1)] hover:[box-shadow:0_0_0_1px_var(--ds-gray-alpha-600)] ${
            isActive
              ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)] hover:bg-[color:var(--ds-gray-900)]"
              : "bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
          }`}
        >
          <ArrowDownUp className="size-4" strokeWidth={2} />
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
              const isSelected = opt.value === currentField;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                      isSelected
                        ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                        : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected &&
                      (currentDir === "asc" ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      ))}
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { DEFAULT_SORT };
