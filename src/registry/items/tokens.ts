import { loadStyleAsset } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTokensItem(): Promise<RegistryItem> {
  const [tokensCss, utilitiesCss] = await Promise.all([
    loadStyleAsset("distanz-tokens.css"),
    loadStyleAsset("distanz-utilities.css"),
  ]);
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tokens",
    type: "registry:style",
    title: "Distanz Running tokens",
    description:
      "CSS variables (--ds-*) and typography utilities (text-heading-*, text-copy-*, text-button-*, text-label-*) for light and dark modes. Required by every other item in this registry — install this first, then add `@import \"./distanz-tokens.css\";` and `@import \"./distanz-utilities.css\";` to your app/globals.css. Colour channels are HSL triplets — consume them as `hsl(var(--color-X))` / `hsla(var(--ds-X-value), α)`, never `rgb()`. BREAKING (v2): the old `--ds-*-rgb` companions were removed; replace `rgb(var(--color-` → `hsl(var(--color-` and `--ds-X-rgb` → `--ds-X-value` in any code installed before v2.",
    files: [
      {
        path: "styles/distanz-tokens.css",
        type: "registry:style",
        target: "app/distanz-tokens.css",
        content: tokensCss,
      },
      {
        path: "styles/distanz-utilities.css",
        type: "registry:style",
        target: "app/distanz-utilities.css",
        content: utilitiesCss,
      },
    ],
    meta: { layer: "foundation", version: "2.0.0" },
  };
}
