import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildPanelCardItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("PanelCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "panel-card",
    type: "registry:ui",
    title: "Panel Card",
    description:
      "Bordered surface with optional title and action slot. The DS default container for grouped UI.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/PanelCard.tsx",
        type: "registry:ui",
        target: "components/ui/PanelCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["layout"] },
  };
}
