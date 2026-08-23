// src/sanity/schemaTypes/raceGuideType.ts

import { defineType, defineField } from "sanity";
import { PinIcon } from "@sanity/icons";

import { IOC_COUNTRY_OPTIONS } from "@/lib/iocCountries";

import LocationSearchInput from "../components/LocationSearchInput";

// IOC / IAAF 3-letter country codes used for course-record
// athletes. Shared across the four record-country fields
// (men, women, men's wheelchair, women's wheelchair) so we
// don't repeat the dropdown four times. The list itself lives in
// src/lib/iocCountries.ts so the enrichment pipeline can validate
// against the same codes without importing the Studio toolchain.
const RECORD_COUNTRY_OPTIONS = IOC_COUNTRY_OPTIONS;
export const raceGuideType = defineType({
  name: "raceGuide",
  title: "Race Guide",
  type: "document",
  icon: PinIcon,
  fieldsets: [
    {
      name: "dateRefresh",
      title: "Date Refresh (auto-scraped)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "enrichment",
      title: "Enrichment (auto-scraped)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "stateRegion",
      title: "State/Region",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Map location",
      type: "geopoint",
      description:
        "Drives the pin on the /races map view. Start typing a city or address and pick from the dropdown — the coordinates set instantly; the map below confirms the spot (click it to drag the pin, e.g. onto the start line). Bulk importers set it directly; races without it fall back to a server-side geocode of City/State/Country at render time.",
      // Inline type-ahead (Mapbox geocoding) above the stock map
      // preview — editors type-and-pick without opening the dialog.
      components: { input: LocationSearchInput },
    }),
    defineField({
      name: "eventDate",
      type: "datetime",
    }),
    defineField({
      name: "startTime",
      title: "Start time (race-local)",
      type: "string",
      description:
        'Local race start time, e.g. "09:10" or "8:00 AM". Stored as a plain string so the value is timezone-stable — eventDate stores UTC and shifts based on the editor\'s timezone, which is wrong for races abroad.',
    }),
    defineField({
      name: "mainImage",
      title: "Main Image (landscape)",
      type: "image",
      options: { hotspot: true },
      description:
        "Used on the homepage row, /races index card, and OG share image. Landscape (~3:2 / 16:9) framing recommended.",
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait Image (3:4)",
      type: "image",
      options: { hotspot: true },
      description:
        "Tall hero image rendered in the side panel of the race detail page. 3:4 portrait framing recommended; falls back to Main Image if not set.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description:
        "When this race guide was published (used for sorting breaking news)",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      description:
        "Editorial byline for the race guide write-up. Optional — leave empty for races without long-form content.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description:
        "A short summary of the race guide for previews (120–160 characters recommended)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "raceCategory",
      title: "Race Category",
      type: "reference",
      to: [{ type: "raceCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "distance",
      title: "Distance (km)",
      type: "number",
      description:
        "Exact race distance in kilometers (e.g., 42.195 for marathon, 21.0975 for half marathon)",
    }),
    defineField({
      name: "surface",
      title: "Surface",
      type: "string",
      options: {
        list: [
          { title: "Road", value: "Road" },
          { title: "Trail", value: "Trail" },
          { title: "Track", value: "Track" },
          { title: "Mountain", value: "Mountain" },
          { title: "Mixed", value: "Mixed" },
        ],
      },
    }),
    defineField({
      name: "surfaceBreakdown",
      title: "Surface Breakdown",
      type: "string",
      description: "Detailed surface composition of the course",
      options: {
        list: [
          { title: "100% Paved", value: "100% Paved" },
          { title: "Unpaved", value: "Unpaved" },
          { title: "Mixed", value: "Mixed" },
        ],
      },
    }),
    defineField({
      name: "profile",
      title: "Profile",
      type: "string",
      description:
        "Course elevation profile - consider both distance and net elevation when classifying",
      options: {
        list: [
          { title: "Flat", value: "flat" },
          { title: "Rolling", value: "rolling" },
          { title: "Hilly", value: "hilly" },
          { title: "Mountainous", value: "mountainous" },
        ],
      },
    }),
    defineField({
      name: "elevationGain",
      title: "Elevation Gain (meters)",
      type: "number",
    }),
    defineField({
      name: "elevationLoss",
      title: "Elevation Loss (meters)",
      type: "number",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Add multiple tags to categorize this race (e.g., "World Athletics Gold", "Major Marathon", "Fast Course")',
    }),
    defineField({
      name: "fieldSize",
      title: "Field Size",
      type: "number",
      description:
        'Total field size (capacity / number of runners). Drives the "Field size" stat tile on the race detail page.',
    }),
    defineField({
      name: "price",
      title: "Entry Price",
      type: "number",
      description: "Entry price in the local currency",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      description: "Currency of the entry price",
      options: {
        list: [
          { title: "USD - US Dollar", value: "USD" },
          { title: "EUR - Euro", value: "EUR" },
          { title: "GBP - British Pound", value: "GBP" },
          { title: "JPY - Japanese Yen", value: "JPY" },
          { title: "AUD - Australian Dollar", value: "AUD" },
          { title: "CAD - Canadian Dollar", value: "CAD" },
          { title: "CHF - Swiss Franc", value: "CHF" },
          { title: "CNY - Chinese Yuan", value: "CNY" },
          { title: "SEK - Swedish Krona", value: "SEK" },
          { title: "DKK - Danish Krone", value: "DKK" },
          { title: "NZD - New Zealand Dollar", value: "NZD" },
          { title: "MXN - Mexican Peso", value: "MXN" },
          { title: "SGD - Singapore Dollar", value: "SGD" },
          { title: "HKD - Hong Kong Dollar", value: "HKD" },
          { title: "NOK - Norwegian Krone", value: "NOK" },
          { title: "KRW - South Korean Won", value: "KRW" },
          { title: "TRY - Turkish Lira", value: "TRY" },
          { title: "INR - Indian Rupee", value: "INR" },
          { title: "BRL - Brazilian Real", value: "BRL" },
          { title: "ZAR - South African Rand", value: "ZAR" },
          { title: "THB - Thai Baht", value: "THB" },
          { title: "QAR - Qatari Riyal", value: "QAR" },
        ],
      },
      initialValue: "USD",
    }),
    defineField({
      name: "altitude",
      title: "Altitude (metres above sea level)",
      type: "number",
      description:
        'Course altitude in metres above sea level. Drives the "Altitude" stat tile on the race detail page; used to derive a label (Sea level / Highland / Mountain) automatically.',
    }),
    defineField({
      name: "humidity",
      title: "Average Humidity (%)",
      type: "number",
      description:
        'Average relative humidity at race time, 0–100. Drives the "Humidity" stat tile; auto-labelled Dry / Moderate / Humid.',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "averageTemperature",
      title: "Average Temperature (°C)",
      type: "number",
    }),
    defineField({
      name: "mensCourseRecord",
      title: "Men's Course Record",
      type: "string",
      description: "Format: HH:MM:SS",
    }),
    defineField({
      name: "mensCourseRecordAthlete",
      title: "Men's Course Record Athlete",
      type: "string",
      description: "Name of the athlete who holds the men's course record",
    }),
    defineField({
      name: "mensCourseRecordCountry",
      title: "Men's Course Record Country",
      type: "string",
      description: "Country of the athlete",
      options: {
        list: [...RECORD_COUNTRY_OPTIONS],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "womensCourseRecord",
      title: "Women's Course Record",
      type: "string",
      description: "Format: HH:MM:SS",
    }),
    defineField({
      name: "womensCourseRecordAthlete",
      title: "Women's Course Record Athlete",
      type: "string",
      description: "Name of the athlete who holds the women's course record",
    }),
    defineField({
      name: "womensCourseRecordCountry",
      title: "Women's Course Record Country",
      type: "string",
      description: "Country of the athlete",
      options: {
        list: [...RECORD_COUNTRY_OPTIONS],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "mensWheelchairCourseRecord",
      title: "Men's Wheelchair Course Record",
      type: "string",
      description: "Format: HH:MM:SS",
    }),
    defineField({
      name: "mensWheelchairCourseRecordAthlete",
      title: "Men's Wheelchair Course Record Athlete",
      type: "string",
      description:
        "Name of the athlete who holds the men's wheelchair course record",
    }),
    defineField({
      name: "mensWheelchairCourseRecordCountry",
      title: "Men's Wheelchair Course Record Country",
      type: "string",
      description: "Country of the athlete",
      options: {
        list: [...RECORD_COUNTRY_OPTIONS],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "womensWheelchairCourseRecord",
      title: "Women's Wheelchair Course Record",
      type: "string",
      description: "Format: HH:MM:SS",
    }),
    defineField({
      name: "womensWheelchairCourseRecordAthlete",
      title: "Women's Wheelchair Course Record Athlete",
      type: "string",
      description:
        "Name of the athlete who holds the women's wheelchair course record",
    }),
    defineField({
      name: "womensWheelchairCourseRecordCountry",
      title: "Women's Wheelchair Course Record Country",
      type: "string",
      description: "Country of the athlete",
      options: {
        list: [...RECORD_COUNTRY_OPTIONS],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "officialWebsite",
      title: "Official Race Website",
      type: "url",
      description: "URL to the official race website",
    }),
    defineField({
      name: "gpxFile",
      title: "Route File (GeoJSON or GPX)",
      type: "file",
      description:
        "Upload the GeoJSON (.geojson, .json) or GPX (.gpx) file containing the race route coordinates. GeoJSON is preferred for better performance.",
      options: {
        accept: ".geojson,.json,.gpx",
      },
    }),
    defineField({
      name: "expoVenueName",
      title: "Expo Venue Name",
      type: "string",
      description:
        'Display name for the expo location, e.g. "Javits Center". Shown in the marker popup on the race map.',
    }),
    defineField({
      name: "expoAddress",
      title: "Expo Address",
      type: "string",
      description:
        "Full street address of the race expo. Geocoded server-side via Mapbox to place the marker — give it a complete address (street, city, country) so the result is unambiguous.",
    }),
    defineField({
      name: "featuredRace",
      title: "Featured Race Guide",
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;

          const id = context.document?._id;
          if (!id) return true;

          const existing = await context
            .getClient({ apiVersion: "2021-10-21" })
            .fetch(
              `*[_type == "raceGuide" && featuredRace == true && _id != $id][0]._id`,
              { id },
            );

          return !existing || "Only one featured race guide is allowed.";
        }),
    }),
    defineField({
      name: "isBreaking",
      title: "Show in Breaking News Section",
      type: "boolean",
      initialValue: false,
      description: "Show this race guide in the homepage breaking news section",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "blockContent",
      description:
        "Leading paragraph(s) shown above the main body on the race detail page.",
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "suggestedNextDate",
      title: "Suggested Next Date",
      type: "datetime",
      fieldset: "dateRefresh",
      description:
        "Auto-scraped suggestion from the official website. Approve to copy into eventDate; reject to discard.",
      readOnly: true,
    }),
    defineField({
      name: "suggestedNextDateScrapedAt",
      title: "Scraped At",
      type: "datetime",
      fieldset: "dateRefresh",
      readOnly: true,
    }),
    defineField({
      name: "suggestedNextDateSourceQuote",
      title: "Source Quote",
      type: "text",
      fieldset: "dateRefresh",
      description: "Verbatim phrase the date was extracted from.",
      readOnly: true,
    }),
    defineField({
      name: "suggestedNextDateStatus",
      title: "Status",
      type: "string",
      fieldset: "dateRefresh",
      options: {
        list: [
          { title: "Pending review", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      description:
        'Editor sets this. "Approved" → manually copy suggestedNextDate into eventDate, then clear status to re-enable scraping.',
    }),
    defineField({
      name: "lastScanAt",
      title: "Last Scanned At",
      type: "datetime",
      fieldset: "dateRefresh",
      description:
        "Set on EVERY scan attempt (success or failure), so the row can show the scan history even when no suggestion was written.",
      readOnly: true,
    }),
    defineField({
      name: "lastScanLog",
      title: "Last Scan Log (JSON)",
      type: "text",
      fieldset: "dateRefresh",
      description:
        "JSON-encoded breakdown of the most recent scan: pages fetched, sources used, Haiku reasoning, confidence. Surfaced in the admin Date Review row expander.",
      readOnly: true,
    }),
    defineField({
      name: "wikipediaUrl",
      title: "Wikipedia Page",
      type: "url",
      fieldset: "enrichment",
      description:
        "The race's Wikipedia article (any language edition). Set it to pin the enrichment scanner to the right page; left empty, the scanner searches for a match and fills this in on first success.",
    }),
    defineField({
      name: "enrichmentSuggestions",
      title: "Suggestions",
      type: "array",
      fieldset: "enrichment",
      readOnly: true,
      description:
        "Auto-scraped field suggestions awaiting review. Managed by the admin Enrichment page — approve/reject there, not here.",
      of: [
        {
          type: "object",
          name: "enrichmentSuggestion",
          fields: [
            defineField({ name: "field", title: "Field", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Suggested Value", type: "string" }),
            defineField({
              name: "currentValue",
              title: "Value At Scan Time",
              type: "string",
            }),
            defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
            defineField({
              name: "sourceQuote",
              title: "Source Quote",
              type: "text",
            }),
            defineField({
              name: "confidence",
              title: "Confidence",
              type: "string",
              options: {
                list: [
                  { title: "High", value: "high" },
                  { title: "Medium", value: "medium" },
                ],
              },
            }),
            defineField({
              name: "scrapedAt",
              title: "Scraped At",
              type: "datetime",
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Pending review", value: "pending" },
                  { title: "Rejected", value: "rejected" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "enrichmentLastScanAt",
      title: "Last Enrichment Scan At",
      type: "datetime",
      fieldset: "enrichment",
      readOnly: true,
    }),
    defineField({
      name: "enrichmentLastScanLog",
      title: "Last Enrichment Scan Log (JSON)",
      type: "text",
      fieldset: "enrichment",
      description:
        "JSON-encoded breakdown of the most recent enrichment scan: language editions searched, candidate pages scored, page chosen, per-field outcomes. Surfaced in the admin Enrichment row expander.",
      readOnly: true,
    }),
  ],
});
