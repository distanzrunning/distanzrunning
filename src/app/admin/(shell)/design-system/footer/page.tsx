import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import FooterComponent from "../components/content/FooterComponent";

export const metadata: Metadata = { title: "Footer" };

export default function FooterPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Footer"
      pageSubtitle="The site footer that sits below <main> on every public page: full Distanz Running lockup on the left, three-column link grid on the right (Category, Company, Social). Anatomy modelled on v0.app, theme-aware via DS tokens."
      mainSectionId="overview"
    >
      <FooterComponent />
    </ContentWithTOC>
  );
}
