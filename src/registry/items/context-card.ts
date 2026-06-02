import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildContextCardItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("ContextCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "context-card",
    type: "registry:ui",
    title: "Context Card",
    description:
      "Lightweight hover-card surface used to enrich inline references without leaving the page.",
    dependencies: ["react", "@radix-ui/react-hover-card"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/ContextCard.tsx",
        type: "registry:ui",
        target: "components/ui/ContextCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
