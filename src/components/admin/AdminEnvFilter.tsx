"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { Menu, MenuButton, MenuItem } from "@/components/ui/Menu";

import type { EnvFilter } from "./env";

const OPTIONS: { value: EnvFilter; label: string }[] = [
  { value: "all", label: "All environments" },
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "development", label: "Development" },
];

/**
 * Admin environment filter — Production / Staging / Development /
 * All. Sits to the left of the date picker on every dashboard
 * that filters by deployment env. Reads + writes a single
 * `?env=` URL search param ("all" is the default and stays off the
 * URL for clean links). Switching env also drops `?filter=` since
 * an env-specific filter usually doesn't carry over.
 *
 * Uses `usePathname()` so it works on any admin route — no
 * hardcoded base path.
 */
export default function AdminEnvFilter({
  current,
}: {
  current: EnvFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLabel =
    OPTIONS.find((o) => o.value === current)?.label ?? "All environments";

  const selectEnv = (value: EnvFilter) => {
    if (value === current) return;
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      next.delete("env");
    } else {
      next.set("env", value);
    }
    // Drop the filter when switching env — different envs have
    // different data shape and a filter from the previous env may
    // not be meaningful here.
    next.delete("filter");
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}>
      <Menu position="bottom-start" width={200} sideOffset={12}>
        {/* min-width sized to fit the widest label ("All environments")
            so changing the selection doesn't shift the search input.
            justify-content: space-between pins the label to the left
            edge and the chevron to the right — standard select-trigger
            pattern. The focus / open ring comes from MenuButton's
            secondary variant automatically (see [data-menu-trigger=
            "secondary"] in globals.css). */}
        <MenuButton
          variant="secondary"
          size="default"
          chevron
          style={{ minWidth: 200, justifyContent: "space-between" }}
        >
          {currentLabel}
        </MenuButton>
        {OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => selectEnv(option.value)}
            suffix={
              option.value === current ? (
                <Check className="w-4 h-4" />
              ) : undefined
            }
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
