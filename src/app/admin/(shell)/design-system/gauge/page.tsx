import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import GaugeComponent from "../components/content/GaugeComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Gauge" };

export default function GaugePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Gauge"
      pageSubtitle="A circular visual for conveying a percentage."
      mainSectionId="gauge"
      headerRight={<RegistryInstallButtons slug="gauge" />}
    >
      <GaugeComponent />
    </ContentWithTOC>
  );
}
