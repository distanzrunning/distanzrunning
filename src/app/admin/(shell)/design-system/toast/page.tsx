import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ToastDSComponent from "../components/content/ToastDSComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Toast" };

export default function ToastPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Toast"
      pageSubtitle="A succinct message that is displayed temporarily."
      mainSectionId="toast"
      headerRight={<RegistryInstallButtons slug="toast" />}
    >
      <ToastDSComponent />
    </ContentWithTOC>
  );
}
