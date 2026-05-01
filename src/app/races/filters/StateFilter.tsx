"use client";

// src/app/races/filters/StateFilter.tsx
//
// Single-select state / region filter. Same shape as CityFilter —
// each option carries its country so we can render the flag and
// auto-sync the country filter when a state is picked. When the
// country filter is set, the state list narrows to that country
// only; states from countries that don't subdivide that way
// (Belgium, Qatar, etc) simply don't appear in the source data
// because the GROQ query filters out races without stateRegion.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";
import { getCountryFlag } from "@/lib/countryFlags";

export interface StateOption {
  state: string;
  country: string;
}

interface StateFilterProps {
  /** Every {state, country} pair we have race data for. Sorted ASC
   *  by state in page.tsx. */
  options: StateOption[];
  /** Currently selected state, or undefined for "no filter". */
  value?: string;
  /** Currently selected country filter — narrows the visible list
   *  when set. */
  countryScope?: string;
  onChange: (next: StateOption | null) => void;
}

export default function StateFilter({
  options,
  value,
  countryScope,
  onChange,
}: StateFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const scoped = useMemo(() => {
    if (!countryScope) return options;
    return options.filter((o) => o.country === countryScope);
  }, [options, countryScope]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter((o) => o.state.toLowerCase().includes(q));
  }, [scoped, query]);

  const activeCountry = useMemo(() => {
    if (!value) return undefined;
    return options.find((o) => o.state === value)?.country;
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
      label="State"
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
            placeholder="Search states…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search states"
          />

          <StateList
            states={filtered}
            selected={value}
            onPick={(option) => {
              onChange(option.state === value ? null : option);
              close();
            }}
          />
        </div>
      )}
    </FilterChip>
  );
}

// ============================================================================
// StateList
// ============================================================================

function StateList({
  states,
  selected,
  onPick,
}: {
  states: StateOption[];
  selected: string | undefined;
  onPick: (option: StateOption) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!selected) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-state="${CSS.escape(selected)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (states.length === 0) {
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
      {states.map(({ state, country }) => {
        const isSelected = state === selected;
        const Flag = getCountryFlag(country);
        return (
          <li key={state} data-state={state}>
            <button
              type="button"
              onClick={() => onPick({ state, country })}
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
              <span className="truncate">{state}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
