import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildTextareaItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("Textarea.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "textarea",
    type: "registry:ui",
    title: "Textarea",
    description:
      "Multi-line text input. Supports auto-grow and character counting.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Textarea.tsx",
        type: "registry:ui",
        target: "components/ui/Textarea.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["forms"] },
  };
}
