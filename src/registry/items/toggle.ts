import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildToggleItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Toggle.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "toggle",
    type: "registry:ui",
    title: "Toggle",
    description:
      "Two-state toggle button. Tactile press affordance and accessible labelling.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Toggle.tsx",
        type: "registry:ui",
        target: "components/ui/Toggle.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
