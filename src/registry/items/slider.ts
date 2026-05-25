import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSliderItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Slider.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "slider",
    type: "registry:ui",
    title: "Slider",
    description:
      "Range input with track, thumb, and optional value label.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Slider.tsx",
        type: "registry:ui",
        target: "components/ui/Slider.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["forms"] },
  };
}
