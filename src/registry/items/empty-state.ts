import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildEmptyStateItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("EmptyState.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "empty-state",
    type: "registry:ui",
    title: "Empty State",
    description:
      "Friendly placeholder shown when a list, table, or search has no results.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/EmptyState.tsx",
        type: "registry:ui",
        target: "components/ui/EmptyState.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["feedback"] },
  };
}
