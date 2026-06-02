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
      "Slide-out side panel. Used for filters, settings, and other side-of-screen content.",
    dependencies: ["react", "vaul"],
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
