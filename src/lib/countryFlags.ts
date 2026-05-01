// src/lib/countryFlags.ts
//
// Country-name → ISO 3166-1 alpha-2 mapping plus a helper that
// returns the matching SVG flag component from `country-flag-icons`.
// Used by the Country filter on /races and any other surface that
// needs to display a flag next to a country name. Centralised here
// so the mapping is maintained in one place — the legacy version
// kept this inline in RaceGuidesClient.tsx.

import * as flags from "country-flag-icons/react/3x2";
import type { ComponentType, SVGProps } from "react";

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Country name (as stored in Sanity) → ISO 3166-1 alpha-2 code.
 *  Sub-national codes like "GB-SCT" are normalised to their parent
 *  country in getCountryFlag — we don't carry sub-national flag
 *  assets in the icon set. */
const COUNTRY_TO_CODE: Record<string, string> = {
  "United States": "US",
  USA: "US",
  "United Kingdom": "GB",
  UK: "GB",
  Germany: "DE",
  France: "FR",
  Spain: "ES",
  Italy: "IT",
  Netherlands: "NL",
  Belgium: "BE",
  Switzerland: "CH",
  Austria: "AT",
  Portugal: "PT",
  Greece: "GR",
  Japan: "JP",
  China: "CN",
  Australia: "AU",
  "New Zealand": "NZ",
  Canada: "CA",
  Mexico: "MX",
  Brazil: "BR",
  Argentina: "AR",
  "South Africa": "ZA",
  Kenya: "KE",
  Ethiopia: "ET",
  Morocco: "MA",
  Ireland: "IE",
  Scotland: "GB-SCT",
  Wales: "GB-WLS",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Poland: "PL",
  "Czech Republic": "CZ",
  Hungary: "HU",
  Turkey: "TR",
  India: "IN",
  Singapore: "SG",
  "Hong Kong": "HK",
  "South Korea": "KR",
  Thailand: "TH",
  Vietnam: "VN",
  Malaysia: "MY",
  Indonesia: "ID",
  Philippines: "PH",
  Taiwan: "TW",
  Russia: "RU",
  Ukraine: "UA",
  Israel: "IL",
  "United Arab Emirates": "AE",
  UAE: "AE",
  Qatar: "QA",
  "Saudi Arabia": "SA",
  Egypt: "EG",
  Chile: "CL",
  Colombia: "CO",
  Peru: "PE",
  Iceland: "IS",
  Luxembourg: "LU",
  Monaco: "MC",
};

/**
 * Returns the SVG flag component for a given country name, or
 * null when the country has no mapping (e.g. a new country we
 * haven't added yet). Sub-national codes fall back to the parent
 * country's flag.
 */
export function getCountryFlag(country: string): FlagComponent | null {
  const code = COUNTRY_TO_CODE[country];
  if (!code) return null;
  const flagCode = code.includes("-") ? code.split("-")[0] : code;
  const Flag = (flags as Record<string, FlagComponent>)[flagCode];
  return Flag ?? null;
}
