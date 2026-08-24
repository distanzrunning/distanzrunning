// src/lib/climate.ts
//
// Deterministic climate data for a race — no scraping, no LLM
// judgment call. Open-Meteo's keyless APIs answer two of the
// raceGuide schema's stat-tile fields directly from a coordinate:
//   - altitude    → the Elevation API (single point, meters)
//   - averageTemperature / humidity → the Archive (historical
//     weather) API, averaged across the target month over the last
//     5 complete calendar years at that point
//
// Both are free and require no API key, so — unlike the Wikipedia/
// Firecrawl/Mapbox sources — this one is never gated behind a
// missing env var.

const OPEN_METEO_TIMEOUT_MS = 8_000;

async function fetchOpenMeteoJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPEN_METEO_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Ground elevation at a point, in whole metres. Null on any
 *  failure (offline, out-of-range coordinates, timeout). */
export async function fetchElevation(
  lat: number,
  lng: number,
): Promise<number | null> {
  const data = (await fetchOpenMeteoJson(
    `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`,
  )) as { elevation?: number[] } | null;
  const value = data?.elevation?.[0];
  return typeof value === "number" ? Math.round(value) : null;
}

export interface ClimateNormals {
  /** Mean daily temperature, °C, rounded to one decimal. */
  averageTemperature: number;
  /** Mean relative humidity, %, rounded to the nearest whole. */
  humidity: number;
  /** How many day-samples fed the average (across all years) —
   *  surfaced so a thin sample can be treated with lower
   *  confidence by callers. */
  sampleDays: number;
}

const CLIMATE_YEARS_BACK = 5;

/** Average race-day weather at a point for a given calendar month
 *  (1–12), computed from the last CLIMATE_YEARS_BACK COMPLETE
 *  calendar years (never the current year — recent months can be
 *  missing days in the archive). When `day` is given, narrows each
 *  year's window to ±7 days around that month/day instead of the
 *  whole month, for a tighter estimate once an exact event date is
 *  known. Returns null only if every year's request failed —
 *  partial coverage (e.g. 4 of 5 years) still returns an average. */
export async function fetchClimateNormals(
  lat: number,
  lng: number,
  month: number,
  day?: number,
): Promise<ClimateNormals | null> {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: CLIMATE_YEARS_BACK },
    (_, i) => currentYear - CLIMATE_YEARS_BACK + i,
  );

  const windowFor = (year: number): { start: string; end: string } => {
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    if (day) {
      const center = new Date(Date.UTC(year, month - 1, day));
      const start = new Date(center);
      start.setUTCDate(start.getUTCDate() - 7);
      const end = new Date(center);
      end.setUTCDate(end.getUTCDate() + 7);
      return { start: iso(start), end: iso(end) };
    }
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0)); // last day of month
    return { start: iso(start), end: iso(end) };
  };

  const results = await Promise.all(
    years.map(async (year) => {
      const { start, end } = windowFor(year);
      const data = (await fetchOpenMeteoJson(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}` +
          `&start_date=${start}&end_date=${end}` +
          `&daily=temperature_2m_mean,relative_humidity_2m_mean&timezone=auto`,
      )) as {
        daily?: {
          temperature_2m_mean?: (number | null)[];
          relative_humidity_2m_mean?: (number | null)[];
        };
      } | null;
      return data?.daily ?? null;
    }),
  );

  const temps: number[] = [];
  const hums: number[] = [];
  for (const daily of results) {
    if (!daily) continue;
    for (const t of daily.temperature_2m_mean ?? []) {
      if (typeof t === "number") temps.push(t);
    }
    for (const h of daily.relative_humidity_2m_mean ?? []) {
      if (typeof h === "number") hums.push(h);
    }
  }
  if (temps.length === 0 || hums.length === 0) return null;

  return {
    averageTemperature:
      Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
    humidity: Math.round(hums.reduce((a, b) => a + b, 0) / hums.length),
    sampleDays: temps.length,
  };
}
