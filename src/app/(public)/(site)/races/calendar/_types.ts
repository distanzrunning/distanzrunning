// src/app/races/calendar/_types.ts
//
// Shared shape for the race-calendar feature. The calendar page fetches
// raceGuide documents with the projection in page.tsx and threads them
// through RaceCalendarClient → RaceEventPopup. This type mirrors that
// projection (co-located here, matching the [raceSlug]/_types.ts convention).
// Fields are optional except the identifiers the UI always dereferences.

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface RaceGuide {
  _id: string;
  title: string;
  slug: { current: string };
  city?: string;
  stateRegion?: string;
  country?: string;
  eventDate: string;
  mainImage?: SanityImageSource;
  distance?: number;
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  elevationLoss?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  tags?: string[];
  mensCourseRecord?: string;
  mensCourseRecordAthlete?: string;
  mensCourseRecordCountry?: string;
  womensCourseRecord?: string;
  womensCourseRecordAthlete?: string;
  womensCourseRecordCountry?: string;
  fieldSize?: number;
  officialWebsite?: string;
  gpxFile?: { asset?: { _id?: string; url?: string } };
  /** Projected alias: raceCategory->title */
  raceCategoryName?: string;
}
