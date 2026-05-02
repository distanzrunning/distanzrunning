"use client";

// src/app/races/filters/ElevationFilter.tsx
//
// Range elevation-gain filter. elevationGain is stored in meters
// in Sanity (canonical), URL keeps meters too. The slider operates
// in the user's display unit (m or ft) for UX, converting at the
// boundary on Apply / read.
//
// Four named presets cover the race-profile spectrum:
//   Flat           0 – 100 m  (~0 – 330 ft)
//   Rolling      100 – 300 m  (~330 – 1000 ft)
//   Hilly        300 – 600 m  (~1000 – 2000 ft)
//   Mountainous 600 – 3000 m  (~2000 – 9800 ft)
//
// Mountainous extends to the slider's max so ultras with >1000 m
// gain still match the preset rather than falling off the named
// scale. Custom ranges via the slider cover anything in between.
//
// The chip's active label uses the preset name when the value
// matches one, otherwise a "X – Y m/ft" range.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";

const MIN_M = 0;
const MAX_M = 3000;
const PANEL_WIDTH = 420;
const SLIDER_WIDTH = 380;
const M_TO_FT = 3.28084;

interface Preset {
  label: string;
  /** Canonical meter bounds. */
  min: number;
  max: number;
}

const PRESETS: Preset[] = [
  { label: "Flat", min: 0, max: 100 },
  { label: "Rolling", min: 100, max: 300 },
  { label: "Hilly", min: 300, max: 600 },
  { label: "Mountainous", min: 600, max: MAX_M },
];

interface ElevationFilterProps {
  value: { min?: number; max?: number };
  onChange: (next: { min?: number; max?: number }) => void;
}

export default function ElevationFilter({
  value,
  onChange,
}: ElevationFilterProps) {
  const { units } = useUnits();
  const isImperial = units === "imperial";

  // Per-unit slider bounds + step. Imperial step=100 ft so the
  // thumb lands on clean foot multiples; metric step=50 m so
  // it lands on clean meter multiples.
  const step = isImperial ? 100 : 50;
  const minDisplay = MIN_M;
  const maxDisplay = isImperial ? Math.round((MAX_M * M_TO_FT) / step) * step : MAX_M;

  const mToDisplay = (m: number): number =>
    isImperial ? Math.round((m * M_TO_FT) / step) * step : Math.round(m / step) * step;

  const displayToM = (d: number): number =>
    isImperial ? Math.round(d / M_TO_FT) : Math.round(d);

  const valueMinM = value.min ?? MIN_M;
  const valueMaxM = value.max ?? MAX_M;
  const valueMinDisplay = mToDisplay(valueMinM);
  const valueMaxDisplay = value.max == null ? maxDisplay : mToDisplay(valueMaxM);

  const [tempMin, setTempMin] = useState(valueMinDisplay);
  const [tempMax, setTempMax] = useState(valueMaxDisplay);

  // Re-sync if the URL changes externally OR the user flips
  // imperial / metric while the panel is closed.
  useEffect(() => {
    setTempMin(valueMinDisplay);
    setTempMax(valueMaxDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueMinDisplay, valueMaxDisplay, isImperial]);

  const presetToDisplay = (p: Preset) => ({
    min: mToDisplay(p.min),
    max: mToDisplay(p.max),
  });

  const presetMatchesTemp = (p: Preset) => {
    const d = presetToDisplay(p);
    return tempMin === d.min && tempMax === d.max;
  };

  // For the chip's active label: match against the actual URL
  // value (display-unit form) so the round-trip works regardless
  // of unit flips.
  const matchedPreset = PRESETS.find((p) => {
    const d = presetToDisplay(p);
    return valueMinDisplay === d.min && valueMaxDisplay === d.max;
  });

  const unitSuffix = isImperial ? "ft" : "m";
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
      min: tempMin === minDisplay ? undefined : displayToM(tempMin),
      max: tempMax === maxDisplay ? undefined : displayToM(tempMax),
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(minDisplay);
    setTempMax(maxDisplay);
  };

  return (
    <FilterChip
      label="Elevation"
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
                    const d = presetToDisplay(p);
                    setTempMin(d.min);
                    setTempMax(d.max);
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
