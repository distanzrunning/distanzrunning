import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTabsItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Tabs.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tabs",
    type: "registry:ui",
    title: "Tabs",
    description:
      "Tab list with content panels. Supports keyboard navigation and lazy panel content.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "tooltip"],
    files: [
      {
        path: "components/ui/Tabs.tsx",
        type: "registry:ui",
        target: "components/ui/Tabs.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["navigation"] },
  };
}
