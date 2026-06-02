import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import FoundationsOverview from "../components/content/FoundationsOverview";

export const metadata: Metadata = { title: "Introduction" };

export default function IntroductionPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      tocItems={[]}
      pageTitle="Stride Design System"
      pageSubtitle="Distanz Running's design system for building consistent web experiences."
    >
      <FoundationsOverview />
    </ContentWithTOC>
  );
}
