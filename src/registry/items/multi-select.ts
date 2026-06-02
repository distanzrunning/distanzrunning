import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildMultiSelectItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("MultiSelect.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "multi-select",
    type: "registry:ui",
    title: "Multi Select",
    description:
      "Multi-select form input. Chips plus dropdown plus keyboard navigation.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/MultiSelect.tsx",
        type: "registry:ui",
        target: "components/ui/MultiSelect.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
