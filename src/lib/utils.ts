import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The Stride type scale ships as custom `text-heading-*` / `text-display-*` /
// `text-copy-*` / `text-label-*` utilities (tailwind.config.js addUtilities). Stock
// tailwind-merge can't classify those, so it lumps them into the text-COLOUR
// group — making cn("text-heading-24", "text-textDefault") a "conflict" that
// silently dropped the heading class. Register them as font-size classes so
// scale and colour merge independently (and scale still conflicts with
// scale, e.g. a caller's text-heading-16 overrides a default text-heading-20).
const isStrideTypeScale = (value: string) =>
  /^(heading|display|copy|label)-\d+$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isStrideTypeScale] }],
    },
  },
});

/**
 * Merge Tailwind classes with correct conflict resolution.
 * Used by the shadcn-pattern UI primitives.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
