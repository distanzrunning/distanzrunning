import type { RegistryItem } from "../schema";

// TODO: extract the actual `--ds-*` CSS variable block from
// src/app/globals.css (light + dark) and inline below. Until then,
// this item ships a placeholder so component items can declare it
// as a registryDependency and the index lists it.
const PLACEHOLDER_CSS = `/* Distanz Running design tokens

   This file is a placeholder. The full CSS variable set lives in
   the canonical globals.css at distanzrunning.com and will be
   inlined here in a follow-up commit.

   For now, copy the --ds-* variables from
   https://distanzrunning.com/admin/design-system/colours and
   https://distanzrunning.com/admin/design-system/typography
   into your own globals.css. */
`;

export async function buildTokensItem(): Promise<RegistryItem> {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tokens",
    type: "registry:style",
    title: "Distanz Running tokens",
    description:
      "CSS variables and Tailwind config for the Distanz Running design system. Required by every other item in this registry.",
    files: [
      {
        path: "styles/distanz-tokens.css",
        type: "registry:style",
        target: "app/distanz-tokens.css",
        content: PLACEHOLDER_CSS,
      },
    ],
    meta: { layer: "foundation" },
  };
}
