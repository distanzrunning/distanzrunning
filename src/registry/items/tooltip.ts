import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTooltipItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Tooltip.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tooltip",
    type: "registry:ui",
    title: "Tooltip",
    description:
      "Pointer-on-hover popover. Used to surface concise descriptions for icon-only triggers.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Tooltip.tsx",
        type: "registry:ui",
        target: "components/ui/Tooltip.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["overlay"] },
  };
}
