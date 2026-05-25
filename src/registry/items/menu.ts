import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildMenuItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Menu.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "menu",
    type: "registry:ui",
    title: "Menu",
    description:
      "Floating menu with keyboard nav. The DS primitive for dropdowns, popovers, and overflow menus.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Menu.tsx",
        type: "registry:ui",
        target: "components/ui/Menu.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["navigation"] },
  };
}
