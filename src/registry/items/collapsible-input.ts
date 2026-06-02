import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCollapsibleInputItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("CollapsibleInput.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "collapsible-input",
    type: "registry:ui",
    title: "Collapsible Input",
    description:
      "Single-line input that expands into a longer multi-line form on focus.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/CollapsibleInput.tsx",
        type: "registry:ui",
        target: "components/ui/CollapsibleInput.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms", "disclosure"] },
  };
}
