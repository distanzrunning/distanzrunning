// src/lib/geocode.ts
//
// Server-side address forward-geocoding via Mapbox's Geocoding
// API. Used by the race detail page to turn an editor-typed
// expo address into a lng/lat the map can mark.
//
// Prefers MAPBOX_GEOCODING_TOKEN (a server-only secret token
// without URL restrictions) so the request isn't rejected as
// `Forbidden` by the public map token's allowlist. Falls back to
// NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN if the secret isn't set, which
// is fine in environments where the public token has no URL
// restrictions. The fetch caches with a 24-hour revalidate
// window: addresses change rarely, and the page's own ISR
// (revalidate = 60) means content edits surface within a minute
// regardless.

export interface GeocodeResult {
  lng: number;
  lat: number;
}

/** [minLng, minLat, maxLng, maxLat] — Mapbox feature bbox. */
export type CountryBounds = [number, number, number, number];

const MAPBOX_GEOCODE_REVALIDATE_SECONDS = 60 * 60 * 24;

export async function geocodeAddress(
  address: string | null | undefined,
): Promise<GeocodeResult | null> {
  if (!address) return null;
  const token =
    process.env.MAPBOX_GEOCODING_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;
  const trimmed = address.trim();
  if (!trimmed) return null;
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json` +
      `?access_token=${token}&limit=1`;
    const res = await fetch(url, {
      next: { revalidate: MAPBOX_GEOCODE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: Array<{ center?: [number, number] }>;
    };
    const center = data.features?.[0]?.center;
    if (!center || center.length < 2) return null;
    const [lng, lat] = center;
    if (typeof lng !== "number" || typeof lat !== "number") return null;
    return { lng, lat };
  } catch {
    return null;
  }
}

/** Forward-geocode a query to Mapbox's formatted place name
 *  ("Tokyo Big Sight, 3 Chome-11-1 Ariake, Koto City, Tokyo …").
 *  Used by the enrichment pipeline to resolve an expo ADDRESS from
 *  a venue name when the race site names the venue but doesn't
 *  print its address. Same token + caching model as
 *  geocodeAddress. */
export async function geocodePlaceName(
  query: string | null | undefined,
): Promise<string | null> {
  if (!query) return null;
  const token =
    process.env.MAPBOX_GEOCODING_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;
  const trimmed = query.trim();
  if (!trimmed) return null;
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json` +
      `?access_token=${token}&limit=1`;
    const res = await fetch(url, {
      next: { revalidate: MAPBOX_GEOCODE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: Array<{ place_name?: string }>;
    };
    return data.features?.[0]?.place_name ?? null;
  } catch {
    return null;
  }
}

/** Forward-geocode a country NAME to its bounding box (types=country),
 *  for the /races map's fit-the-whole-country camera. Same token +
 *  24h caching model as geocodeAddress. Returns null when the bbox is
 *  unusable — notably when it spans more than 180° of longitude (the
 *  USA's bbox wraps the antimeridian via Alaska's far islands, and
 *  fitting it would frame the whole world); callers fall back to
 *  fitting the marker set. */
export async function geocodeCountryBounds(
  name: string | null | undefined,
): Promise<CountryBounds | null> {
  if (!name) return null;
  const token =
    process.env.MAPBOX_GEOCODING_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json` +
      `?access_token=${token}&types=country&limit=1`;
    const res = await fetch(url, {
      next: { revalidate: MAPBOX_GEOCODE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: Array<{ bbox?: number[] }>;
    };
    const bbox = data.features?.[0]?.bbox;
    if (!bbox || bbox.length < 4 || bbox.some((n) => typeof n !== "number"))
      return null;
    if (bbox[2] - bbox[0] > 180) return null;
    return [bbox[0], bbox[1], bbox[2], bbox[3]];
  } catch {
    return null;
  }
}
