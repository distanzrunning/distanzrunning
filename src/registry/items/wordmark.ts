import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildWordmarkItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Wordmark.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "wordmark",
    type: "registry:ui",
    title: "Wordmark",
    description:
      "Inline SVG of the Distanz Running wordmark.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Wordmark.tsx",
        type: "registry:ui",
        target: "components/ui/Wordmark.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["brand"] },
  };
}
