import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildToastItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/Toast.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "toast",
    type: "registry:ui",
    title: "Toast",
    description:
      "Stacked notification system with auto-dismiss, actions, and ARIA live regions.",
    dependencies: ["react", "react-dom"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/Toast.tsx",
        type: "registry:ui",
        target: "components/ui/Toast.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["feedback"] },
  };
}
