import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ConsentBannerComponent from "../components/content/ConsentBannerComponent";

export const metadata: Metadata = { title: "Consent Banner" };

export default function ConsentBannerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Consent Banner"
      pageSubtitle="GDPR-style cookie consent — bottom banner plus a settings modal for per-category preferences."
      mainSectionId="consent-banner"
    >
      <ConsentBannerComponent />
    </ContentWithTOC>
  );
}
