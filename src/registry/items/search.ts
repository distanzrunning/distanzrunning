import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSearchItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/Search.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "search",
    type: "registry:ui",
    title: "Search",
    description:
      "Algolia-backed site search wrapper around the Command Menu. Requires NEXT_PUBLIC_ALGOLIA_* env vars.",
    dependencies: ["react", "next", "lucide-react", "algoliasearch", "instantsearch.js", "react-instantsearch"],
    registryDependencies: ["tokens", "command-menu"],
    files: [
      {
        path: "components/Search.tsx",
        type: "registry:ui",
        target: "components/Search.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["navigation"] },
  };
}
