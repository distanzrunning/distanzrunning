import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCollapseItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Collapse.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "collapse",
    type: "registry:ui",
    title: "Collapse",
    description:
      "Expand/collapse disclosure with a header trigger and animated body.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Collapse.tsx",
        type: "registry:ui",
        target: "components/ui/Collapse.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["disclosure"] },
  };
}
