import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildStatTileItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("StatTile.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "stat-tile",
    type: "registry:ui",
    title: "Stat Tile",
    description:
      "Dashboard stat cell — label, value, optional hint, optional trend pill. Designed to pack into a StatTileGroup with hairline dividers.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/StatTile.tsx",
        type: "registry:ui",
        target: "components/ui/StatTile.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display", "data"] },
  };
}
