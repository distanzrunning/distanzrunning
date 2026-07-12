import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildNewsletterModalItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/NewsletterModal.tsx");
  const turnstile = await loadSource("src/components/ui/Turnstile.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "newsletter-modal",
    type: "registry:ui",
    title: "Newsletter Modal",
    description:
      "Modal-wrapped newsletter signup. Includes PostHog tracking and Cloudflare Turnstile — swap consumer credentials.",
    dependencies: ["react", "next", "posthog-js"],
    registryDependencies: ["tokens", "button", "input", "modal"],
    files: [
      {
        path: "components/ui/NewsletterModal.tsx",
        type: "registry:ui",
        target: "components/ui/NewsletterModal.tsx",
        content: source,
      },
      {
        path: "components/ui/Turnstile.tsx",
        type: "registry:ui",
        target: "components/ui/Turnstile.tsx",
        content: turnstile,
      },
    ],
    meta: { layer: "organism", categories: ["forms"] },
  };
}
