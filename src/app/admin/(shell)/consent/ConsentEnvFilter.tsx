"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { Menu, MenuButton, MenuItem } from "@/components/ui/Menu";

import type { ConsentEnvFilter } from "./data";

const OPTIONS: { value: ConsentEnvFilter; label: string }[] = [
  { value: "all", label: "All environments" },
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "development", label: "Development" },
];

export default function ConsentEnvFilterMenu({
  current,
}: {
  current: ConsentEnvFilter;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLabel =
    OPTIONS.find((o) => o.value === current)?.label ?? "All environments";

  const selectEnv = (value: ConsentEnvFilter) => {
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
      router.push(qs ? `/admin/consent?${qs}` : "/admin/consent");
    });
  };

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}>
      <Menu position="bottom-start" width={200}>
        {/* min-width sized to fit the widest label ("All environments")
            so changing the selection doesn't shift the search input
            to its left. */}
        <MenuButton
          variant="secondary"
          size="default"
          chevron
          style={{ minWidth: 200 }}
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
