"use client";

// src/app/races/filters/DistanceFilter.tsx
//
// Distance is stored in km in Sanity. We render the slider in km
// internally (so the values match the data layer) and only the
// readout flows through formatDistance() which respects the user's
// imperial/metric preference from UnitsContext.
//
// UX shape: preset chips + range slider + Apply/Reset footer.
// Preset chips snap the slider to the canonical distance windows
// runners tend to filter by; the slider gives fine-grained control
// for everything in between (e.g., "anything 30-50 km"). Temp
// values live inside the popover so dragging doesn't fire a server
// round-trip per pixel — committed on Apply.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";
import { formatDistance } from "@/lib/raceUtils";

const MIN_KM = 0;
const MAX_KM = 100;
const SLIDER_WIDTH = 288;

interface Preset {
  label: string;
  min: number;
  max: number;
}

const PRESETS: Preset[] = [
  { label: "5K", min: 5, max: 5 },
  { label: "10K", min: 10, max: 10 },
  { label: "Half", min: 21, max: 22 },
  { label: "Marathon", min: 42, max: 43 },
  { label: "Ultra", min: 50, max: MAX_KM },
];

interface DistanceFilterProps {
  value: { min?: number; max?: number };
  onChange: (next: { min?: number; max?: number }) => void;
}

export default function DistanceFilter({
  value,
  onChange,
}: DistanceFilterProps) {
  const { units } = useUnits();

  const valueMin = value.min ?? MIN_KM;
  const valueMax = value.max ?? MAX_KM;

  const [tempMin, setTempMin] = useState(valueMin);
  const [tempMax, setTempMax] = useState(valueMax);

  // Re-sync if the URL changes externally (back/forward, reset all).
  useEffect(() => {
    setTempMin(valueMin);
    setTempMax(valueMax);
  }, [valueMin, valueMax]);

  const isActive = value.min != null || value.max != null;
  const activeLabel = isActive
    ? `${formatDistance(valueMin, units)} – ${formatDistance(valueMax, units)}`
    : undefined;

  const handleClear = () => {
    onChange({ min: undefined, max: undefined });
  };

  const handleApply = (close: () => void) => {
    onChange({
      min: tempMin === MIN_KM ? undefined : tempMin,
      max: tempMax === MAX_KM ? undefined : tempMax,
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(MIN_KM);
    setTempMax(MAX_KM);
  };

  const presetMatches = (preset: Preset) =>
    tempMin === preset.min && tempMax === preset.max;

  return (
    <FilterChip
      label="Distance"
      activeLabel={activeLabel}
      onClear={handleClear}
      panelWidth={320}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {/* Preset chips */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const selected = presetMatches(p);
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

          {/* Slider */}
          <div className="px-1">
            <Slider
              range
              min={MIN_KM}
              max={MAX_KM}
              value={[tempMin, tempMax]}
              onChange={([min, max]) => {
                setTempMin(min);
                setTempMax(max);
              }}
              width={SLIDER_WIDTH}
            />
          </div>

          {/* Live readout in user's preferred units */}
          <div className="flex items-center justify-between text-[13px] text-[color:var(--ds-gray-900)]">
            <span>{formatDistance(tempMin, units)}</span>
            <span>{formatDistance(tempMax, units)}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--ds-gray-300)] pt-3">
            <Button
              variant="tertiary"
              size="small"
              onClick={handleResetTemp}
              disabled={tempMin === MIN_KM && tempMax === MAX_KM}
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
