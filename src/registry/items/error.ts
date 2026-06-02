import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildErrorItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Error.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "error",
    type: "registry:ui",
    title: "Error",
    description:
      "Error banner with title, body, and optional action. Use for blocking or page-level failures.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Error.tsx",
        type: "registry:ui",
        target: "components/ui/Error.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["feedback"] },
  };
}
