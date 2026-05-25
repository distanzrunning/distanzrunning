import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import StatCardComponent from "../components/content/StatCardComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Stat Card" };

export default function StatCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Stat Card"
      pageSubtitle="Dashboard surface for headline numbers — label, value, optional hint."
      mainSectionId="stat-card"
      headerRight={<RegistryInstallButtons slug="stat-card" />}
    >
      <StatCardComponent />
    </ContentWithTOC>
  );
}
