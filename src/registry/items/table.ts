import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTableItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Table.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "table",
    type: "registry:ui",
    title: "Table",
    description:
      "Bordered data table with Table / TableHeader / TableRow / TableCell sub-exports.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Table.tsx",
        type: "registry:ui",
        target: "components/ui/Table.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["data"] },
  };
}
