// src/sanity/theme.ts
//
// Distanz brand theme for Sanity Studio. Maps the project's --ds-*
// design tokens (defined in src/app/globals.css) into Sanity's
// legacy theme API. Sanity Studio has its own light/dark switch,
// independent of the public site's theme — values here are static
// hex equivalents of the DS tokens at their LIGHT-mode resolution
// (Sanity derives dark-mode tints).
//
// Coverage: brand accent + state colours + component surface +
// Geist sans/mono fonts so the editor type matches the rest of the
// admin. Studio's form-field anatomy (dropdowns, input heights)
// is owned by @sanity/ui and not customisable here — that's
// expected. This is layer 1 of the integration plan; deeper
// alignment would mean overriding studio.components (logo, navbar).

import { buildLegacyTheme } from "sanity";

const fontFamilyBase =
  '"Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const fontFamilyMonospace =
  '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace';

export const studioTheme = buildLegacyTheme({
  // Headline / brand accent — matches --ds-blue-700 (0070F3).
  "--brand-primary": "#0070F3",

  // Surfaces — match --ds-background-100 (white) and gray-1000 (text).
  "--white": "#FFFFFF",
  "--black": "#0A0A0A",
  "--component-bg": "#FFFFFF",
  "--component-text-color": "#171717",

  // Gray ramp.
  "--gray-base": "#171717",
  "--gray": "#666666",

  // Focus + state colours align with the DS palette.
  "--focus-color": "#0070F3",
  "--state-info-color": "#0070F3",
  "--state-success-color": "#1F8B4C",
  "--state-warning-color": "#F5A623",
  "--state-danger-color": "#EE0000",

  // Default button / nav defaults follow brand and gray ramp.
  "--default-button-color": "#666666",
  "--default-button-primary-color": "#0070F3",
  "--default-button-success-color": "#1F8B4C",
  "--default-button-warning-color": "#F5A623",
  "--default-button-danger-color": "#EE0000",

  "--main-navigation-color": "#FFFFFF",
  "--main-navigation-color--inverted": "#171717",

  // Type — same family as the rest of the admin.
  "--font-family-base": fontFamilyBase,
  "--font-family-monospace": fontFamilyMonospace,
});
