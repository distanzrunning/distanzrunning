import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildNewsletterSignupItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/NewsletterSignup.tsx");
  const turnstile = await loadSource("src/components/ui/Turnstile.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "newsletter-signup",
    type: "registry:ui",
    title: "Newsletter Signup",
    description:
      "Inline newsletter signup block — PostHog tracking + Cloudflare Turnstile. Swap consumer credentials.",
    dependencies: ["react", "posthog-js"],
    registryDependencies: ["tokens", "button", "input"],
    files: [
      {
        path: "components/ui/NewsletterSignup.tsx",
        type: "registry:ui",
        target: "components/ui/NewsletterSignup.tsx",
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
