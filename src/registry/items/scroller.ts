import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildScrollerItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Scroller.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "scroller",
    type: "registry:ui",
    title: "Scroller",
    description:
      "Horizontal scrollable region with optional next / previous controls.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "button"],
    files: [
      {
        path: "components/ui/Scroller.tsx",
        type: "registry:ui",
        target: "components/ui/Scroller.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["layout"] },
  };
}
