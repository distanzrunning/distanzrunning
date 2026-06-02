import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildConsentContextItem(): Promise<RegistryItem> {
  const source = await loadSource("src/contexts/ConsentContext.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "consent-context",
    type: "registry:ui",
    title: "Consent Context",
    description:
      "Cookie-consent preference provider + useConsent hook. Required by Footer and any analytics gating.",
    dependencies: ["react"],
    registryDependencies: ["tokens"],
    files: [
      {
        path: "contexts/ConsentContext.tsx",
        type: "registry:ui",
        target: "contexts/ConsentContext.tsx",
        content: source,
      },
    ],
    meta: { layer: "atom", categories: ["context"] },
  };
}
