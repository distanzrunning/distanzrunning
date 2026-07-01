"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  AppWindow,
  Cpu,
  FileText,
  Globe,
  Languages,
  LayoutTemplate,
  Monitor,
  Network,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { ConsentDimKey } from "./data";

export interface ActiveFilter {
  dim: ConsentDimKey;
  val: string;
  /** Resolved display label (e.g. "United Kingdom"), from the server. */
  label: string;
}

// A recognisable glyph per dimension — the prefix on each filter button,
// matching Vercel's per-filter icon (device / globe / …).
const DIM_ICON: Record<ConsentDimKey, LucideIcon> = {
  devices: Monitor,
  browsers: AppWindow,
  os: Cpu,
  geography: Globe,
  languages: Languages,
  ui: LayoutTemplate,
  domains: Network,
  policy: FileText,
};

// Active-filter bar — one secondary button per filter ([icon][label][X],
// removes that filter) plus a Clear button (removes all). Right-aligned and
// wrapping, matching Vercel's analytics filter row. Soft-navigates under a
// transition so the dashboard tree persists while the re-scoped data streams.
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
      {filters.map((f) => {
        const Icon = DIM_ICON[f.dim];
        return (
          <Button
            key={`${f.dim}:${f.val}`}
            variant="secondary"
            size="tiny"
            aria-label={`Remove ${f.label} filter`}
            prefixIcon={<Icon className="w-4 h-4" />}
            suffixIcon={<X className="w-4 h-4" />}
            onClick={() => removeOne(f.dim, f.val)}
          >
            {f.label}
          </Button>
        );
      })}
      <Button variant="secondary" size="tiny" onClick={clearAll}>
        Clear
      </Button>
    </div>
  );
}
