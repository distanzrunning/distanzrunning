import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSplitButtonItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("SplitButton.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "split-button",
    type: "registry:ui",
    title: "Split Button",
    description:
      "Primary action paired with a dropdown trigger for secondary options.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/SplitButton.tsx",
        type: "registry:ui",
        target: "components/ui/SplitButton.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["actions"] },
  };
}
