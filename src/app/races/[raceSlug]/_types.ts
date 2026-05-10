// src/app/races/[raceSlug]/_types.ts
//
// Shared types for the race-detail page. RaceGuideMeta lives at
// the page-folder level (underscore-prefixed) so the page entry
// (page.tsx, server component), the shell layout
// (RaceGuideShell.tsx, client), and the editorial panel
// (RaceGuidePanel.tsx, client) can all import the same shape
// without one component reaching into another.

import type { PortableTextBlock } from "@portabletext/react";

export interface RaceGuideMeta {
  _id: string;
  title: string;
  slug?: string;
  eventDate?: string;
  startTime?: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  category?: string;
  distance?: number;
  surface?: string;
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  elevationLoss?: number;
  altitude?: number;
  humidity?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  fieldSize?: number;
  expoVenueName?: string;
  expoAddress?: string;
  mensCourseRecord?: string;
  mensCourseRecordAthlete?: string;
  mensCourseRecordCountry?: string;
  womensCourseRecord?: string;
  womensCourseRecordAthlete?: string;
  womensCourseRecordCountry?: string;
  mensWheelchairCourseRecord?: string;
  mensWheelchairCourseRecordAthlete?: string;
  mensWheelchairCourseRecordCountry?: string;
  womensWheelchairCourseRecord?: string;
  womensWheelchairCourseRecordAthlete?: string;
  womensWheelchairCourseRecordCountry?: string;
  officialWebsite?: string;
  tags?: string[];
  introduction?: PortableTextBlock[];
  body?: PortableTextBlock[];
}
