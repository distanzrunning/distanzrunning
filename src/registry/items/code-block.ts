import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildCodeBlockItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("CodeBlock.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "code-block",
    type: "registry:ui",
    title: "Code Block",
    description:
      "Syntax-highlighted code block with copy affordance and language label.",
    dependencies: ["react", "react-icons"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/CodeBlock.tsx",
        type: "registry:ui",
        target: "components/ui/CodeBlock.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display", "code"] },
  };
}
