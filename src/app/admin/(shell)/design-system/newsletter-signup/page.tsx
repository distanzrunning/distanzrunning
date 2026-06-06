import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NewsletterSignupComponent from "../components/content/NewsletterSignupComponent";

export const metadata: Metadata = { title: "Newsletter Signup" };

export default function NewsletterSignupPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Newsletter Signup"
      pageSubtitle="Inline subscribe band wired to Mailgun via /api/subscribe. Forces dark or light theme on demand for inverted page sections."
      mainSectionId="overview"
    >
      <NewsletterSignupComponent />
    </ContentWithTOC>
  );
}
