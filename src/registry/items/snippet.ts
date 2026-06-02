import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSnippetItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Snippet.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "snippet",
    type: "registry:ui",
    title: "Snippet",
    description:
      "Compact inline code block with one-click copy. Designed for command-line snippets.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "button"],
    files: [
      {
        path: "components/ui/Snippet.tsx",
        type: "registry:ui",
        target: "components/ui/Snippet.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display", "code"] },
  };
}
