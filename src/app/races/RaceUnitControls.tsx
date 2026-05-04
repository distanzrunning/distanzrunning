"use client";

// src/app/races/RaceUnitControls.tsx
//
// Client island. Renders the two unit-preference controls that
// sit in the top-right of the /races header:
//   - Imperial / Metric segmented Switch (governs distance + elevation
//     formatting on every RaceCard via UnitsContext).
//   - Currency Select (governs price formatting on every RaceCard;
//     "local" keeps each race's source currency, otherwise the price
//     is converted via convertCurrencySync).
//
// Both write through to UnitsContext, which persists to localStorage
// and exposes the values back to RaceCard at render time.
//
// Controls stay visibility:hidden until first mount completes so the
// SSR'd default values don't briefly flash before localStorage-saved
// preferences swap in.

import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { useUnits } from "@/contexts/UnitsContext";

const UNIT_OPTIONS = [
  { value: "imperial", label: "Imperial" },
  { value: "metric", label: "Metric" },
];

const CURRENCY_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "CHF", label: "CHF" },
  { value: "JPY", label: "JPY (¥)" },
];

export default function RaceUnitControls() {
  const { units, currency, setUnits, setCurrency } = useUnits();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // While the header is stacked (< md), the controls sit
    // left-aligned under the subheading at every width. At md+
    // the parent flips to row + items-end + justify-between,
    // which handles bottom-alignment and pushes the wrapper
    // flush right — no self-* override needed.
    <div
      // shrink-0 prevents the wrapper from being squeezed below
      // its natural width by flex-shrink:1 when the header is
      // in row mode and the title block is wide. Without it,
      // the Switch + Select got compressed past their combined
      // natural width (~280 px) and flex-wrap then stacked
      // them vertically. Title block (which still has
      // flex-shrink:1) gives way instead.
      className="flex flex-wrap items-center gap-3 shrink-0"
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      <Switch
        size="small"
        options={UNIT_OPTIONS}
        value={units}
        onChange={(next) => setUnits(next as "metric" | "imperial")}
        name="race-units"
      />
      <Select
        size="small"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-[120px]"
        aria-label="Display currency"
      >
        {CURRENCY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
