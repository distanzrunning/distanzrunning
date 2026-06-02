import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCommandMenuItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/CommandMenu.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "command-menu",
    type: "registry:ui",
    title: "Command Menu",
    description:
      "Searchable command palette. Built on cmdk with keyboard navigation and grouped results.",
    dependencies: ["react", "cmdk"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/CommandMenu.tsx",
        type: "registry:ui",
        target: "components/ui/CommandMenu.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["navigation"] },
  };
}
