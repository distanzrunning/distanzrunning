// src/lib/stravaRoute.ts
//
// Strava route geometry without auth (Plan 017, slice 3c).
//
// Strava's GPX export (strava.com/routes/<id>/export_gpx) is
// login-walled, but the public embed page the aggregators link to
// (strava-embeds.com/route/<id>) server-renders a
// `<script id="__ROUTE_DATA__">` JSON blob carrying the fully
// decoded route: `coordinates` as [lng, lat, ele] triples (~2,000+
// points for a marathon). That's everything needed to build the
// GeoJSON FeatureCollection the race page's gpxFile pipeline
// already prefers ("GeoJSON is preferred for better performance").

export interface StravaRouteGeometry {
  /** [lng, lat, ele] triples, in course order. */
  coordinates: [number, number, number][];
  distanceKm: number;
  /** Smoothed ascent/descent sums in metres (raw point noise
   *  overstates both, so a moving average runs first). */
  elevationGain: number;
  elevationLoss: number;
}

export function parseStravaRouteId(url: string): string | null {
  const direct = url.match(/strava\.com\/routes\/(\d+)/);
  if (direct) return direct[1];
  // strava.app.link shortlinks carry the real route URL in a
  // fallback_url query param (URL-encoded).
  const encoded = decodeURIComponent(url).match(/strava\.com\/routes\/(\d+)/);
  return encoded ? encoded[1] : null;
}

function haversineKm(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function smoothedGainLoss(elevations: number[]): {
  gain: number;
  loss: number;
} {
  if (elevations.length < 2) return { gain: 0, loss: 0 };
  const window = 5;
  const smoothed = elevations.map((_, i) => {
    const from = Math.max(0, i - Math.floor(window / 2));
    const to = Math.min(elevations.length, from + window);
    let sum = 0;
    for (let j = from; j < to; j++) sum += elevations[j];
    return sum / (to - from);
  });
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < smoothed.length; i++) {
    const d = smoothed[i] - smoothed[i - 1];
    if (d > 0) gain += d;
    else loss -= d;
  }
  return { gain: Math.round(gain), loss: Math.round(loss) };
}

export async function fetchStravaRoute(
  routeUrl: string,
): Promise<StravaRouteGeometry | null> {
  const id = parseStravaRouteId(routeUrl);
  if (!id) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    let html: string;
    try {
      const res = await fetch(`https://strava-embeds.com/route/${id}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        signal: controller.signal,
      });
      if (!res.ok) return null;
      html = await res.text();
    } finally {
      clearTimeout(timer);
    }
    const m = html.match(
      /<script id="__ROUTE_DATA__" type="application\/json">(.*?)<\/script>/s,
    );
    if (!m) return null;
    const data = JSON.parse(m[1]) as { coordinates?: unknown };
    if (!Array.isArray(data.coordinates) || data.coordinates.length < 2) {
      return null;
    }
    const coordinates: [number, number, number][] = [];
    for (const c of data.coordinates) {
      if (
        !Array.isArray(c) ||
        typeof c[0] !== "number" ||
        typeof c[1] !== "number"
      ) {
        return null;
      }
      coordinates.push([c[0], c[1], typeof c[2] === "number" ? c[2] : 0]);
    }
    let distanceKm = 0;
    for (let i = 1; i < coordinates.length; i++) {
      distanceKm += haversineKm(coordinates[i - 1], coordinates[i]);
    }
    const { gain, loss } = smoothedGainLoss(coordinates.map((c) => c[2]));
    return {
      coordinates,
      distanceKm,
      elevationGain: gain,
      elevationLoss: loss,
    };
  } catch {
    return null;
  }
}

/** The FeatureCollection shape the race page's gpxFile pipeline
 *  consumes (parseGeoJSONWithElevation reads LineString coords as
 *  [lng, lat, ele]). */
export function routeToGeoJson(
  route: StravaRouteGeometry,
  name: string,
): string {
  const feature = {
    type: "Feature",
    properties: { name },
    geometry: {
      type: "LineString",
      coordinates: route.coordinates.map(([lng, lat, ele]) => [
        Number(lng.toFixed(6)),
        Number(lat.toFixed(6)),
        Number(ele.toFixed(1)),
      ]),
    },
  };
  return JSON.stringify({ type: "FeatureCollection", features: [feature] });
}

/** Evenly downsample + Google-polyline-encode (precision 5) for the
 *  Mapbox Static Images path overlay — full routes overflow the URL. */
export function encodeRoutePolyline(
  coordinates: [number, number, number][],
  maxPoints = 200,
): string {
  const step = Math.max(1, Math.ceil(coordinates.length / maxPoints));
  const sampled: [number, number][] = [];
  for (let i = 0; i < coordinates.length; i += step) {
    sampled.push([coordinates[i][0], coordinates[i][1]]);
  }
  const last = coordinates[coordinates.length - 1];
  const tail = sampled[sampled.length - 1];
  if (tail[0] !== last[0] || tail[1] !== last[1]) {
    sampled.push([last[0], last[1]]);
  }

  let out = "";
  const encodeValue = (value: number) => {
    let v = value < 0 ? ~(value << 1) : value << 1;
    while (v >= 0x20) {
      out += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
      v >>= 5;
    }
    out += String.fromCharCode(v + 63);
  };
  let prevLat = 0;
  let prevLng = 0;
  for (const [lng, lat] of sampled) {
    const latE5 = Math.round(lat * 1e5);
    const lngE5 = Math.round(lng * 1e5);
    encodeValue(latE5 - prevLat);
    encodeValue(lngE5 - prevLng);
    prevLat = latE5;
    prevLng = lngE5;
  }
  return out;
}
