"use client";

// src/app/races/filters/SearchFilter.tsx
//
// Thin wrapper around the DS CollapsibleInput. Handles the URL ←
// debounced-buffer plumbing: typing buffers locally and commits
// to the URL after a 300 ms idle so we don't fire a server
// round-trip on every keystroke. Clicking the X clear button
// wipes the buffer and the URL but preserves focus so the user
// can immediately type a new query. Visual collapse / expand is
// owned by CollapsibleInput.

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import CollapsibleInput from "@/components/ui/CollapsibleInput";

interface SearchFilterProps {
  /** Current applied value (from URL). */
  value?: string;
  /** Fires after the local buffer has been idle for 300 ms. */
  onChange: (next: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [local, setLocal] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleClear = () => {
    setLocal("");
    onChange("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <CollapsibleInput
      ref={inputRef}
      size="small"
      prefix={<Search className="size-4" />}
      placeholder="Search"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      collapsedAriaLabel="Search races"
      aria-label="Search races"
      expandedWidth={260}
      expandedSuffix={
        local ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
            className="flex size-5 cursor-pointer items-center justify-center rounded text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-200)]"
          >
            <X className="size-3.5" />
          </button>
        ) : undefined
      }
    />
  );
}
