import { loadSource } from "../load";
import type { RegistryItem } from "../schema";

export async function buildNewsletterModalItem(): Promise<RegistryItem> {
  const source = await loadSource("src/components/ui/NewsletterModal.tsx");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "newsletter-modal",
    type: "registry:ui",
    title: "Newsletter Modal",
    description:
      "Modal-wrapped newsletter signup. Includes PostHog tracking and reCAPTCHA — swap consumer credentials.",
    dependencies: ["react", "next", "posthog-js", "react-google-recaptcha-v3"],
    registryDependencies: ["tokens", "button", "input", "modal"],
    files: [
      {
        path: "components/ui/NewsletterModal.tsx",
        type: "registry:ui",
        target: "components/ui/NewsletterModal.tsx",
        content: source,
      },
    ],
    meta: { layer: "organism", categories: ["forms"] },
  };
}
