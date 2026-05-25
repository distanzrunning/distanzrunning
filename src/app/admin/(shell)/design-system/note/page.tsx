import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NoteComponent from "../components/content/NoteComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Note" };

export default function NotePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Note"
      pageSubtitle="Display text that requires attention or provides additional information."
      mainSectionId="note"
      headerRight={<RegistryInstallButtons slug="note" />}
    >
      <NoteComponent />
    </ContentWithTOC>
  );
}
