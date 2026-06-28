import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildFooterItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/Footer.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "footer",
    type: "registry:ui",
    title: "Footer",
    description:
      "Site-wide footer — links, social, theme switcher, consent management entry.",
    dependencies: ["react", "next", "react-icons"],
    registryDependencies: ["tokens", "logo", "theme-switcher", "dark-mode-provider"],
    files: [
      {
        path: "components/Footer.tsx",
        type: "registry:ui",
        target: "components/Footer.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["layout"] },
  };
}
