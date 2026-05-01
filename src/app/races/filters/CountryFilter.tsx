"use client";

// src/app/races/filters/CountryFilter.tsx
//
// Single-select country filter. The chip surface is the standard
// FilterChip; inside the popover we render a search Input + a
// scrollable list of countries. Search filters the list as you
// type. Clicking a country commits + closes; the X on the chip
// (or selecting the same country again) clears.
//
// Country list comes from a separate Sanity query
// (raceCountriesQuery) so we always show every country we have
// races for, regardless of currently-applied filters.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";

interface CountryFilterProps {
  /** Every country we have race data for, alphabetised. */
  options: string[];
  /** Currently selected country, or undefined for "no filter". */
  value?: string;
  onChange: (next: string | undefined) => void;
}

export default function CountryFilter({
  options,
  value,
  onChange,
}: CountryFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((country) => country.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <FilterChip
      label="Country"
      activeLabel={value}
      onClear={() => onChange(undefined)}
      onOpenChange={(open) => {
        // Reset the search buffer each time the popover closes so
        // a re-open starts on the full alphabetised list.
        if (!open) setQuery("");
        else {
          // Focus the input on the next tick; Radix mounts the
          // content after onOpenChange fires.
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      }}
      panelWidth={280}
    >
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <Input
            ref={inputRef}
            size="small"
            prefix={<Search className="size-4" />}
            prefixStyling={false}
            placeholder="Search countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search countries"
          />

          <CountryList
            countries={filtered}
            selected={value}
            onPick={(country) => {
              // Selecting the currently-selected country clears it.
              onChange(country === value ? undefined : country);
              close();
            }}
          />
        </div>
      )}
    </FilterChip>
  );
}

// ============================================================================
// CountryList
// ============================================================================

function CountryList({
  countries,
  selected,
  onPick,
}: {
  countries: string[];
  selected: string | undefined;
  onPick: (country: string) => void;
}) {
  // Auto-scroll the selected option into view when the list mounts
  // so reopening the popover with a value already set lands the
  // user in the right spot.
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!selected) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-country="${CSS.escape(selected)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (countries.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-[13px] text-[color:var(--ds-gray-700)]">
        No matches
      </p>
    );
  }

  return (
    <ul
      ref={listRef}
      className="-mx-2 max-h-[260px] list-none overflow-y-auto p-0"
    >
      {countries.map((country) => {
        const isSelected = country === selected;
        return (
          <li key={country} data-country={country}>
            <button
              type="button"
              onClick={() => onPick(country)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                isSelected
                  ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                  : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
              }`}
            >
              {country}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
