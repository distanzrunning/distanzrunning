import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CopyButtonComponent from "../components/content/CopyButtonComponent";

export const metadata: Metadata = { title: "Copy Button" };

export default function CopyButtonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Copy Button"
      pageSubtitle="A button that copies a given string to the clipboard and provides feedback when copied."
      mainSectionId="copy-button"
    >
      <CopyButtonComponent />
    </ContentWithTOC>
  );
}
