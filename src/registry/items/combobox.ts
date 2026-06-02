import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildComboboxItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Combobox.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "combobox",
    type: "registry:ui",
    title: "Combobox",
    description:
      "Searchable single-select. Text input filters a dropdown of matching options.",
    dependencies: ["react", "@radix-ui/react-popover"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Combobox.tsx",
        type: "registry:ui",
        target: "components/ui/Combobox.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
