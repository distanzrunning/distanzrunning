import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NewsletterModalComponent from "../components/content/NewsletterModalComponent";

export const metadata: Metadata = { title: "Newsletter Modal" };

export default function NewsletterModalPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Newsletter Modal"
      pageSubtitle="Focused email sign-up dialog wired to Mailgun via /api/subscribe."
      mainSectionId="overview"
    >
      <NewsletterModalComponent />
    </ContentWithTOC>
  );
}
