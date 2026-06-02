import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildProjectBannerItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/ProjectBanner.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "project-banner",
    type: "registry:ui",
    title: "Project Banner",
    description:
      "Top-of-page banner for project-level announcements / status / featured content.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "components/ui/ProjectBanner.tsx",
        type: "registry:ui",
        target: "components/ui/ProjectBanner.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["display"] },
  };
}
