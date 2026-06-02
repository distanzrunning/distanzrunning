import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildStatusDotItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("StatusDot.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "status-dot",
    type: "registry:ui",
    title: "Status Dot",
    description:
      "Coloured dot indicator for status or presence.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/StatusDot.tsx",
        type: "registry:ui",
        target: "components/ui/StatusDot.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["status"] },
  };
}
