import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCardImageItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/CardImage.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "card-image",
    type: "registry:ui",
    title: "Card Image",
    description:
      "Sized, ratio-aware image wrapper used inside ArticleCard / RaceCard.",
    dependencies: ["react", "next"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/CardImage.tsx",
        type: "registry:ui",
        target: "components/ui/CardImage.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["display"] },
  };
}
