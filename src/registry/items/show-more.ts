import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildShowMoreItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("ShowMore.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "show-more",
    type: "registry:ui",
    title: "Show More",
    description:
      "Reveal/collapse trigger that progressively discloses long content blocks.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "button"],
    files: [
      {
        path: "components/ui/ShowMore.tsx",
        type: "registry:ui",
        target: "components/ui/ShowMore.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["actions"] },
  };
}
