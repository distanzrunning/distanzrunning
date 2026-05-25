import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSpinnerItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Spinner.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "spinner",
    type: "registry:ui",
    title: "Spinner",
    description:
      "Indeterminate loading indicator. Sizing-aware — switches between 8-bar and 12-bar variants based on size.",
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Spinner.tsx",
        type: "registry:ui",
        target: "components/ui/Spinner.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["feedback"] },
  };
}
