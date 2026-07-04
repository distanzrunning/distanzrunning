"use client";

// src/app/races/filters/StateFilter.tsx
//
// Single-select US-state filter. State is conceptually US-only —
// other countries' subdivisions don't fit the same model — so the
// option list is a hardcoded canonical set of 50 states + DC from
// US_STATES, not derived from race data.
//
// On pick, the parent (FiltersShell) auto-sets country to
// US_COUNTRY_NAME so the resulting filter combination is always
// coherent ("California" implies USA).

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";
import { US_STATES } from "@/lib/usStates";

interface StateFilterProps {
  /** Currently selected state, or undefined for "no filter". */
  value?: string;
  onChange: (next: string | null) => void;
}

export default function StateFilter({ value, onChange }: StateFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  return (
    <FilterChip
      label="State"
      activeLabel={value}
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
            onPick={(state) => {
              onChange(state === value ? null : state);
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
  states: readonly string[];
  selected: string | undefined;
  onPick: (state: string) => void;
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
      {states.map((state) => {
        const isSelected = state === selected;
        return (
          <li key={state} data-state={state}>
            <button
              type="button"
              onClick={() => onPick(state)}
              className={`flex w-full cursor-pointer items-center rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors ${
                isSelected
                  ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                  : "text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-100)]"
              }`}
            >
              <span className="truncate">{state}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
