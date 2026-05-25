import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NewsletterModalComponent from "../components/content/NewsletterModalComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Newsletter Modal" };

export default function NewsletterModalPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Newsletter Modal"
      pageSubtitle="Focused email sign-up dialog wired to Mailgun via /api/subscribe."
      mainSectionId="overview"
      headerRight={<RegistryInstallButtons slug="newsletter-modal" />}
    >
      <NewsletterModalComponent />
    </ContentWithTOC>
  );
}
