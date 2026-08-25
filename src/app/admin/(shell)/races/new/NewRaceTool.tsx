"use client";

// src/app/admin/(shell)/races/new/NewRaceTool.tsx
//
// "Add race" tool (Plan 017, slice 3). Two-step flow:
//   1. Search — a race name (or a pasted Wikipedia URL) + optional
//      city/country hints, runs discoverRace() server-side.
//   2. Review — every discovered field lands in an EDITABLE form
//      (nothing is written yet); the editor confirms or corrects,
//      then "Create draft" writes an unpublished Sanity draft.
//
// After creation: the draft is immediately eligible for the
// Enrichment page's Scan button (start time / price / expo, once
// officialWebsite is set) — this tool deliberately doesn't read the
// official site itself, so the two tools' work never overlaps.

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MultiSelect, type MultiSelectItem } from "@/components/ui/MultiSelect";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { CURRENCY_OPTIONS } from "@/lib/currencies";
import type { RaceDiscoveryResult } from "@/lib/raceDiscovery";

import {
  createRaceDraft,
  runDiscovery,
  type CreateRaceDraftInput,
  type CreateRaceDraftResult,
} from "./actions";

// Mirror of KNOWN_RACE_TAGS in src/lib/raceAggregators.ts —
// duplicated (not imported) because that module instantiates the
// server-side Anthropic client at import time.
const KNOWN_TAG_ITEMS: MultiSelectItem[] = [
  "World Athletics Platinum Label",
  "World Athletics Gold Label",
  "World Athletics Elite Label",
  "World Athletics Label",
  "AIMS Member Race",
  "SuperHalfs",
  "Boston Marathon Qualifier",
  "Abbott World Marathon Major",
  "AbbottWMM Candidate",
  "AbbottWMM MTT Age Group Qualifiers",
  "Womans Only",
].map((t) => ({ value: t, label: t }));

const SURFACE_OPTIONS = ["Road", "Trail", "Track", "Mountain", "Mixed"];
const PROFILE_OPTIONS = ["flat", "rolling", "hilly", "mountainous"];

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type RecordFields = { time?: string; athlete?: string; country?: string };

interface DraftFormState {
  title: string;
  city: string;
  stateRegion: string;
  country: string;
  distance: string;
  officialWebsite: string;
  wikipediaUrl: string;
  tags: string[];
  raceCategoryId: string;
  lat: string;
  lng: string;
  altitude: string;
  averageTemperature: string;
  humidity: string;
  fieldSize: string;
  eventDate: string;
  startTime: string;
  price: string;
  currency: string;
  surface: string;
  profile: string;
  elevationGain: string;
  mensCourseRecord: RecordFields;
  womensCourseRecord: RecordFields;
  mensWheelchairCourseRecord: RecordFields;
  womensWheelchairCourseRecord: RecordFields;
}

const EMPTY_FORM: DraftFormState = {
  title: "",
  city: "",
  stateRegion: "",
  country: "",
  distance: "",
  officialWebsite: "",
  wikipediaUrl: "",
  tags: [],
  raceCategoryId: "",
  lat: "",
  lng: "",
  altitude: "",
  averageTemperature: "",
  humidity: "",
  fieldSize: "",
  eventDate: "",
  startTime: "",
  price: "",
  currency: "",
  surface: "",
  profile: "",
  elevationGain: "",
  mensCourseRecord: {},
  womensCourseRecord: {},
  mensWheelchairCourseRecord: {},
  womensWheelchairCourseRecord: {},
};

function formFromDiscovery(r: RaceDiscoveryResult): DraftFormState {
  return {
    title: r.title ?? "",
    city: r.city ?? "",
    stateRegion: "",
    country: r.country ?? "",
    distance: r.distance != null ? String(r.distance) : "",
    officialWebsite: r.officialWebsite ?? "",
    wikipediaUrl: r.wikipediaUrl ?? "",
    tags: r.tags ?? [],
    raceCategoryId: r.raceCategoryId ?? "",
    lat: r.location ? String(r.location.lat) : "",
    lng: r.location ? String(r.location.lng) : "",
    altitude: r.altitude != null ? String(r.altitude) : "",
    averageTemperature:
      r.averageTemperature != null ? String(r.averageTemperature) : "",
    humidity: r.humidity != null ? String(r.humidity) : "",
    fieldSize: r.fieldSize != null ? String(r.fieldSize) : "",
    eventDate: r.eventDate ?? "",
    startTime: r.startTime ?? "",
    price: r.price != null ? String(r.price) : "",
    currency: r.currency ?? "",
    surface: r.surface ?? "",
    profile: r.profile ?? "",
    elevationGain: r.elevationGain != null ? String(r.elevationGain) : "",
    mensCourseRecord: r.mensCourseRecord ?? {},
    womensCourseRecord: r.womensCourseRecord ?? {},
    mensWheelchairCourseRecord: r.mensWheelchairCourseRecord ?? {},
    womensWheelchairCourseRecord: r.womensWheelchairCourseRecord ?? {},
  };
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-heading-14 text-textDefault">{children}</span>
);

function RecordGroupFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RecordFields;
  onChange: (next: RecordFields) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-borderSubtle bg-surface p-3">
      <span className="text-copy-13 font-medium text-textDefault">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-2">
        <Input
          size="small"
          placeholder="H:MM:SS"
          value={value.time ?? ""}
          onChange={(e) => onChange({ ...value, time: e.target.value })}
        />
        <Input
          size="small"
          placeholder="Athlete"
          value={value.athlete ?? ""}
          onChange={(e) => onChange({ ...value, athlete: e.target.value })}
        />
        <Input
          size="small"
          placeholder="IOC (KEN)"
          maxLength={3}
          value={value.country ?? ""}
          onChange={(e) =>
            onChange({ ...value, country: e.target.value.toUpperCase() })
          }
        />
      </div>
    </div>
  );
}

export default function NewRaceTool({
  raceCategories,
}: {
  raceCategories: { id: string; title: string }[];
}) {
  const [query, setQuery] = useState("");
  const [cityHint, setCityHint] = useState("");
  const [countryHint, setCountryHint] = useState("");
  const [showHints, setShowHints] = useState(false);

  const [searching, startSearch] = useTransition();
  const [creating, startCreate] = useTransition();
  const { showToast, dismissToast } = useToast();

  const [discovery, setDiscovery] = useState<RaceDiscoveryResult | null>(null);
  const [form, setForm] = useState<DraftFormState>(EMPTY_FORM);
  const [created, setCreated] = useState<CreateRaceDraftResult | null>(null);

  const update = <K extends keyof DraftFormState>(
    key: K,
    value: DraftFormState[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchingToastId = showToast({
      message: `Searching for "${query.trim()}"…`,
      description: "Reading Wikipedia, geocoding, and pulling climate data. Usually 10–20 s.",
      preserve: true,
    });
    startSearch(async () => {
      try {
        const fd = new FormData();
        fd.set("query", query.trim());
        if (cityHint.trim()) fd.set("city", cityHint.trim());
        if (countryHint.trim()) fd.set("country", countryHint.trim());
        const result = await runDiscovery(fd);
        setDiscovery(result);
        setCreated(null);
        if (result.status === "found") {
          setForm(formFromDiscovery(result));
          showToast({
            message: `Found "${result.title}"`,
            description: "Review the prefilled fields below before creating.",
            variant: "success",
          });
        } else if (result.status === "already_exists") {
          showToast({
            message: result.message ?? "Race already exists",
            variant: "warning",
            preserve: true,
          });
        } else {
          setForm(EMPTY_FORM);
          showToast({
            message: result.message ?? "No match found",
            description: "Try a more specific name, add city/country hints, or paste a direct Wikipedia URL.",
            variant: "warning",
            preserve: true,
          });
        }
      } catch (err) {
        showToast({
          message: "Search failed",
          description: (err as Error).message,
          variant: "error",
          preserve: true,
        });
      } finally {
        dismissToast(searchingToastId);
      }
    });
  };

  const handleCreate = () => {
    if (!form.title.trim()) {
      showToast({ message: "Title is required", variant: "error" });
      return;
    }
    startCreate(async () => {
      try {
        const draft: CreateRaceDraftInput = {
          title: form.title.trim(),
          city: form.city.trim() || undefined,
          stateRegion: form.stateRegion.trim() || undefined,
          country: form.country.trim() || undefined,
          distance: form.distance ? Number(form.distance) : undefined,
          officialWebsite: form.officialWebsite.trim() || undefined,
          wikipediaUrl: form.wikipediaUrl.trim() || undefined,
          tags: form.tags.length > 0 ? form.tags : undefined,
          raceCategoryId: form.raceCategoryId || undefined,
          location:
            form.lat && form.lng
              ? { lat: Number(form.lat), lng: Number(form.lng) }
              : undefined,
          altitude: form.altitude ? Number(form.altitude) : undefined,
          averageTemperature: form.averageTemperature
            ? Number(form.averageTemperature)
            : undefined,
          humidity: form.humidity ? Number(form.humidity) : undefined,
          fieldSize: form.fieldSize ? Number(form.fieldSize) : undefined,
          eventDate: form.eventDate || undefined,
          startTime: form.startTime.trim() || undefined,
          price: form.price ? Number(form.price) : undefined,
          currency: form.currency || undefined,
          surface: form.surface || undefined,
          profile: form.profile || undefined,
          elevationGain: form.elevationGain
            ? Number(form.elevationGain)
            : undefined,
          mensCourseRecord: hasAny(form.mensCourseRecord)
            ? form.mensCourseRecord
            : undefined,
          womensCourseRecord: hasAny(form.womensCourseRecord)
            ? form.womensCourseRecord
            : undefined,
          mensWheelchairCourseRecord: hasAny(form.mensWheelchairCourseRecord)
            ? form.mensWheelchairCourseRecord
            : undefined,
          womensWheelchairCourseRecord: hasAny(
            form.womensWheelchairCourseRecord,
          )
            ? form.womensWheelchairCourseRecord
            : undefined,
        };
        const fd = new FormData();
        fd.set("draft", JSON.stringify(draft));
        const result = await createRaceDraft(fd);
        setCreated(result);
        showToast({
          message: `Draft created: "${draft.title}"`,
          description: draft.officialWebsite
            ? "Continue to Enrichment to scan the official site for start time, price, and expo details."
            : "No official website set — add one in Studio to unlock the Enrichment scan.",
          variant: "success",
        });
      } catch (err) {
        showToast({
          message: "Couldn't create draft",
          description: (err as Error).message,
          variant: "error",
          preserve: true,
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <section className="material-base flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <FieldLabel>Race name or Wikipedia URL</FieldLabel>
          <p className="m-0 text-copy-13 text-textSubtler">
            Type a race name to search Wikipedia, or paste a direct
            wikipedia.org article URL to skip search entirely.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="min-w-[280px] flex-1"
            placeholder="e.g. Rotterdam Marathon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button loading={searching} onClick={handleSearch}>
            Search
          </Button>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setShowHints((v) => !v)}
          >
            {showHints ? "Hide hints" : "Add city/country hints"}
          </Button>
        </div>
        {showHints && (
          <div className="flex flex-wrap gap-2">
            <Input
              size="small"
              placeholder="City hint (optional)"
              value={cityHint}
              onChange={(e) => setCityHint(e.target.value)}
            />
            <Input
              size="small"
              placeholder="Country hint (optional)"
              value={countryHint}
              onChange={(e) => setCountryHint(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Already exists */}
      {discovery?.status === "already_exists" && discovery.existingRace && (
        <section className="material-base flex items-center justify-between gap-4 p-5">
          <p className="m-0 text-copy-14 text-textDefault">
            &ldquo;{discovery.existingRace.title}&rdquo; already exists in
            Sanity.
          </p>
          {discovery.existingRace.slug && (
            <ButtonLink
              href={`/races/${discovery.existingRace.slug}`}
              target="_blank"
              variant="secondary"
              size="small"
              suffixIcon={<ExternalLink />}
            >
              View race guide
            </ButtonLink>
          )}
        </section>
      )}

      {/* Review + create */}
      {discovery?.status === "found" && !created && (
        <section className="material-base flex flex-col gap-6 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-heading-16 text-textDefault">
                Review before creating
              </span>
              {discovery.reasoning && (
                <p className="m-0 max-w-2xl text-copy-13 text-textSubtler">
                  {discovery.reasoning}
                </p>
              )}
            </div>
            {discovery.wikipediaUrl && (
              <a
                href={discovery.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-copy-13 text-link underline"
              >
                Source on Wikipedia <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>

          {discovery.warnings.length > 0 && (
            <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-copy-13 text-[color:var(--ds-amber-900)]">
              {discovery.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}

          {discovery.sourceNotes.length > 0 && (
            <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-copy-13 text-textSubtler">
              {discovery.sourceNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}

          {/* Identity */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
            <Input
              label="State / region (optional)"
              value={form.stateRegion}
              onChange={(e) => update("stateRegion", e.target.value)}
            />
            <Input
              label="Distance (km)"
              type="number"
              step="0.001"
              value={form.distance}
              onChange={(e) => update("distance", e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-copy-13 text-textSubtle">
                Race category
              </span>
              <Select
                size="medium"
                value={form.raceCategoryId}
                onChange={(e) => update("raceCategoryId", e.target.value)}
              >
                <option value="">— choose —</option>
                {raceCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              label="Official website"
              value={form.officialWebsite}
              onChange={(e) => update("officialWebsite", e.target.value)}
              className="sm:col-span-2"
            />
            {!form.eventDate && discovery.eventMonth && (
              <div className="flex flex-col justify-end gap-1.5 pb-2">
                <span className="text-copy-13 text-textSubtler">
                  Typically held in{" "}
                  <span className="text-textDefault">
                    {MONTH_NAMES[discovery.eventMonth]}
                  </span>{" "}
                  — set the exact event date below or in Studio.
                </span>
              </div>
            )}
          </div>

          {/* Event & course */}
          <div className="flex flex-col gap-2">
            <span className="text-heading-14 text-textDefault">
              Event &amp; course
            </span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-copy-13 text-textSubtle">
                  Event date
                  {discovery.eventDateStatus
                    ? ` (${discovery.eventDateStatus})`
                    : ""}
                </span>
                <Input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                />
              </div>
              <Input
                label="Start time (local)"
                placeholder="09:00"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
              <Input
                label="Entry price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-copy-13 text-textSubtle">Currency</span>
                <Select
                  size="medium"
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  <option value="">— choose —</option>
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-copy-13 text-textSubtle">Surface</span>
                <Select
                  size="medium"
                  value={form.surface}
                  onChange={(e) => update("surface", e.target.value)}
                >
                  <option value="">— choose —</option>
                  {SURFACE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-copy-13 text-textSubtle">Profile</span>
                <Select
                  size="medium"
                  value={form.profile}
                  onChange={(e) => update("profile", e.target.value)}
                >
                  <option value="">— choose —</option>
                  {PROFILE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                label="Elevation gain (m)"
                type="number"
                value={form.elevationGain}
                onChange={(e) => update("elevationGain", e.target.value)}
              />
            </div>
            {discovery.stravaRouteUrl && (
              <p className="m-0 text-copy-13 text-textSubtler">
                Course GPX: the route is on{" "}
                <a
                  href={discovery.stravaRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link underline"
                >
                  Strava
                </a>{" "}
                — export the GPX there and upload it to the draft in
                Studio.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-copy-13 text-textSubtle">Tags</span>
            <MultiSelect
              items={KNOWN_TAG_ITEMS}
              selected={form.tags}
              onChange={(next) => update("tags", next)}
              placeholder="Select tags…"
            />
          </div>

          {/* Course records */}
          <div className="flex flex-col gap-2">
            <span className="text-heading-14 text-textDefault">
              Course records
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <RecordGroupFields
                label="Men's"
                value={form.mensCourseRecord}
                onChange={(v) => update("mensCourseRecord", v)}
              />
              <RecordGroupFields
                label="Women's"
                value={form.womensCourseRecord}
                onChange={(v) => update("womensCourseRecord", v)}
              />
              <RecordGroupFields
                label="Men's wheelchair"
                value={form.mensWheelchairCourseRecord}
                onChange={(v) => update("mensWheelchairCourseRecord", v)}
              />
              <RecordGroupFields
                label="Women's wheelchair"
                value={form.womensWheelchairCourseRecord}
                onChange={(v) => update("womensWheelchairCourseRecord", v)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              label="Field size"
              type="number"
              value={form.fieldSize}
              onChange={(e) => update("fieldSize", e.target.value)}
            />
            <Input
              label="Altitude (m)"
              type="number"
              value={form.altitude}
              onChange={(e) => update("altitude", e.target.value)}
            />
            <Input
              label="Avg. temp (°C)"
              type="number"
              step="0.1"
              value={form.averageTemperature}
              onChange={(e) => update("averageTemperature", e.target.value)}
            />
            <Input
              label="Humidity (%)"
              type="number"
              value={form.humidity}
              onChange={(e) => update("humidity", e.target.value)}
            />
          </div>

          {form.lat && form.lng && (
            <p className="m-0 text-copy-13 text-textSubtler">
              Geocoded location: {form.lat}, {form.lng}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button loading={creating} onClick={handleCreate}>
              Create draft
            </Button>
            <span className="text-copy-13 text-textSubtler">
              Saved as an unpublished draft — nothing goes live yet.
            </span>
          </div>
        </section>
      )}

      {/* Success */}
      {created && (
        <section className="material-base flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2">
            <Badge variant="green-subtle" size="sm">
              Draft created
            </Badge>
            <span className="text-copy-14 text-textDefault">
              {form.title}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink
              href={`/admin/studio/structure/raceGuide;${created.id}`}
              variant="secondary"
              size="small"
            >
              Edit in Studio
            </ButtonLink>
            <ButtonLink href="/admin/races/enrichment" size="small">
              Continue to Enrichment
            </ButtonLink>
            <Button
              variant="tertiary"
              size="small"
              onClick={() => {
                setDiscovery(null);
                setCreated(null);
                setForm(EMPTY_FORM);
                setQuery("");
              }}
            >
              Add another race
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function hasAny(rec: RecordFields): boolean {
  return Boolean(rec.time || rec.athlete || rec.country);
}
