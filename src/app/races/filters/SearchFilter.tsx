"use client";

// src/app/races/filters/SearchFilter.tsx
//
// Two visual states:
//   - Collapsed: a 32 px square IconButton showing the search glyph,
//     matching the height of the other filter chips. Default state
//     when the URL has no `q` param and the input isn't focused.
//   - Expanded: a 260 px DS Input with the search icon as prefix, an
//     X clear-button in the suffix when there's text, and the
//     placeholder "Search". State enters on click of the collapsed
//     icon, exits on blur with an empty buffer.
//
// Typing buffers locally and commits to the URL after a 300 ms idle,
// so we don't fire a server round-trip on every keystroke. Clicking
// X clears the buffer and the URL but preserves focus
// (mousedown preventDefault) so the user can keep typing.

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface SearchFilterProps {
  /** Current applied value (from URL). */
  value?: string;
  /** Fires after the local buffer has been idle for 300 ms. */
  onChange: (next: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [local, setLocal] = useState(value ?? "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const expanded = Boolean(local) || Boolean(value) || focused;

  // Sync the buffer when the URL value changes via something
  // other than this input (back/forward, reset-all, etc).
  useEffect(() => {
    setLocal(value ?? "");
  }, [value]);

  // Debounce out to the parent.
  useEffect(() => {
    const trimmed = local.trim();
    const current = (value ?? "").trim();
    if (trimmed === current) return;
    const t = setTimeout(() => {
      onChange(trimmed);
    }, 300);
    return () => clearTimeout(t);
  }, [local, value, onChange]);

  if (!expanded) {
    // Styling mirrors the Calendar trigger so the two chips read
    // identically: --ds-background-100 fill (white in light, near-
    // black in dark), --ds-gray-400 hairline ring via box-shadow
    // (--ds-gray-500 on hover), --ds-gray-100 hover fill.
    return (
      <button
        type="button"
        aria-label="Search races"
        onClick={() => {
          setFocused(true);
          // Input mounts on next render — focus then.
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="inline-flex size-8 items-center justify-center rounded-md bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] [box-shadow:var(--ds-gray-400)_0_0_0_1px] hover:[box-shadow:var(--ds-gray-500)_0_0_0_1px]"
      >
        <Search className="size-4" />
      </button>
    );
  }

  const handleClear = () => {
    setLocal("");
    onChange("");
    // Restore focus after the click cycle so the input stays
    // expanded — preventDefault on mousedown alone isn't always
    // enough across browsers.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <Input
      ref={inputRef}
      size="small"
      prefix={<Search className="size-4" />}
      prefixStyling={false}
      suffix={
        local ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
            className="-mr-1 flex size-6 cursor-pointer items-center justify-center rounded-md text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-200)] hover:text-[color:var(--ds-gray-1000)]"
          >
            <X className="size-3.5" />
          </button>
        ) : undefined
      }
      suffixStyling={false}
      placeholder="Search"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-[260px]"
      aria-label="Search races"
    />
  );
}
