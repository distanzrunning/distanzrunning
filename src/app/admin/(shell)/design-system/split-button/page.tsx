import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SplitButtonComponent from "../components/content/SplitButtonComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Split Button" };

export default function SplitButtonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Split Button"
      pageSubtitle="A button that offers a primary interaction coupled with a dropdown menu offering additional actions."
      mainSectionId="split-button"
      headerRight={<RegistryInstallButtons slug="split-button" />}
    >
      <SplitButtonComponent />
    </ContentWithTOC>
  );
}
