"use client";

// src/app/races/filters/PriceFilter.tsx
//
// Range price filter. Race prices in Sanity are stored in their
// local currency; the URL canonical for this filter is USD (so
// switching display currency doesn't change the filtered set).
// The slider + presets operate in the user's *display* currency
// for UX, converting to USD at the boundary on Apply / read.
//
// GROQ-side conversion lives in raceIndexQuery — a select() runs
// per-race to translate price → USD using the same FALLBACK_RATES
// raceUtils.ts uses, then compares against $priceMin / $priceMax
// bounds.
//
// Preset NUMBERS stay logical-round per currency rather than
// auto-converting from a USD canonical (which would yield ugly
// values like "Under €46"):
//   USD/EUR/GBP/CHF/AUD/CAD: 50 / 100 / 200 — all close enough
//                            in real value that the same numbers
//                            read naturally
//   JPY                    : 5000 / 10000 / 20000 — yen needs a
//                            different scale entirely
//
// "Local" display currency falls back to USD — a price filter
// only makes sense in a single denomination.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";
import { convertCurrencySync, formatPrice } from "@/lib/raceUtils";

const PANEL_WIDTH = 420;
const SLIDER_WIDTH = 380;

// Per-currency slider scale + preset bounds. Values are in the
// display currency itself — no conversion at definition time, so
// the numbers stay clean. CONFIGS["USD"] is also the fallback for
// any currency we haven't tuned (CNY, KRW, etc) — slightly off
// but better than no chip.
interface CurrencyConfig {
  /** Slider min in this display currency. */
  min: number;
  /** Slider max in this display currency. */
  max: number;
  /** Slider step in this display currency. */
  step: number;
  /** Upper bounds for the "Under X" preset cluster. */
  presets: number[];
}

const CONFIGS: Record<string, CurrencyConfig> = {
  USD: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  EUR: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  GBP: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  CHF: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  AUD: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  CAD: { min: 0, max: 500, step: 5, presets: [50, 100, 200] },
  JPY: { min: 0, max: 50000, step: 500, presets: [5000, 10000, 20000] },
};

interface Preset {
  label: string;
  /** Bounds in the active display currency. */
  min: number;
  max: number;
}

interface PriceFilterProps {
  value: { min?: number; max?: number };
  onChange: (next: { min?: number; max?: number }) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  const { currency } = useUnits();
  // "Local" doesn't translate to a single denomination — fall
  // back to USD for the price filter UI.
  const displayCurrency = currency === "local" ? "USD" : currency;
  const config = CONFIGS[displayCurrency] ?? CONFIGS.USD;

  // Display ↔ USD conversion at the boundary. Values inside the
  // slider / preset chips live in displayCurrency; URL stores USD.
  const usdToDisplay = (usd: number): number =>
    Math.round(convertCurrencySync(usd, "USD", displayCurrency));

  const displayToUsd = (d: number): number =>
    Math.round(convertCurrencySync(d, displayCurrency, "USD"));

  // Build the preset list from the per-currency config — Free
  // first, then "Under X" for each preset bound, then the
  // top-bucket "X+" tier.
  const PRESETS: Preset[] = [
    { label: "Free", min: 0, max: 0 },
    ...config.presets.map((max) => ({
      label: `Under ${formatPrice(max, displayCurrency)}`,
      min: 0,
      max,
    })),
    {
      label: `${formatPrice(config.presets[config.presets.length - 1], displayCurrency)}+`,
      min: config.presets[config.presets.length - 1],
      max: config.max,
    },
  ];

  const minDisplay = config.min;
  const maxDisplay = config.max;

  const valueMinUsd = value.min ?? 0;
  const valueMaxUsd = value.max;
  const valueMinDisplay = value.min == null ? minDisplay : usdToDisplay(valueMinUsd);
  const valueMaxDisplay =
    valueMaxUsd == null ? maxDisplay : usdToDisplay(valueMaxUsd);

  const [tempMin, setTempMin] = useState(valueMinDisplay);
  const [tempMax, setTempMax] = useState(valueMaxDisplay);

  // Re-sync if the URL changes externally OR if the user flips
  // their display currency while the panel is closed.
  useEffect(() => {
    setTempMin(valueMinDisplay);
    setTempMax(valueMaxDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueMinDisplay, valueMaxDisplay, displayCurrency]);

  const presetMatchesTemp = (p: Preset) =>
    tempMin === p.min && tempMax === p.max;

  // Active chip label: prefer a preset name when the URL value
  // exactly hits one (after USD ↔ display round-trip).
  const matchedPreset = PRESETS.find(
    (p) => valueMinDisplay === p.min && valueMaxDisplay === p.max,
  );
  const isActive = value.min != null || value.max != null;
  const activeLabel = isActive
    ? matchedPreset
      ? matchedPreset.label
      : `${formatPrice(valueMinDisplay, displayCurrency)} – ${formatPrice(valueMaxDisplay, displayCurrency)}`
    : undefined;

  const handleClear = () => {
    onChange({ min: undefined, max: undefined });
  };

  const handleApply = (close: () => void) => {
    onChange({
      min: tempMin === minDisplay ? undefined : displayToUsd(tempMin),
      max: tempMax === maxDisplay ? undefined : displayToUsd(tempMax),
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(minDisplay);
    setTempMax(maxDisplay);
  };

  return (
    <FilterChip
      label="Price"
      activeLabel={activeLabel}
      onClear={handleClear}
      panelWidth={PANEL_WIDTH}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {/* Preset chips */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {PRESETS.map((p) => {
              const selected = presetMatchesTemp(p);
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTempMin(p.min);
                    setTempMax(p.max);
                  }}
                  className={`inline-flex h-7 cursor-pointer items-center rounded-sm px-2.5 text-[13px] font-medium transition-colors ${
                    selected
                      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                      : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Slider in display currency */}
          <div className="px-1">
            <Slider
              range
              min={minDisplay}
              max={maxDisplay}
              step={config.step}
              value={[tempMin, tempMax]}
              onChange={([min, max]) => {
                setTempMin(Math.round(min));
                setTempMax(Math.round(max));
              }}
              width={SLIDER_WIDTH}
            />
          </div>

          {/* Live readout */}
          <div className="flex items-center justify-between text-[13px] text-[color:var(--ds-gray-900)]">
            <span>{formatPrice(tempMin, displayCurrency)}</span>
            <span>{formatPrice(tempMax, displayCurrency)}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--ds-gray-300)] pt-3">
            <Button
              variant="tertiary"
              size="small"
              onClick={handleResetTemp}
              disabled={tempMin === minDisplay && tempMax === maxDisplay}
            >
              Reset
            </Button>
            <Button size="small" onClick={() => handleApply(close)}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </FilterChip>
  );
}
