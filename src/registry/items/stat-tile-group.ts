import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildStatTileGroupItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("StatTileGroup.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "stat-tile-group",
    type: "registry:ui",
    title: "Stat Tile Group",
    description:
      "Packs StatTile children into one rounded bordered container with hairline internal dividers. The canonical connected-stats row / grid pattern.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "stat-tile"],
    files: [
      {
        path: "components/ui/StatTileGroup.tsx",
        type: "registry:ui",
        target: "components/ui/StatTileGroup.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display", "data", "layout"] },
  };
}
