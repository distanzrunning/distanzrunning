"use client";

// src/app/races/filters/CountryFilter.tsx
//
// Multi-select country filter. The chip surface is the standard
// FilterChip; inside the popover we render a search Input + a
// scrollable checkbox list of countries + an Apply footer. Search
// filters the list as you type. Toggles stage into a local draft —
// nothing commits until Apply, because an immediate commit reflows
// the results AND pulls the now-active chip to the front of the
// strip, yanking the popover anchor mid-interaction. Closing
// without Apply discards the draft; the X on the chip clears the
// whole selection.
//
// Country list comes from a separate Sanity query
// (raceCountriesQuery) so we always show every country we have
// races for, regardless of currently-applied filters.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";
import { getCountryFlag } from "@/lib/countryFlags";

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
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = useMemo(() => value ?? [], [value]);
  // Staged selection — edited in the popover, committed on Apply.
  const [draft, setDraft] = useState<string[]>(selected);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((country) => country.toLowerCase().includes(q));
  }, [options, query]);

  // Chip label: one country shows flag + name; more show the first
  // pick's flag + name and a +N count for the rest.
  const first = selected[0];
  const ActiveFlag = first ? getCountryFlag(first) : null;
  const activeLabel = first ? (
    <span className="inline-flex items-center gap-1.5">
      {ActiveFlag && (
        <ActiveFlag
          className="h-3 w-[18px] shrink-0 rounded-[2px]"
          aria-hidden
        />
      )}
      <span>{first}</span>
      {selected.length > 1 && <span>+{selected.length - 1}</span>}
    </span>
  ) : undefined;

  const toggle = (country: string) => {
    setDraft((d) =>
      d.includes(country) ? d.filter((c) => c !== country) : [...d, country],
    );
  };

  const isDirty =
    draft.length !== selected.length ||
    draft.some((c) => !selected.includes(c));

  return (
    <FilterChip
      label="Country"
      activeLabel={activeLabel}
      onClear={() => onChange(undefined)}
      onOpenChange={(open) => {
        // Reset the search buffer each time the popover closes so
        // a re-open starts on the full alphabetised list.
        if (!open) setQuery("");
        else {
          // Re-seed the draft from the committed value on every
          // open — a previous close-without-Apply must not leak.
          setDraft(selected);
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
            selected={draft}
            onToggle={toggle}
          />

          <div className="flex items-center justify-between gap-2 border-t border-borderSubtle pt-3">
            <Button
              variant="tertiary"
              size="tiny"
              disabled={draft.length === 0}
              onClick={() => setDraft([])}
            >
              Clear
            </Button>
            <Button
              size="tiny"
              disabled={!isDirty}
              onClick={() => {
                onChange(draft.length > 0 ? draft : undefined);
                close();
              }}
            >
              Apply{draft.length > 0 ? ` (${draft.length})` : ""}
            </Button>
          </div>
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
  onToggle,
}: {
  countries: string[];
  selected: string[];
  onToggle: (country: string) => void;
}) {
  // Auto-scroll the first selected option into view when the list
  // mounts so reopening the popover with values already set lands
  // the user in the right spot.
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const first = selected[0];
    if (!first) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-country="${CSS.escape(first)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
    // Scroll on mount only — toggling more countries mustn't yank
    // the list around mid-interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        const isSelected = selected.includes(country);
        const Flag = getCountryFlag(country);
        return (
          <li key={country} data-country={country}>
            <button
              type="button"
              onClick={() => onToggle(country)}
              aria-pressed={isSelected}
              className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-left text-[13px] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)]"
            >
              {/* Presentation-only checkbox — the row button is the
                  interactive element (bigger hit target, one tab
                  stop per row). */}
              <span className="pointer-events-none inline-flex shrink-0">
                <Checkbox checked={isSelected} onChange={() => {}} tabIndex={-1} />
              </span>
              {Flag ? (
                <Flag
                  className="h-3 w-[18px] shrink-0 rounded-[2px]"
                  aria-hidden
                />
              ) : (
                <span className="size-4 shrink-0" aria-hidden />
              )}
              <span className="truncate">{country}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
