import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSkeletonItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Skeleton.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "skeleton",
    type: "registry:ui",
    title: "Skeleton",
    description:
      "Loading placeholder. Supports width / height / shape props and can wrap children to hide them while loading.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Skeleton.tsx",
        type: "registry:ui",
        target: "components/ui/Skeleton.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["feedback"] },
  };
}
