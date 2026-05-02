"use client";

// src/app/races/filters/PriceFilter.tsx
//
// Range price filter. Race prices in Sanity are stored in their
// local currency; the URL canonical for this filter is USD (so
// switching display currency doesn't change the filtered set).
// The slider operates in the user's *display* currency for UX,
// converting at the boundary on Apply / read.
//
// GROQ-side conversion lives in raceIndexQuery — a select() runs
// per-race to translate price → USD using the same fallback
// rates raceUtils.ts uses, then compares against $priceMin /
// $priceMax bounds.
//
// "Local" display currency falls back to USD on the slider — a
// price filter only makes sense in a single denomination, and
// USD is the canonical store value anyway.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";
import { convertCurrencySync, formatPrice } from "@/lib/raceUtils";

const MIN_USD = 0;
const MAX_USD = 500;
const PANEL_WIDTH = 420;
const SLIDER_WIDTH = 380;

interface Preset {
  label: string;
  /** USD bounds — single canonical for both presets and slider. */
  min: number;
  max: number;
}

// Presets are defined in USD. Labels reformat to the user's
// display currency at render time.
const PRESETS: Preset[] = [
  { label: "Free", min: 0, max: 0 },
  { label: "Under $50", min: 0, max: 50 },
  { label: "Under $100", min: 0, max: 100 },
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200+", min: 200, max: MAX_USD },
];

interface PriceFilterProps {
  value: { min?: number; max?: number };
  onChange: (next: { min?: number; max?: number }) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  const { currency } = useUnits();
  // "Local" doesn't translate to a single denomination — fall
  // back to USD for the price filter UI.
  const displayCurrency = currency === "local" ? "USD" : currency;

  const usdToDisplay = (usd: number): number =>
    Math.round(convertCurrencySync(usd, "USD", displayCurrency));

  const displayToUsd = (d: number): number =>
    Math.round(convertCurrencySync(d, displayCurrency, "USD"));

  const minDisplay = usdToDisplay(MIN_USD);
  const maxDisplay = usdToDisplay(MAX_USD);

  const valueMinUsd = value.min ?? MIN_USD;
  const valueMaxUsd = value.max ?? MAX_USD;
  const valueMinDisplay = usdToDisplay(valueMinUsd);
  const valueMaxDisplay = value.max == null ? maxDisplay : usdToDisplay(valueMaxUsd);

  const [tempMin, setTempMin] = useState(valueMinDisplay);
  const [tempMax, setTempMax] = useState(valueMaxDisplay);

  // Re-sync if the URL changes externally OR if the user flips
  // their display currency while the panel is closed.
  useEffect(() => {
    setTempMin(valueMinDisplay);
    setTempMax(valueMaxDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueMinDisplay, valueMaxDisplay, displayCurrency]);

  // Format helpers — use the user's display currency for labels.
  const formatDisplay = (d: number): string => formatPrice(d, displayCurrency);
  const formatUsdAsDisplay = (usd: number): string =>
    formatPrice(usdToDisplay(usd), displayCurrency);

  const presetLabel = (p: Preset): string => {
    if (p.min === 0 && p.max === 0) return "Free";
    if (p.min === 0) return `Under ${formatUsdAsDisplay(p.max)}`;
    if (p.max >= MAX_USD) return `${formatUsdAsDisplay(p.min)}+`;
    return `${formatUsdAsDisplay(p.min)} – ${formatUsdAsDisplay(p.max)}`;
  };

  const presetMatchesValue = (p: Preset) =>
    valueMinUsd === p.min && valueMaxUsd === p.max;

  const presetMatchesTemp = (p: Preset) => {
    const dMin = usdToDisplay(p.min);
    const dMax = usdToDisplay(p.max);
    return tempMin === dMin && tempMax === dMax;
  };

  const isActive = value.min != null || value.max != null;
  const matchedPreset = PRESETS.find(presetMatchesValue);
  const activeLabel = isActive
    ? matchedPreset
      ? matchedPreset.label === "Free"
        ? "Free"
        : presetLabel(matchedPreset)
      : `${formatDisplay(valueMinDisplay)} – ${formatDisplay(valueMaxDisplay)}`
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
                    setTempMin(usdToDisplay(p.min));
                    setTempMax(usdToDisplay(p.max));
                  }}
                  className={`inline-flex h-7 cursor-pointer items-center rounded-sm px-2.5 text-[13px] font-medium transition-colors ${
                    selected
                      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                      : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]"
                  }`}
                >
                  {presetLabel(p)}
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
              step={5}
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
            <span>{formatDisplay(tempMin)}</span>
            <span>{formatDisplay(tempMax)}</span>
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
