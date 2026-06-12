import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildDrawerItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Drawer.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "drawer",
    type: "registry:ui",
    title: "Drawer",
    description:
      "Swipe-dismissable bottom sheet for small viewports. Used for filters, focused forms, and mobile actions.",
    dependencies: ["react", "@base-ui/react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Drawer.tsx",
        type: "registry:ui",
        target: "components/ui/Drawer.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["overlay"] },
  };
}
