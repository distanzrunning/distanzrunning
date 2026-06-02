import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NewsletterSignupComponent from "../components/content/NewsletterSignupComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Newsletter Signup" };

export default function NewsletterSignupPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Newsletter Signup"
      pageSubtitle="Inline subscribe band wired to Mailgun via /api/subscribe. Forces dark or light theme on demand for inverted page sections."
      mainSectionId="overview"
      headerRight={<RegistryInstallButtons slug="newsletter-signup" />}
    >
      <NewsletterSignupComponent />
    </ContentWithTOC>
  );
}
