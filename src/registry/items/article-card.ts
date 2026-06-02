import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildArticleCardItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ArticleCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "article-card",
    type: "registry:ui",
    title: "Article Card",
    description:
      "Editorial article card — image + kicker + title + meta. Click-through entire surface.",
    dependencies: ["react", "next", "date-fns"],
    registryDependencies: ["tokens", "card-image"],
    files: [
      {
        path: "components/ArticleCard.tsx",
        type: "registry:ui",
        target: "components/ArticleCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
