/**
 * Inline type-ahead input for the race "Map location" geopoint.
 *
 * The Google Maps plugin puts its search inside a click-to-open
 * dialog — an extra step every time (user call 2026-08-22: editors
 * should just start typing and pick from a dropdown). This wraps the
 * field with an ALWAYS-VISIBLE search box: Mapbox forward geocoding
 * (the same provider the public /races map and the server fallback
 * use, so results agree; CORS-friendly in the browser with the
 * public token) feeding Sanity UI's Autocomplete. Picking a
 * suggestion writes the geopoint immediately.
 *
 * Below the search sits the Google map preview as the visual
 * receipt, with its dialog as the drag-to-fine-tune path (e.g.
 * nudging the pin onto the start line). The plugin's GeopointInput
 * is rendered DIRECTLY here rather than registered as a plugin: its
 * form middleware intercepts every geopoint without calling
 * renderDefault, which sat above field-level components and
 * swallowed this search box (found the hard way, 2026-08-22).
 */

import {
  GeopointInput,
  type GeopointInputProps,
} from "@sanity/google-maps-input";
import { SearchIcon } from "@sanity/icons";
import { Autocomplete, Card, Stack, Text } from "@sanity/ui";
import { useCallback, useRef, useState } from "react";
import { set, type ObjectInputProps } from "sanity";

interface GeopointValue {
  _type?: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
}

interface Suggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

const MIN_QUERY_LENGTH = 2;

export default function LocationSearchInput(
  props: ObjectInputProps<GeopointValue>,
) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  // The Autocomplete hands back only the option's value string —
  // keep the latest suggestion set in a ref for the select lookup.
  const suggestionsRef = useRef<Suggestion[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const { onChange } = props;

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const handleQueryChange = useCallback(
    (query: string | null) => {
      abortRef.current?.abort();
      const trimmed = query?.trim() ?? "";
      if (!token || trimmed.length < MIN_QUERY_LENGTH) {
        suggestionsRef.current = [];
        setSuggestions([]);
        setLoading(false);
        return;
      }
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json` +
        `?access_token=${token}&limit=6&types=country,region,place,locality,address,poi`;
      fetch(url, { signal: ctrl.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then(
          (
            data: {
              features?: Array<{
                id: string;
                place_name: string;
                center: [number, number];
              }>;
            } | null,
          ) => {
            if (ctrl.signal.aborted) return;
            const next = (data?.features ?? [])
              .filter((f) => Array.isArray(f.center) && f.center.length >= 2)
              .map((f) => ({
                id: f.id,
                label: f.place_name,
                lng: f.center[0],
                lat: f.center[1],
              }));
            suggestionsRef.current = next;
            setSuggestions(next);
          },
        )
        .catch(() => {
          /* aborted or offline — leave the current list */
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    },
    [token],
  );

  const handleSelect = useCallback(
    (value: string) => {
      const picked = suggestionsRef.current.find((s) => s.id === value);
      if (!picked) return;
      onChange(set({ _type: "geopoint", lat: picked.lat, lng: picked.lng }));
    },
    [onChange],
  );

  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // The Google map preview + drag dialog when the key exists; the
  // stock lat/lng inputs otherwise.
  const mapInput = googleKey ? (
    <GeopointInput
      {...(props as unknown as Omit<GeopointInputProps, "geoConfig">)}
      geoConfig={{ apiKey: googleKey }}
    />
  ) : (
    props.renderDefault(props)
  );

  // Without the Mapbox token there is nothing to search with — fall
  // back to the map input alone.
  if (!token) return mapInput;

  return (
    <Stack space={3}>
      <Autocomplete
        id={`${props.id}-search`}
        icon={SearchIcon}
        placeholder="Search a city or address…"
        options={suggestions.map((s) => ({ value: s.id }))}
        loading={loading}
        onQueryChange={handleQueryChange}
        onSelect={handleSelect}
        // Option values are opaque Mapbox feature ids — the default
        // filter would match the query against them and drop
        // everything. The API already filtered.
        filterOption={() => true}
        renderOption={(option) => {
          const s = suggestionsRef.current.find(
            (item) => item.id === option.value,
          );
          return (
            <Card as="button" padding={3} radius={2}>
              <Text size={1} textOverflow="ellipsis">
                {s?.label ?? option.value}
              </Text>
            </Card>
          );
        }}
        // After a pick, show the human label in the input, not the id.
        renderValue={(value) =>
          suggestionsRef.current.find((s) => s.id === value)?.label ?? value
        }
      />
      {mapInput}
    </Stack>
  );
}
