import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildPaginationItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Pagination.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "pagination",
    type: "registry:ui",
    title: "Pagination",
    description:
      "Previous / next navigation. Optional centre slot for page indicator or status.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Pagination.tsx",
        type: "registry:ui",
        target: "components/ui/Pagination.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["navigation"] },
  };
}
