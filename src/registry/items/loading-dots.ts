import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildLoadingDotsItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("LoadingDots.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "loading-dots",
    type: "registry:ui",
    title: "Loading Dots",
    description:
      "Subtle three-dot loading animation for inline contexts where a spinner would feel heavy.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/LoadingDots.tsx",
        type: "registry:ui",
        target: "components/ui/LoadingDots.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["feedback"] },
  };
}
