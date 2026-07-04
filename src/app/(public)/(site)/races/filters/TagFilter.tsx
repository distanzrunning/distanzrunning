"use client";

// src/app/races/filters/TagFilter.tsx
//
// Single-select tag filter. Race guides each carry an array of
// editorial tags (e.g. "World Athletics Gold", "Major Marathon",
// "Fast Course"). Picking a tag filters to races whose `tags`
// array includes it (GROQ predicate: $tag in tags).
//
// Tag list comes from raceTagsQuery — array::unique flatten of
// every published race's tags, alphabetised. Independent of the
// active filter set so the dropdown always shows every option.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";

interface TagFilterProps {
  /** Every tag we have race data for, alphabetised. */
  options: string[];
  /** Currently selected tag, or undefined for "no filter". */
  value?: string;
  onChange: (next: string | undefined) => void;
}

export default function TagFilter({
  options,
  value,
  onChange,
}: TagFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((tag) => tag.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <FilterChip
      label="Tag"
      activeLabel={value}
      onClear={() => onChange(undefined)}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        else requestAnimationFrame(() => inputRef.current?.focus());
      }}
      panelWidth={320}
    >
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <Input
            ref={inputRef}
            size="small"
            prefix={<Search className="size-4" />}
            prefixStyling={false}
            placeholder="Search tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tags"
          />

          <TagList
            tags={filtered}
            selected={value}
            onPick={(tag) => {
              onChange(tag === value ? undefined : tag);
              close();
            }}
          />
        </div>
      )}
    </FilterChip>
  );
}

// ============================================================================
// TagList
// ============================================================================

function TagList({
  tags,
  selected,
  onPick,
}: {
  tags: string[];
  selected: string | undefined;
  onPick: (tag: string) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!selected) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-tag="${CSS.escape(selected)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (tags.length === 0) {
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
      {tags.map((tag) => {
        const isSelected = tag === selected;
        return (
          <li key={tag} data-tag={tag}>
            <button
              type="button"
              onClick={() => onPick(tag)}
              className={`flex w-full cursor-pointer items-center rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                isSelected
                  ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                  : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
              }`}
            >
              <span className="truncate">{tag}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
