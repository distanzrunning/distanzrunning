import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildInputItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Input.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "input",
    type: "registry:ui",
    title: "Input",
    description:
      "Single-line text field. Supports prefix / suffix content, sizes, and error state.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Input.tsx",
        type: "registry:ui",
        target: "components/ui/Input.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
