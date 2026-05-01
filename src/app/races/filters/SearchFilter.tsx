"use client";

// src/app/races/filters/SearchFilter.tsx
//
// Inline text input — no popover. Search is the most-used filter
// and benefits from being one tap away. Typing buffers locally and
// commits on a 300 ms idle debounce so we don't fire a server
// round-trip on every keystroke.

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface SearchFilterProps {
  /** Current applied value (from URL). */
  value?: string;
  /** Fires after the local buffer has been idle for 300 ms. */
  onChange: (next: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [local, setLocal] = useState(value ?? "");

  // Sync the buffer when the URL value changes via something
  // other than this input (back/forward, reset-all, etc).
  useEffect(() => {
    setLocal(value ?? "");
  }, [value]);

  // Debounce out to the parent. Trim before comparing so we don't
  // commit a no-op transition when the user adds/removes whitespace
  // around an otherwise unchanged query.
  useEffect(() => {
    const trimmed = local.trim();
    const current = (value ?? "").trim();
    if (trimmed === current) return;
    const t = setTimeout(() => {
      onChange(trimmed);
    }, 300);
    return () => clearTimeout(t);
  }, [local, value, onChange]);

  return (
    <Input
      size="small"
      prefix={<Search className="size-4" />}
      prefixStyling={false}
      placeholder="Search races…"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      className="w-[260px]"
      aria-label="Search races"
    />
  );
}
