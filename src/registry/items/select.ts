import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSelectItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Select.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "select",
    type: "registry:ui",
    title: "Select",
    description:
      "Single-select form input. Static dropdown of pre-defined options.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Select.tsx",
        type: "registry:ui",
        target: "components/ui/Select.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
