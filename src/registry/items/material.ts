import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildMaterialItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Material.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "material",
    type: "registry:ui",
    title: "Material",
    description:
      "Surface wrapper that applies the DS material treatment — radius and shadow per the Materials scale.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Material.tsx",
        type: "registry:ui",
        target: "components/ui/Material.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["layout"] },
  };
}
