import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildSiteHeaderItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/SiteHeader.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "site-header",
    type: "registry:ui",
    title: "Site Header",
    description:
      "Site-wide top navigation header. Wordmark + nav + mobile-drawer trigger.",
    dependencies: ["react", "next", "lucide-react", "posthog-js"],
    registryDependencies: ["tokens", "button", "icon-button", "mobile-nav-drawer", "wordmark"],
    files: [
      {
        path: "components/ui/SiteHeader.tsx",
        type: "registry:ui",
        target: "components/ui/SiteHeader.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["navigation"] },
  };
}
