import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import RaceCardComponent from "../components/content/RaceCardComponent";

export const metadata: Metadata = { title: "Race Card" };

export default function RaceCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Race Card"
      pageSubtitle="The card used to surface a race guide. Two variants: the default homepage row and the index variant used on /races with its glassy hover overlay."
      mainSectionId="overview"
    >
      <RaceCardComponent />
    </ContentWithTOC>
  );
}
