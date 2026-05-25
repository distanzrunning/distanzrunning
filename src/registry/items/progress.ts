import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildProgressItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Progress.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "progress",
    type: "registry:ui",
    title: "Progress",
    description:
      "Linear progress bar. Supports determinate and indeterminate states.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Progress.tsx",
        type: "registry:ui",
        target: "components/ui/Progress.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["feedback"] },
  };
}
