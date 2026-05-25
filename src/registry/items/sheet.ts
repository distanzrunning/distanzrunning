import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSheetItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Sheet.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "sheet",
    type: "registry:ui",
    title: "Sheet",
    description:
      "Bottom / side sheet built on Radix Dialog primitives.",
    dependencies: ["react", "@radix-ui/react-dialog"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Sheet.tsx",
        type: "registry:ui",
        target: "components/ui/Sheet.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["overlay"] },
  };
}
