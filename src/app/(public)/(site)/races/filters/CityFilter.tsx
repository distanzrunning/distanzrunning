"use client";

// src/app/races/filters/CityFilter.tsx
//
// Multi-select city filter — a thin wrapper over the shared
// MultiFilterChip. Each city option carries its country, so rows
// flag their parent country AND FiltersShell can auto-sync the
// country filter to the picked cities' countries on Apply.
//
// When the country filter is already set, the city list narrows to
// those countries only — picking a city always lands the user in a
// coherent country/city state and avoids the dead-end of
// country=Belgium + city=Tokyo.

import { useMemo } from "react";

import MultiFilterChip from "./MultiFilterChip";

export interface CityOption {
  city: string;
  country: string;
  /** Optional state / region the city sits in. Only present for
   *  US races in our data; FiltersShell uses it to scope the list
   *  while a State filter is applied. */
  state?: string;
}

interface CityFilterProps {
  /** Every {city, country, state?} triple we have race data for.
   *  Sorted ASC by city in page.tsx. */
  options: CityOption[];
  /** Currently selected cities, or undefined/empty for "no
   *  filter". */
  value?: string[];
  /** Currently selected country filter — narrows the visible city
   *  list when set. */
  countryScope?: string[];
  /** Currently selected state filter — further narrows the visible
   *  list to cities in those states when set (US races only carry
   *  state in our data, so this is effectively US-scoped). */
  stateScope?: string[];
  onChange: (next: string[] | undefined) => void;
}

export default function CityFilter({
  options,
  value,
  countryScope,
  stateScope,
  onChange,
}: CityFilterProps) {
  const items = useMemo(() => {
    return options
      .filter((o) => {
        if (countryScope?.length && !countryScope.includes(o.country)) {
          return false;
        }
        if (stateScope?.length && (!o.state || !stateScope.includes(o.state))) {
          return false;
        }
        return true;
      })
      .map((o) => ({ value: o.city, flagCountry: o.country }));
  }, [options, countryScope, stateScope]);

  return (
    <MultiFilterChip
      label="City"
      searchPlaceholder="Search cities…"
      searchAriaLabel="Search cities"
      options={items}
      value={value}
      onChange={onChange}
    />
  );
}
