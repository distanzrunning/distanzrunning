"use client";

// src/app/races/filters/TemperatureFilter.tsx
//
// Range filter for the average race-day temperature
// (averageTemperature in Sanity, stored as Celsius). URL keeps
// Celsius canonical; the slider operates in the user's display
// unit (°C metric / °F imperial) for UX, converting at the
// boundary on Apply / read.
//
// Four named presets cover the typical race-day spectrum:
//   Cold   -10 –  10 °C (~14 –  50 °F)
//   Mild    10 –  18 °C ( 50 –  64 °F)
//   Warm    18 –  25 °C ( 64 –  77 °F)
//   Hot     25 –  45 °C ( 77 – 113 °F)
//
// The chip's active label uses the preset name when the value
// matches one, otherwise a "X° – Y° u" range.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";

const MIN_C = -10;
const MAX_C = 45;
const PANEL_WIDTH = 420;
const SLIDER_WIDTH = 380;

interface Preset {
  label: string;
  /** Canonical Celsius bounds. */
  min: number;
  max: number;
  /** 0-100 — how filled the temperature-gauge bar should be. */
  fill: number;
  /** Bar fill colour. Hex literals because the cold→hot
   *  thermometer ramp doesn't map cleanly onto our DS hues
   *  (no orange, and "warm pink" doesn't read as temperature).
   *  Same palette the legacy filter used. */
  color: string;
}

const PRESETS: Preset[] = [
  { label: "Cold", min: -10, max: 10, fill: 25, color: "#60A5FA" },
  { label: "Mild", min: 10, max: 18, fill: 50, color: "#FCD34D" },
  { label: "Warm", min: 18, max: 25, fill: 75, color: "#FB923C" },
  { label: "Hot", min: 25, max: MAX_C, fill: 100, color: "#EF4444" },
];

const cToF = (c: number) => c * (9 / 5) + 32;
const fToC = (f: number) => (f - 32) * (5 / 9);

interface TemperatureFilterProps {
  value: { min?: number; max?: number };
  onChange: (next: { min?: number; max?: number }) => void;
}

export default function TemperatureFilter({
  value,
  onChange,
}: TemperatureFilterProps) {
  const { units } = useUnits();
  const isImperial = units === "imperial";

  // Per-unit slider config. Imperial step=2 °F so the thumb lands
  // on integer Fahrenheit; metric step=1 °C.
  const step = isImperial ? 2 : 1;
  const minDisplay = isImperial ? Math.round(cToF(MIN_C) / step) * step : MIN_C;
  const maxDisplay = isImperial ? Math.round(cToF(MAX_C) / step) * step : MAX_C;

  const cToDisplay = (c: number): number =>
    isImperial ? Math.round(cToF(c) / step) * step : Math.round(c);

  const displayToC = (d: number): number =>
    isImperial ? Math.round(fToC(d)) : Math.round(d);

  const valueMinC = value.min ?? MIN_C;
  const valueMaxC = value.max ?? MAX_C;
  const valueMinDisplay = cToDisplay(valueMinC);
  const valueMaxDisplay = value.max == null ? maxDisplay : cToDisplay(valueMaxC);

  const [tempMin, setTempMin] = useState(valueMinDisplay);
  const [tempMax, setTempMax] = useState(valueMaxDisplay);

  // Re-sync if URL changes externally OR the user flips
  // imperial / metric while the panel is closed.
  useEffect(() => {
    setTempMin(valueMinDisplay);
    setTempMax(valueMaxDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueMinDisplay, valueMaxDisplay, isImperial]);

  const presetToDisplay = (p: Preset) => ({
    min: cToDisplay(p.min),
    max: cToDisplay(p.max),
  });

  const presetMatchesTemp = (p: Preset) => {
    const d = presetToDisplay(p);
    return tempMin === d.min && tempMax === d.max;
  };

  const matchedPreset = PRESETS.find((p) => {
    const d = presetToDisplay(p);
    return valueMinDisplay === d.min && valueMaxDisplay === d.max;
  });

  const unitSuffix = isImperial ? "°F" : "°C";
  const formatDisplay = (d: number): string => `${d}${unitSuffix}`;

  const isActive = value.min != null || value.max != null;
  const activeLabel = isActive
    ? matchedPreset
      ? matchedPreset.label
      : `${formatDisplay(valueMinDisplay)} – ${formatDisplay(valueMaxDisplay)}`
    : undefined;

  const handleClear = () => {
    onChange({ min: undefined, max: undefined });
  };

  const handleApply = (close: () => void) => {
    onChange({
      min: tempMin === minDisplay ? undefined : displayToC(tempMin),
      max: tempMax === maxDisplay ? undefined : displayToC(tempMax),
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(minDisplay);
    setTempMax(maxDisplay);
  };

  return (
    <FilterChip
      label="Temperature"
      activeLabel={activeLabel}
      onClear={handleClear}
      panelWidth={PANEL_WIDTH}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {/* Preset chips — label + temperature gauge underneath.
              Track uses --ds-gray-alpha-300 so it stays visible on
              both the unselected (gray-100) and selected
              (gray-1000) chip backgrounds in either theme. */}
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => {
              const selected = presetMatchesTemp(p);
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    const d = presetToDisplay(p);
                    setTempMin(d.min);
                    setTempMax(d.max);
                  }}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-medium transition-colors ${
                    selected
                      ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                      : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]"
                  }`}
                >
                  <span>{p.label}</span>
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-[color:var(--ds-gray-alpha-300)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.fill}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slider in display unit */}
          <div className="px-1">
            <Slider
              range
              min={minDisplay}
              max={maxDisplay}
              step={step}
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
