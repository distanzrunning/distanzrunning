import { loadComponentSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildRelativeTimeCardItem(): Promise<RegistryItem> {
  const source = await loadComponentSource("RelativeTimeCard.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "relative-time-card",
    type: "registry:ui",
    title: "Relative Time Card",
    description:
      "Hoverable timestamp that surfaces an absolute date in a context card on demand.",
    dependencies: ["react"],
    registryDependencies: ["tokens", "context-card"],
    files: [
      {
        path: "components/ui/RelativeTimeCard.tsx",
        type: "registry:ui",
        target: "components/ui/RelativeTimeCard.tsx",
        content: source,
      },
    ],
    meta: { layer: "molecule", categories: ["display"] },
  };
}
