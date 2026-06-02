import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildDestructiveActionModalItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("DestructiveActionModal.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "destructive-action-modal",
    type: "registry:ui",
    title: "Destructive Action Modal",
    description:
      "Type-to-confirm modal for destructive actions — delete, revoke, disconnect. Includes an optional red irreversibility band, loading state, and inline error.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "modal", "button", "input", "note", "error"],
    files: [
      {
        path: "components/ui/DestructiveActionModal.tsx",
        type: "registry:ui",
        target: "components/ui/DestructiveActionModal.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["overlay", "forms"] },
  };
}
