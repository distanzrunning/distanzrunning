import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCheckboxItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Checkbox.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description:
      "Binary form input. Supports indeterminate and disabled states.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Checkbox.tsx",
        type: "registry:ui",
        target: "components/ui/Checkbox.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
