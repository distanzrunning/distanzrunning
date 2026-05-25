import { loadStyleAsset } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTokensItem(): Promise<RegistryItem> {
  const css = await loadStyleAsset("distanz-tokens.css");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tokens",
    type: "registry:style",
    title: "Distanz Running tokens",
    description:
      "CSS variables (--ds-*) for light and dark modes. Required by every other item in this registry — install this first.",
    files: [
      {
        path: "styles/distanz-tokens.css",
        type: "registry:style",
        target: "app/distanz-tokens.css",
        content: css,
      },
    ],
    meta: { layer: "foundation" },
  };
}
