import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildBadgeItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Badge.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "badge",
    type: "registry:ui",
    title: "Badge",
    description:
      "Small status / category chip. Variants across the full DS hue scale plus subtle/solid styles.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Badge.tsx",
        type: "registry:ui",
        target: "components/ui/Badge.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["status"] },
  };
}
