"use client";

// src/app/races/filters/SurfaceFilter.tsx
//
// Single-select surface filter. Renders four surface options as
// a 2-column grid of choice cards inside the FilterChip — each
// card carries an inline SVG glyph that mirrors the surface
// character.
//
// Schema enum also includes "Mountain" but we don't expose it as
// a filter option — Mountain reads as a profile/terrain category
// and overlaps with the upcoming Elevation filter; surface here
// stays focused on the running underfoot (paved / dirt /
// synthetic / a mix).
//
// Picking a surface commits immediately and closes; clicking the
// same surface again deselects. The X on the chip itself clears.

import FilterChip from "@/components/ui/FilterChip";

interface SurfaceFilterProps {
  value?: string;
  onChange: (next: string | undefined) => void;
}

interface SurfaceOption {
  value: string;
  label: string;
  Icon: () => React.ReactElement;
}

// Inline SVG glyphs — kept tiny so the choice cards stay compact.
// All glyphs use currentColor so they inherit the card's
// foreground (gray-1000 unselected, background-100 selected).

const RoadIcon = () => (
  <svg
    width="72"
    height="24"
    viewBox="0 0 120 40"
    aria-hidden
    fill="none"
    stroke="currentColor"
  >
    <path d="M25 14 H95" strokeWidth="4" strokeLinecap="round" />
    <path d="M25 26 H95" strokeWidth="4" strokeLinecap="round" />
    <path
      d="M28 20 H92"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />
  </svg>
);

const TrailIcon = () => (
  <svg
    width="72"
    height="24"
    viewBox="0 0 120 40"
    aria-hidden
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M15 18 C 30 6, 50 6, 65 18 S 100 30, 105 22"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M15 26 C 30 14, 50 14, 65 26 S 100 38, 105 30"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const TrackIcon = () => (
  <svg
    width="72"
    height="24"
    viewBox="0 0 120 40"
    aria-hidden
    fill="none"
    stroke="currentColor"
  >
    <rect
      x="12"
      y="8"
      width="96"
      height="24"
      rx="12"
      ry="12"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const MixedIcon = () => (
  <svg
    width="72"
    height="24"
    viewBox="0 0 120 40"
    aria-hidden
    fill="none"
    stroke="currentColor"
  >
    {/* left side: road */}
    <path d="M15 14 H50" strokeWidth="3" strokeLinecap="round" />
    <path d="M15 26 H50" strokeWidth="3" strokeLinecap="round" />
    {/* right side: trail */}
    <path
      d="M65 18 C 75 12, 85 12, 95 18"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M65 26 C 75 20, 85 20, 95 26"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const SURFACES: SurfaceOption[] = [
  { value: "Road", label: "Road", Icon: RoadIcon },
  { value: "Trail", label: "Trail", Icon: TrailIcon },
  { value: "Track", label: "Track", Icon: TrackIcon },
  { value: "Mixed", label: "Mixed", Icon: MixedIcon },
];

export default function SurfaceFilter({
  value,
  onChange,
}: SurfaceFilterProps) {
  return (
    <FilterChip
      label="Surface"
      activeLabel={value}
      onClear={() => onChange(undefined)}
      panelWidth={280}
    >
      {({ close }) => (
        <div className="grid grid-cols-2 gap-2">
          {SURFACES.map(({ value: optValue, label, Icon }) => {
            const isSelected = optValue === value;
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(isSelected ? undefined : optValue);
                  close();
                }}
                className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-sm text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-[color:var(--ds-gray-1000)] text-[color:var(--ds-background-100)]"
                    : "bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-1000)] hover:bg-[color:var(--ds-gray-200)]"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </FilterChip>
  );
}
