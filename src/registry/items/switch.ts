import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSwitchItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Switch.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "switch",
    type: "registry:ui",
    title: "Switch",
    description:
      "Toggle between two mutually-exclusive options. Pill-shaped chooser used for view modes.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "tooltip"],
    files: [
      {
        path: "components/ui/Switch.tsx",
        type: "registry:ui",
        target: "components/ui/Switch.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
