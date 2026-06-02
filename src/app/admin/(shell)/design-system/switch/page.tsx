import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SwitchComponent from "../components/content/SwitchComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Switch" };

export default function SwitchPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Switch"
      pageSubtitle="Toggle between two mutually-exclusive options."
      mainSectionId="switch"
      headerRight={<RegistryInstallButtons slug="switch" />}
    >
      <SwitchComponent />
    </ContentWithTOC>
  );
}
