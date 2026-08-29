"use client";

// src/app/races/filters/MultiFilterChip.tsx
//
// Shared multi-select filter popover — the single implementation
// behind the Country / City / State / Tag chips. Search Input +
// scrollable checkbox list + the range-filters' Reset/Apply footer.
//
// Toggles stage into a local draft — nothing commits until Apply,
// because an immediate commit reflows the results AND pulls the
// now-active chip to the front of the strip, yanking the popover
// anchor mid-interaction. Closing without Apply discards the draft
// (re-seeded from the committed value on every open); the X on the
// chip clears the whole selection instantly.

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import FilterChip from "@/components/ui/FilterChip";
import { Input } from "@/components/ui/Input";
import { getCountryFlag } from "@/lib/countryFlags";

export interface MultiFilterOption {
  value: string;
  /** Country name to render a flag for (Country rows flag
   *  themselves; City rows flag their parent country). */
  flagCountry?: string;
}

interface MultiFilterChipProps {
  label: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  /** Full option list, already scoped/sorted by the caller. */
  options: MultiFilterOption[];
  /** Currently committed selection, or undefined/empty for "no
   *  filter". */
  value?: string[];
  onChange: (next: string[] | undefined) => void;
  panelWidth?: number;
}

export default function MultiFilterChip({
  label,
  searchPlaceholder,
  searchAriaLabel,
  options,
  value,
  onChange,
  panelWidth = 280,
}: MultiFilterChipProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = useMemo(() => value ?? [], [value]);
  // Staged selection — edited in the popover, committed on Apply.
  const [draft, setDraft] = useState<string[]>(selected);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.value.toLowerCase().includes(q));
  }, [options, query]);

  // Chip label: one pick shows (flag +) name; more append a +N
  // count for the rest.
  const first = selected[0];
  const firstFlagCountry = first
    ? options.find((o) => o.value === first)?.flagCountry
    : undefined;
  const ActiveFlag = firstFlagCountry
    ? getCountryFlag(firstFlagCountry)
    : null;
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

  const toggle = (option: string) => {
    setDraft((d) =>
      d.includes(option) ? d.filter((v) => v !== option) : [...d, option],
    );
  };

  return (
    <FilterChip
      label={label}
      activeLabel={activeLabel}
      onClear={() => onChange(undefined)}
      onOpenChange={(open) => {
        // Reset the search buffer each time the popover closes so
        // a re-open starts on the full list.
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
      panelWidth={panelWidth}
    >
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <Input
            ref={inputRef}
            size="small"
            prefix={<Search className="size-4" />}
            prefixStyling={false}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={searchAriaLabel}
          />

          <OptionList options={filtered} selected={draft} onToggle={toggle} />

          {/* Footer — same shape as the range filters' (Distance /
              Price / Elevation / Temperature): right-aligned Reset +
              Apply, small, gray-300 hairline. */}
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--ds-gray-300)] pt-3">
            <Button
              variant="tertiary"
              size="small"
              onClick={() => setDraft([])}
              disabled={draft.length === 0}
            >
              Reset
            </Button>
            <Button
              size="small"
              onClick={() => {
                onChange(draft.length > 0 ? draft : undefined);
                close();
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </FilterChip>
  );
}

// ============================================================================
// OptionList
// ============================================================================

function OptionList({
  options,
  selected,
  onToggle,
}: {
  options: MultiFilterOption[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  // Auto-scroll the first selected option into view when the list
  // mounts so reopening the popover with values already set lands
  // the user in the right spot.
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const first = selected[0];
    if (!first) return;
    const li = listRef.current?.querySelector<HTMLElement>(
      `[data-option="${CSS.escape(first)}"]`,
    );
    li?.scrollIntoView({ block: "nearest" });
    // Scroll on mount only — toggling more options mustn't yank
    // the list around mid-interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (options.length === 0) {
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
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        const Flag = option.flagCountry
          ? getCountryFlag(option.flagCountry)
          : null;
        return (
          <li key={option.value} data-option={option.value}>
            <button
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isSelected}
              className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-left text-[13px] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)]"
            >
              {/* Presentation-only checkbox — the row button is the
                  interactive element (bigger hit target, one tab
                  stop per row). */}
              <span className="pointer-events-none inline-flex shrink-0">
                <Checkbox
                  checked={isSelected}
                  onChange={() => {}}
                  tabIndex={-1}
                />
              </span>
              {option.flagCountry &&
                (Flag ? (
                  <Flag
                    className="h-3 w-[18px] shrink-0 rounded-[2px]"
                    aria-hidden
                  />
                ) : (
                  <span className="size-4 shrink-0" aria-hidden />
                ))}
              <span className="truncate">{option.value}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
