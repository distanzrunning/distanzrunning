import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildModalItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Modal.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "modal",
    type: "registry:ui",
    title: "Modal",
    description:
      "Centred overlay container with focus trap, backdrop, and dismissable header.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Modal.tsx",
        type: "registry:ui",
        target: "components/ui/Modal.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["overlay"] },
  };
}
