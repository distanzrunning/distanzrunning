// src/lib/usStates.ts
//
// Canonical list of US states + DC, alphabetised. Used by the
// State filter on /races so the dropdown shows the full set
// regardless of which states currently have race data — picking
// "Wyoming" with zero races just shows an empty grid, but the
// option is there for when we add coverage. Hardcoded rather than
// pulled from a package — 51 strings doesn't justify a dependency
// and the list is stable.
//
// US_COUNTRY_NAME is what we set on the country filter when a
// state is picked. Must match the editorial team's canonical
// country string in Sanity — keep the two aligned if it ever
// changes.

export const US_COUNTRY_NAME = "United States";

export const US_STATES: readonly string[] = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
