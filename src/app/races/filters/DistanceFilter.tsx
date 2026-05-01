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
const PANEL_WIDTH = 420;
const SLIDER_WIDTH = 380;
const KM_TO_MI = 0.621371;

interface Preset {
  label: string;
  /** Canonical km bounds — converted to display unit at render time. */
  min: number;
  max: number;
}

// Canonical race distances expressed in km, rounded to the 0.1
// precision the slider operates on. Each one round-trips cleanly
// to an integer/clean mi value (16.1 km = 10.0 mi, 21.1 km =
// 13.1 mi, etc) so picking a preset doesn't leave the user with
// a weird range like "9.9 mi – 10.6 mi". Single-point presets
// (point ranges where min === max) anchor the slider to the
// canonical distance; users can still drag the thumbs apart for
// custom windows. Ultra stays a range — the category itself is a
// distance band, not a single value.
const PRESETS: Preset[] = [
  { label: "5K", min: 5, max: 5 },
  { label: "10K", min: 10, max: 10 },
  { label: "10 Mile", min: 16.1, max: 16.1 },
  { label: "Half Marathon", min: 21.1, max: 21.1 },
  { label: "Marathon", min: 42.2, max: 42.2 },
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

  // 1-decimal rounding helper. Slider step=0.1 lands on values
  // like 3.0999999999 in IEEE 754 — round before storing in state
  // so equality checks against preset bounds are stable.
  const round1 = (n: number) => Math.round(n * 10) / 10;
  // Float-safe equality at 0.1 precision (multiply up + integer
  // compare). Used everywhere we ask "does this slider position
  // sit on a preset's bounds?".
  const eq = (a: number, b: number) => Math.round(a * 10) === Math.round(b * 10);

  // Slider operates in display units at 0.1 precision. MAX in mi
  // is the rounded equivalent of 100 km (62.1 mi); MIN is 0
  // either way.
  const maxDisplay = isImperial ? round1(MAX_KM * KM_TO_MI) : MAX_KM;
  const minDisplay = MIN_KM;

  const kmToDisplay = (km: number): number =>
    isImperial ? round1(km * KM_TO_MI) : round1(km);

  const displayToKm = (d: number): number =>
    isImperial ? round1(d / KM_TO_MI) : d;

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

  const presetToDisplay = (p: Preset) => ({
    min: kmToDisplay(p.min),
    max: kmToDisplay(p.max),
  });

  const presetMatches = (p: Preset) => {
    const d = presetToDisplay(p);
    return eq(tempMin, d.min) && eq(tempMax, d.max);
  };

  // For the chip label: if the active value sits exactly on a
  // preset's bounds, use the preset's name ("Half Marathon", "10K")
  // rather than the numeric range. Compares in display unit so the
  // imperial / metric round-trip lossiness doesn't break the match.
  const matchedPreset = PRESETS.find((p) => {
    const d = presetToDisplay(p);
    return eq(valueMinDisplay, d.min) && eq(valueMaxDisplay, d.max);
  });

  const isActive = value.min != null || value.max != null;
  const activeLabel = isActive
    ? matchedPreset
      ? matchedPreset.label
      : `${formatDistance(valueMinKm, units)} – ${formatDistance(valueMaxKm, units)}`
    : undefined;

  const handleClear = () => {
    onChange({ min: undefined, max: undefined });
  };

  const handleApply = (close: () => void) => {
    onChange({
      min: eq(tempMin, minDisplay) ? undefined : displayToKm(tempMin),
      max: eq(tempMax, maxDisplay) ? undefined : displayToKm(tempMax),
    });
    close();
  };

  const handleResetTemp = () => {
    setTempMin(minDisplay);
    setTempMax(maxDisplay);
  };

  return (
    <FilterChip
      label="Distance"
      activeLabel={activeLabel}
      onClear={handleClear}
      panelWidth={PANEL_WIDTH}
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

          {/* Slider in display units, 0.1 step so users can grab
              exact race distances (21.1 km / 13.1 mi / etc). */}
          <div className="px-1">
            <Slider
              range
              min={minDisplay}
              max={maxDisplay}
              step={0.1}
              value={[tempMin, tempMax]}
              onChange={([min, max]) => {
                // round1 to keep state on the 0.1 grid — float
                // drift would otherwise break preset-equality
                // checks against bounds like 3.1 mi.
                setTempMin(round1(min));
                setTempMax(round1(max));
              }}
              width={SLIDER_WIDTH}
            />
          </div>

          {/* Live readout in user's preferred unit. */}
          <div className="flex items-center justify-between text-[13px] text-[color:var(--ds-gray-900)]">
            <span>
              {tempMin.toFixed(1)}
              {isImperial ? "mi" : "km"}
            </span>
            <span>
              {tempMax.toFixed(1)}
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
