"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";

export interface ActiveFilter {
  /** Breakdown dimension key (e.g. "geography", "pages"). */
  dim: string;
  /** Selected value / grouping key. */
  val: string;
  /** Resolved display label (e.g. "United Kingdom"), from the server. */
  label: string;
  /** Prefix glyph — a server-rendered element (dimension icon or flag).
   *  Passed as an element (not a component) so it crosses the RSC boundary. */
  icon?: ReactNode;
}

// Shared active-filter bar for the admin dashboards — one secondary button per
// active filter ([icon][label][X], removes that filter) plus a Clear button
// (removes all). Right-aligned and wrapping, matching Vercel's analytics filter
// row. Filters live in repeated `?f=dim:val` params; the bar soft-navigates
// under a transition so the dashboard tree persists while re-scoped data
// streams in.
export default function FilterBar({ filters }: { filters: ActiveFilter[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (filters.length === 0) return null;

  const push = (next: URLSearchParams) => {
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const removeOne = (dim: string, val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const kept = next.getAll("f").filter((f) => f !== `${dim}:${val}`);
    next.delete("f");
    kept.forEach((f) => next.append("f", f));
    push(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("f");
    push(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
      }}
    >
      {filters.map((f) => (
        <Button
          key={`${f.dim}:${f.val}`}
          variant="secondary"
          size="tiny"
          aria-label={`Remove ${f.label} filter`}
          prefixIcon={f.icon}
          suffixIcon={<X className="w-4 h-4" />}
          onClick={() => removeOne(f.dim, f.val)}
        >
          {f.label}
        </Button>
      ))}
      <Button variant="secondary" size="tiny" onClick={clearAll}>
        Clear
      </Button>
    </div>
  );
}
