import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildArticleCardItem(): Promise<RegistryItem> {
  // Load the SAME file the site renders (the drifted root copy this
  // replaced was deleted in plan 008); the components/ui/ target matches
  // the avatar/badge items so the card's @/components/ui/* imports
  // resolve on the consumer side.
  const source = await loadSource("src/components/ui/ArticleCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "article-card",
    type: "registry:ui",
    title: "Article Card",
    description:
      "The canonical editorial card — image, kicker, title, meta, optional author/badge slots; titles on the display type scale. Click-through entire surface.",
    dependencies: ["react", "next", "lucide-react"],
    registryDependencies: ["tokens", "avatar", "badge"],
    files: [
      {
        path: "components/ui/ArticleCard.tsx",
        type: "registry:ui",
        target: "components/ui/ArticleCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
