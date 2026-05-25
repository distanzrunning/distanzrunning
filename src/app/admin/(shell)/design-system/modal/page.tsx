import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ModalComponent from "../components/content/ModalComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Modal" };

export default function ModalPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Modal"
      pageSubtitle="Display popup content that requires attention or provides additional information."
      mainSectionId="modal"
      headerRight={<RegistryInstallButtons slug="modal" />}
    >
      <ModalComponent />
    </ContentWithTOC>
  );
}
