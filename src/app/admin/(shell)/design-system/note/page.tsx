import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import NoteComponent from "../components/content/NoteComponent";

export const metadata: Metadata = { title: "Note" };

export default function NotePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Note"
      pageSubtitle="Display text that requires attention or provides additional information."
      mainSectionId="note"
    >
      <NoteComponent />
    </ContentWithTOC>
  );
}
