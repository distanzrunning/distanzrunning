import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildNewsletterSignupItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/NewsletterSignup.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "newsletter-signup",
    type: "registry:ui",
    title: "Newsletter Signup",
    description:
      "Inline newsletter signup block — PostHog tracking + reCAPTCHA. Swap consumer credentials.",
    dependencies: ["react", "posthog-js", "react-google-recaptcha-v3"],
    registryDependencies: ["tokens", "button", "input"],
    files: [
      {
        path: "components/ui/NewsletterSignup.tsx",
        type: "registry:ui",
        target: "components/ui/NewsletterSignup.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["forms"] },
  };
}
