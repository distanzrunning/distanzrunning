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
      "CSS variables (--ds-*) and typography utilities (text-heading-*, text-copy-*, text-button-*, text-label-*) for light and dark modes. Required by every other item in this registry — install this first, then add `@import \"./distanz-tokens.css\";` and `@import \"./distanz-utilities.css\";` to your app/globals.css.",
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
    meta: { layer: "foundation" },
  };
}
