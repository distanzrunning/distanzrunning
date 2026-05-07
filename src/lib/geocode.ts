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
