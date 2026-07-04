"use client";

// src/app/races/filters/CityFilter.tsx
//
// Single-select city filter. Each city option carries its country,
// so the dropdown can render a flag next to the name AND the parent
// can auto-sync the country filter when a city is picked.
//
// When the country filter is already set, the city list narrows
// to that country only — picking a city always lands the user in
// a coherent country/city state and avoids the dead-end of
// country=Belgium + city=Tokyo.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";
import { getCountryFlag } from "@/lib/countryFlags";

export interface CityOption {
  city: string;
  country: string;
  /** Optional state / region the city sits in. Only present for
   *  US races in our data; FiltersShell uses it to auto-fill the
   *  State chip when a US city is picked. */
  state?: string;
}

interface CityFilterProps {
  /** Every {city, country, state?} triple we have race data for.
   *  Sorted ASC by city in page.tsx. */
  options: CityOption[];
  /** Currently selected city, or undefined for "no filter". */
  value?: string;
  /** Currently selected country filter — narrows the visible city
   *  list when set. */
  countryScope?: string;
  /** Currently selected state filter — further narrows the visible
   *  list to cities in that state when set (US races only carry
   *  state in our data, so this is effectively US-scoped). */
  stateScope?: string;
  /** Fires with the picked option (auto-syncs country) or null
   *  (clear). */
  onChange: (next: CityOption | null) => void;
}

export default function CityFilter({
  options,
  value,
  countryScope,
  stateScope,
  onChange,
}: CityFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const scoped = useMemo(() => {
    return options.filter((o) => {
      if (countryScope && o.country !== countryScope) return false;
      if (stateScope && o.state !== stateScope) return false;
      return true;
    });
  }, [options, countryScope, stateScope]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter((o) => o.city.toLowerCase().includes(q));
  }, [scoped, query]);

  // Resolve the country for the active city so we can render its
  // flag in the chip's active label even when countryScope isn't
  // set (e.g. user picked the city via search without country).
  const activeCountry = useMemo(() => {
    if (!value) return undefined;
    return options.find((o) => o.city === value)?.country;
  }, [value, options]);

  const ActiveFlag = activeCountry ? getCountryFlag(activeCountry) : null;
  const activeLabel = value ? (
    <span className="inline-flex items-center gap-1.5">
      {ActiveFlag && (
        <ActiveFlag
          className="h-3 w-[18px] shrink-0 rounded-[2px]"
          aria-hidden
        />
      )}
      <span>{value}</span>
    </span>
  ) : undefined;

  return (
    <FilterChip
      label="City"
      activeLabel={activeLabel}
      onClear={() => onChange(null)}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        else requestAnimationFrame(() => inputRef.current?.focus());
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
            placeholder="Search cities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search cities"
          />

          <CityList
            cities={filtered}
            selected={value}
            onPick={(option) => {
              onChange(option.city === value ? null : option);
              close();
            }}
          />
        </div>
      )}
    </FilterChip>
  );
}

// ============================================================================
// CityList
// ============================================================================

function CityList({
  cities,
  selected,
  onPick,
}: {
  cities: CityOption[];
  selected: string | undefined;
  onPick: (option: CityOption) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!selected) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-city="${CSS.escape(selected)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (cities.length === 0) {
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
      {cities.map(({ city, country }) => {
        const isSelected = city === selected;
        const Flag = getCountryFlag(country);
        return (
          <li key={city} data-city={city}>
            <button
              type="button"
              onClick={() => onPick({ city, country })}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                isSelected
                  ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                  : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
              }`}
            >
              {Flag ? (
                <Flag
                  className="h-3 w-[18px] shrink-0 rounded-[2px]"
                  aria-hidden
                />
              ) : (
                <span className="size-4 shrink-0" aria-hidden />
              )}
              <span className="truncate">{city}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
