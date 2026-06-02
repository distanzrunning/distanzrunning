import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildIconButtonItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/IconButton.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "icon-button",
    type: "registry:ui",
    title: "Icon Button",
    description:
      "Square button optimised for a single icon. Hairline border, all DS sizes.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/IconButton.tsx",
        type: "registry:ui",
        target: "components/ui/IconButton.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["actions"] },
  };
}
