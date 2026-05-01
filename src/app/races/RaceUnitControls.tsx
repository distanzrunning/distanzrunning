"use client";

// src/app/races/RaceUnitControls.tsx
//
// Client island. Renders the two unit-preference controls that
// sit in the top-right of the /races header:
//   - Imperial / Metric segmented Switch (governs distance + elevation
//     formatting on every RaceCard via UnitsContext).
//   - Currency Select (governs price formatting on every RaceCard;
//     the source price is converted via convertCurrencySync).
//
// Both write through to UnitsContext, which persists to localStorage
// and exposes the values back to RaceCard at render time.

import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { useUnits } from "@/contexts/UnitsContext";

const UNIT_OPTIONS = [
  { value: "metric", label: "Metric" },
  { value: "imperial", label: "Imperial" },
];

const CURRENCY_OPTIONS = [
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

  return (
    <div className="flex flex-wrap items-center gap-3">
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
