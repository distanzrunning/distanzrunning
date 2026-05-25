import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildAdSlotItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("AdSlot.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "ad-slot",
    type: "registry:ui",
    title: "Ad Slot",
    description:
      "Reserved-space placeholder for advertising units. Holds layout while creatives load.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/AdSlot.tsx",
        type: "registry:ui",
        target: "components/ui/AdSlot.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["layout", "advertising"] },
  };
}
