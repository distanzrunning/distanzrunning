import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildDescriptionItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Description.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "description",
    type: "registry:ui",
    title: "Description",
    description:
      "Inline label / value pair list. For metadata rows in detail views.",
    dependencies: ["react", "@radix-ui/react-tooltip"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Description.tsx",
        type: "registry:ui",
        target: "components/ui/Description.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
