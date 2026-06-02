import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildConsentBannerItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/ConsentBanner.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "consent-banner",
    type: "registry:ui",
    title: "Consent Banner",
    description:
      "Cookie consent banner with accept / reject / customise actions.",
    dependencies: ["react", "react-dom", "lucide-react"],
    registryDependencies: ["tokens", "button", "modal", "toggle"],
    files: [
      {
        path: "components/ui/ConsentBanner.tsx",
        type: "registry:ui",
        target: "components/ui/ConsentBanner.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["compliance"] },
  };
}
