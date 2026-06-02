import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildGridItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Grid.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "grid",
    type: "registry:ui",
    title: "Grid",
    description:
      "Layout primitive — `Grid` plus `GridCell` for guide-lined panel grids per the DS materials.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Grid.tsx",
        type: "registry:ui",
        target: "components/ui/Grid.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["layout"] },
  };
}
