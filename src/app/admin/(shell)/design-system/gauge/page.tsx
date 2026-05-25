import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import GaugeComponent from "../components/content/GaugeComponent";

export const metadata: Metadata = { title: "Gauge" };

export default function GaugePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Gauge"
      pageSubtitle="A circular visual for conveying a percentage."
      mainSectionId="gauge"
    >
      <GaugeComponent />
    </ContentWithTOC>
  );
}
