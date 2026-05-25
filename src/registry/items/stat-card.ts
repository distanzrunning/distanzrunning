import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildStatCardItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("StatCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "stat-card",
    type: "registry:ui",
    title: "Stat Card",
    description:
      "Label plus prominent value plus optional hint — the dashboard tile primitive.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/StatCard.tsx",
        type: "registry:ui",
        target: "components/ui/StatCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display", "data"] },
  };
}
