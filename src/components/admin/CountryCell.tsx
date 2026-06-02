// Renders an ISO-3166 alpha-2 country code as the SVG flag (from
// `country-flag-icons` via the shared `getCountryFlag` helper) plus
// the code itself. Same flag treatment used on the /races filters
// so visual language stays consistent across the site.

import { getCountryFlag } from "@/lib/countryFlags";

interface CountryCellProps {
  iso: string | null;
}

export function CountryCell({ iso }: CountryCellProps) {
  if (!iso) {
    return <span style={{ color: "var(--ds-gray-700)" }}>—</span>;
  }
  const Flag = getCountryFlag(iso);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {Flag && (
        <Flag
          aria-hidden="true"
          style={{
            width: 18,
            height: 12,
            display: "block",
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      )}
      <span>{iso.toUpperCase()}</span>
    </span>
  );
}
