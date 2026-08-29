"use client";

// src/app/races/filters/TagFilter.tsx
//
// Multi-select tag filter — a thin wrapper over the shared
// MultiFilterChip. Races match when they carry ANY selected tag
// (GROQ: count(tags[@ in $raceTags]) > 0).
//
// Tag list comes from raceTagsQuery — array::unique flatten of
// every published race's tags, alphabetised. Independent of the
// active filter set so the dropdown always shows every option.

import { useMemo } from "react";

import MultiFilterChip from "./MultiFilterChip";

interface TagFilterProps {
  /** Every tag we have race data for, alphabetised. */
  options: string[];
  /** Currently selected tags, or undefined/empty for "no filter". */
  value?: string[];
  onChange: (next: string[] | undefined) => void;
}

export default function TagFilter({
  options,
  value,
  onChange,
}: TagFilterProps) {
  const items = useMemo(() => options.map((t) => ({ value: t })), [options]);
  return (
    <MultiFilterChip
      label="Tag"
      searchPlaceholder="Search tags…"
      searchAriaLabel="Search tags"
      options={items}
      value={value}
      onChange={onChange}
      panelWidth={320}
    />
  );
}
