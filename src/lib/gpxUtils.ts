/**
 * Utility functions for parsing GPX files and extracting elevation data
 */

export interface ElevationPoint {
  distance: number // in kilometers
  elevation: number // in meters
  lng: number
  lat: number
}

/**
 * Parse a GPX file and extract coordinates with elevation data
 */
export function parseGPXWithElevation(gpxText: string): {
  coordinates: [number, number][]
  elevations: number[]
} {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml')
  const coordinates: [number, number][] = []
  const elevations: number[] = []

  // Try to get track points (trkpt) first, then route points (rtept), then waypoints (wpt)
  const trackPoints = xmlDoc.getElementsByTagName('trkpt')
  const routePoints = xmlDoc.getElementsByTagName('rtept')
  const waypoints = xmlDoc.getElementsByTagName('wpt')

  const points = trackPoints.length > 0
    ? trackPoints
    : routePoints.length > 0
    ? routePoints
    : waypoints

  for (let i = 0; i < points.length; i++) {
    const lat = parseFloat(points[i].getAttribute('lat') || '0')
    const lon = parseFloat(points[i].getAttribute('lon') || '0')

    if (lat && lon) {
      coordinates.push([lon, lat]) // Mapbox uses [lng, lat] format

      // Extract elevation if available
      const eleElement = points[i].getElementsByTagName('ele')[0]
      const elevation = eleElement ? parseFloat(eleElement.textContent || '0') : 0
      elevations.push(elevation)
    }
  }

  return { coordinates, elevations }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371 // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Create elevation profile data from coordinates and elevations
 */
export function createElevationProfile(
  coordinates: [number, number][],
  elevations: number[],
  sampleInterval: number = 0.1 // Sample every 100 meters
): ElevationPoint[] {
  if (coordinates.length === 0 || elevations.length === 0) {
    return []
  }

  const elevationProfile: ElevationPoint[] = []
  let cumulativeDistance = 0
  let nextSampleDistance = 0

  for (let i = 0; i < coordinates.length; i++) {
    if (i > 0) {
      cumulativeDistance += calculateDistance(coordinates[i - 1], coordinates[i])
    }

    // Add point if we've reached the sample interval or it's the first/last point
    if (cumulativeDistance >= nextSampleDistance || i === 0 || i === coordinates.length - 1) {
      elevationProfile.push({
        distance: cumulativeDistance,
        elevation: elevations[i] || 0,
        lng: coordinates[i][0],
        lat: coordinates[i][1],
      })
      nextSampleDistance = cumulativeDistance + sampleInterval
    }
  }

  return elevationProfile
}

/**
 * Parse GeoJSON and extract coordinates with elevation data
 */
export function parseGeoJSONWithElevation(geoJsonText: string): {
  coordinates: [number, number][]
  elevations: number[]
} {
  const coordinates: [number, number][] = []
  const elevations: number[] = []

  try {
    const geoJson = JSON.parse(geoJsonText)

    // Handle FeatureCollection
    if (geoJson.type === 'FeatureCollection' && geoJson.features) {
      for (const feature of geoJson.features) {
        if (feature.geometry?.type === 'LineString' && feature.geometry.coordinates) {
          for (const coord of feature.geometry.coordinates) {
            if (coord.length >= 2) {
              coordinates.push([coord[0], coord[1]])
              // Extract elevation if available (third coordinate)
              elevations.push(coord.length >= 3 ? coord[2] : 0)
            }
          }
        }
      }
    }
    // Handle single Feature
    else if (geoJson.type === 'Feature' && geoJson.geometry?.type === 'LineString') {
      for (const coord of geoJson.geometry.coordinates) {
        if (coord.length >= 2) {
          coordinates.push([coord[0], coord[1]])
          elevations.push(coord.length >= 3 ? coord[2] : 0)
        }
      }
    }
    // Handle direct LineString
    else if (geoJson.type === 'LineString' && geoJson.coordinates) {
      for (const coord of geoJson.coordinates) {
        if (coord.length >= 2) {
          coordinates.push([coord[0], coord[1]])
          elevations.push(coord.length >= 3 ? coord[2] : 0)
        }
      }
    }
  } catch (error) {
    console.error('Error parsing GeoJSON:', error)
  }

  return { coordinates, elevations }
}

/**
 * SW [west, south] / NE [east, north] bounds box around a route's
 * coordinates. Matches the LngLatBoundsLike shape Mapbox accepts
 * directly via its Map constructor's `bounds` option.
 */
export type RouteBounds = [[number, number], [number, number]];

/** [lng, lat] coordinate. Matches Mapbox's LngLatLike tuple. */
export type RouteEndpoint = [number, number];

/**
 * Race-relevant POI types we render on the map. The set mirrors
 * Strava's race-day map glossary: nutrition / hydration / aid /
 * logistics. Anything else in the GeoJSON is dropped — race
 * directors who hand us files with custom Point types just see
 * those features ignored rather than rendered as a generic dot.
 */
export type RoutePoiType =
  | "aid_station"
  | "water"
  | "first_aid"
  | "drop_bag"
  | "cutoff"
  | "crew_access"
  | "photo"
  | "toilets"
  | "parking"
  | "hazard";

export interface RoutePoi {
  type: RoutePoiType;
  name: string | null;
  lng: number;
  lat: number;
}

export interface RouteAssets {
  elevation: ElevationPoint[];
  bounds: RouteBounds;
  start: RouteEndpoint;
  finish: RouteEndpoint;
  /**
   * The parsed GeoJSON FeatureCollection with Point features
   * stripped out (those are surfaced separately as `pois`).
   * Returned so the client can add the route source to Mapbox
   * without re-fetching the URL — saves one round-trip on first
   * paint. Costs ~20 KB of extra HTML payload for a marathon-
   * length route, which is dwarfed by the JS bundle anyway.
   */
  geoJson: GeoJSON.FeatureCollection;
  /**
   * Point features extracted from the GeoJSON, typed against
   * the supported RoutePoiType set. Each Point should carry
   * `properties.type` (one of the RoutePoiType values) and
   * optionally `properties.name`. Race directors bake these
   * into the GeoJSON they upload (option A in the design doc):
   * no separate Sanity field, the GeoJSON is the source of
   * truth.
   */
  pois: RoutePoi[];
}

/**
 * Server-safe variant: fetch a route asset, walk it once, and
 * return both the elevation profile and the bounding box. Used
 * by the race detail page to prefetch route data during SSR so
 * (a) the panel chart renders on first paint and (b) Mapbox can
 * initialize already framed on the route — no globe phase, no
 * fit-jump after load. Single fetch, single parse.
 *
 * GPX inputs are skipped (return null) because the GPX parser
 * relies on DOMParser, which isn't available in the Node runtime.
 * All current race uploads are GeoJSON FeatureCollections of
 * LineString features, so this covers the field today.
 */
export async function fetchRouteAssets(
  url: string | null | undefined,
): Promise<RouteAssets | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.trim().startsWith("{")) {
      // GPX format — needs a DOM parser, skip on the server.
      return null;
    }
    const { coordinates, elevations } = parseGeoJSONWithElevation(text);
    if (coordinates.length === 0) return null;
    const profile = createElevationProfile(coordinates, elevations);
    if (profile.length === 0) return null;
    const bounds = computeBounds(coordinates);
    if (!bounds) return null;
    const start = coordinates[0];
    const finish = coordinates[coordinates.length - 1];
    // Parse the GeoJSON once more for the client (parseGeoJSON-
    // WithElevation already parses internally but only returns
    // the extracted coords). Marginal cost (~5-15 ms for 100 KB)
    // vs saving a network round-trip on first paint. Then split
    // the FeatureCollection: Point features become typed POIs
    // for marker rendering; LineString features stay in the FC
    // for the route line layer to consume.
    const rawGeoJson = JSON.parse(text) as GeoJSON.FeatureCollection;
    const pois = extractPois(rawGeoJson);
    const geoJson: GeoJSON.FeatureCollection = {
      ...rawGeoJson,
      features: (rawGeoJson.features ?? []).filter(
        (f) => f.geometry?.type !== "Point",
      ),
    };
    return { elevation: profile, bounds, start, finish, geoJson, pois };
  } catch {
    return null;
  }
}

/**
 * Map a free-form type string from a Point feature's properties
 * to one of our supported RoutePoiType values, or null to skip.
 *
 * Real-world race GeoJSONs ship with at least two conventions:
 *   - snake_case:  "aid_station", "first_aid"
 *   - Title Case:  "Aid Station", "Water Source", "Distance Marker"
 *
 * We lowercase + collapse whitespace to underscores, then match
 * against a list of known aliases. Anything we don't recognise
 * (e.g. "Segment Start", "Distance Marker", "Generic", "Waypoint")
 * is dropped — race-relevant POIs only, and we already render
 * distance markers via the milestone toggle.
 */
function normalizeRoutePoiType(raw: unknown): RoutePoiType | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase().replace(/\s+/g, "_");
  switch (key) {
    case "aid_station":
    case "aidstation":
    case "aid":
      return "aid_station";
    case "water":
    case "water_source":
    case "watersource":
      return "water";
    case "first_aid":
    case "firstaid":
    case "medical":
      return "first_aid";
    case "drop_bag":
    case "dropbag":
      return "drop_bag";
    case "cutoff":
    case "cut_off":
      return "cutoff";
    case "crew_access":
    case "crew":
      return "crew_access";
    case "photo":
    case "photo_op":
    case "photoop":
    case "attraction":
      return "photo";
    case "toilets":
    case "toilet":
    case "restroom":
    case "restrooms":
      return "toilets";
    case "parking":
      return "parking";
    case "hazard":
    case "warning":
    case "danger":
      return "hazard";
    default:
      return null;
  }
}

function extractPois(fc: GeoJSON.FeatureCollection): RoutePoi[] {
  const pois: RoutePoi[] = [];
  for (const feature of fc.features ?? []) {
    if (feature.geometry?.type !== "Point") continue;
    const coords = feature.geometry.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) continue;
    const [lng, lat] = coords;
    if (typeof lng !== "number" || typeof lat !== "number") continue;
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    // Try `type` first, fall back to `sym` (the GPX/KML idiom
    // some exporters use) so we don't drop a marker just
    // because the source tool didn't write a `type` key.
    const normalized =
      normalizeRoutePoiType(props.type) ??
      normalizeRoutePoiType(props.sym);
    if (!normalized) continue;
    const rawName = typeof props.name === "string" ? props.name.trim() : "";
    const name = rawName.length > 0 ? rawName : null;
    pois.push({ type: normalized, name, lng, lat });
  }
  return pois;
}

function computeBounds(
  coordinates: [number, number][],
): RouteBounds | null {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of coordinates) {
    if (typeof lng !== "number" || typeof lat !== "number") continue;
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  if (minLng === Infinity) return null;
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

/**
 * Fetch and parse a route file (GPX or GeoJSON) from a URL, returning elevation profile data
 */
export async function fetchGPXElevationData(gpxUrl: string): Promise<ElevationPoint[]> {
  try {
    const response = await fetch(gpxUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch route file')
    }

    const fileText = await response.text()
    let coordinates: [number, number][]
    let elevations: number[]

    // Check if it's GeoJSON or GPX
    if (fileText.trim().startsWith('{')) {
      // Parse as GeoJSON
      const result = parseGeoJSONWithElevation(fileText)
      coordinates = result.coordinates
      elevations = result.elevations
    } else {
      // Parse as GPX
      const result = parseGPXWithElevation(fileText)
      coordinates = result.coordinates
      elevations = result.elevations
    }

    if (coordinates.length === 0) {
      return []
    }

    return createElevationProfile(coordinates, elevations)
  } catch (error) {
    console.error('Error fetching elevation data:', error)
    return []
  }
}

/**
 * Serialise the parsed route + POIs back out as a GPX 1.1
 * document, suitable for "Save GPX" downloads. Track points
 * preserve elevation when present; POI features become
 * waypoints with `<sym>` matching their type so importing
 * watches / apps can re-symbolise them. Pure string builder
 * — no DOM, runs anywhere.
 */
export function routeAssetsToGpx(opts: {
  geoJson: GeoJSON.FeatureCollection;
  pois: RoutePoi[];
  raceName: string;
}): string {
  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) => {
      switch (c) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&apos;";
        default:
          return c;
      }
    });

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<gpx version="1.1" creator="Distanz Running" xmlns="http://www.topografix.com/GPX/1/1">',
  );
  lines.push(`  <metadata><name>${escape(opts.raceName)}</name></metadata>`);

  for (const poi of opts.pois) {
    lines.push(`  <wpt lat="${poi.lat}" lon="${poi.lng}">`);
    if (poi.name) lines.push(`    <name>${escape(poi.name)}</name>`);
    lines.push(`    <sym>${escape(poi.type)}</sym>`);
    lines.push(`    <type>${escape(poi.type)}</type>`);
    lines.push(`  </wpt>`);
  }

  lines.push(`  <trk>`);
  lines.push(`    <name>${escape(opts.raceName)}</name>`);
  lines.push(`    <trkseg>`);
  for (const feature of opts.geoJson.features ?? []) {
    const geom = feature.geometry;
    if (!geom) continue;
    const pushPoint = (coord: number[]): void => {
      const [lng, lat, ele] = coord;
      if (typeof lng !== "number" || typeof lat !== "number") return;
      const eleTag = typeof ele === "number" ? `<ele>${ele}</ele>` : "";
      lines.push(`      <trkpt lat="${lat}" lon="${lng}">${eleTag}</trkpt>`);
    };
    if (geom.type === "LineString") {
      for (const coord of geom.coordinates) pushPoint(coord);
    } else if (geom.type === "MultiLineString") {
      for (const line of geom.coordinates) for (const c of line) pushPoint(c);
    }
  }
  lines.push(`    </trkseg>`);
  lines.push(`  </trk>`);
  lines.push(`</gpx>`);
  return lines.join("\n");
}
