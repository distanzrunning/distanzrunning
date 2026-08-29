"use client";

// src/app/races/filters/CountryFilter.tsx
//
// Multi-select country filter — a thin wrapper over the shared
// MultiFilterChip (search + checkbox list + Reset/Apply footer).
// Country rows flag themselves.
//
// Country list comes from a separate Sanity query
// (raceCountriesQuery) so we always show every country we have
// races for, regardless of currently-applied filters.

import { useMemo } from "react";

import MultiFilterChip from "./MultiFilterChip";

interface CountryFilterProps {
  /** Every country we have race data for, alphabetised. */
  options: string[];
  /** Currently selected countries, or undefined/empty for "no
   *  filter". */
  value?: string[];
  onChange: (next: string[] | undefined) => void;
}

export default function CountryFilter({
  options,
  value,
  onChange,
}: CountryFilterProps) {
  const items = useMemo(
    () => options.map((c) => ({ value: c, flagCountry: c })),
    [options],
  );
  return (
    <MultiFilterChip
      label="Country"
      searchPlaceholder="Search countries…"
      searchAriaLabel="Search countries"
      options={items}
      value={value}
      onChange={onChange}
    />
  );
}
