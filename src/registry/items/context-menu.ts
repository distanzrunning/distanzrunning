import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildContextMenuItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/ContextMenu.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "context-menu",
    type: "registry:ui",
    title: "Context Menu",
    description:
      "Right-click contextual menu. Built on Radix ContextMenu primitives.",
    dependencies: ["react", "@radix-ui/react-context-menu"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/ContextMenu.tsx",
        type: "registry:ui",
        target: "components/ui/ContextMenu.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["navigation"] },
  };
}
