"use client";

// src/app/races/filters/DistanceFilter.tsx
//
// Distance is stored in km in Sanity, but the slider operates in
// the user's preferred display unit (km or mi) so the thumb snaps
// to integer values they actually think in. URL stays canonical
// (km) — conversion happens at the boundary on Apply / read.
//
// UX shape: preset chips + range slider + Apply/Reset footer.
// Preset chips snap the slider to the canonical race-distance
// windows; the slider gives fine-grained control between them.
// Temp values live inside the popover so dragging doesn't fire
// a router.replace per pixel — committed on Apply only.

import { useEffect, useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useUnits } from "@/contexts/UnitsContext";
import { formatDistance } from "@/lib/raceUtils";

const MIN_KM = 0;
const MAX_KM = 100;
const SLIDER_WIDTH = 288;
const KM_TO_MI = 0.621371;

interface Preset {
  label: string;
  /** Canonical km bounds — converted to display unit at render time. */
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
  const isImperial = units === "imperial";

  // Slider operates in display units. MAX in mi is the integer
  // closest to 100 km (62 mi ≈ 100.0 km on round-trip). MIN is 0
  // either way.
  const maxDisplay = isImperial ? Math.round(MAX_KM * KM_TO_MI) : MAX_KM;
  const minDisplay = MIN_KM;

  const kmToDisplay = (km: number): number =>
    isImperial ? Math.round(km * KM_TO_MI) : Math.round(km);

  // When converting back to km for the URL we keep one decimal — a
  // 50 mi → 80.5 km round-trip resolves to 50 mi when read back.
  const displayToKm = (d: number): number =>
    isImperial ? Math.round((d / KM_TO_MI) * 10) / 10 : d;

  const valueMinKm = value.min ?? MIN_KM;
  const valueMaxKm = value.max ?? MAX_KM;
  const valueMinDisplay = kmToDisplay(valueMinKm);
  const valueMaxDisplay =
    value.max == null ? maxDisplay : kmToDisplay(valueMaxKm);

  const [tempMin, setTempMin] = useState(valueMinDisplay);
  const [tempMax, setTempMax] = useState(valueMaxDisplay);

  // Re-sync if the URL changes externally (back/forward, reset all)
  // OR if the user flips imperial / metric while the panel is closed.
  useEffect(() => {
    setTempMin(valueMinDisplay);
    setTempMax(valueMaxDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueMinDisplay, valueMaxDisplay, isImperial]);

  const isActive = value.min != null || value.max != null;
  const activeLabel = isActive
    ? `${formatDistance(valueMinKm, units)} – ${formatDistance(valueMaxKm, units)}`
    : undefined;

  const handleClear = () => {
    onChange({ min: undefined, max: undefined });
  };

  const handleApply = (close: () => void) => {
    onChange({
      min: tempMin === minDisplay ? undefined : displayToKm(tempMin),
      max: tempMax === maxDisplay ? undefined : displayToKm(tempMax),
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(minDisplay);
    setTempMax(maxDisplay);
  };

  const presetToDisplay = (p: Preset) => ({
    min: kmToDisplay(p.min),
    max: kmToDisplay(p.max),
  });

  const presetMatches = (p: Preset) => {
    const d = presetToDisplay(p);
    return tempMin === d.min && tempMax === d.max;
  };

  return (
    <FilterChip
      label="Distance"
      activeLabel={activeLabel}
      onClear={handleClear}
      panelWidth={320}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {/* Preset chips — centred so the row reads as a balanced
              cluster regardless of how many preset labels are
              visible. */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {PRESETS.map((p) => {
              const selected = presetMatches(p);
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

          {/* Slider in display units (km or mi, integer steps). */}
          <div className="px-1">
            <Slider
              range
              min={minDisplay}
              max={maxDisplay}
              step={1}
              value={[tempMin, tempMax]}
              onChange={([min, max]) => {
                setTempMin(min);
                setTempMax(max);
              }}
              width={SLIDER_WIDTH}
            />
          </div>

          {/* Live readout in user's preferred unit. */}
          <div className="flex items-center justify-between text-[13px] text-[color:var(--ds-gray-900)]">
            <span>
              {tempMin}
              {isImperial ? "mi" : "km"}
            </span>
            <span>
              {tempMax}
              {isImperial ? "mi" : "km"}
            </span>
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
