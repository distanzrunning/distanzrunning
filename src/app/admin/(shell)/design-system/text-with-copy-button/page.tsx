import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TextWithCopyButtonComponent from "../components/content/TextWithCopyButtonComponent";

export const metadata: Metadata = { title: "Text With Copy Button" };

export default function TextWithCopyButtonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Text With Copy Button"
      pageSubtitle="Display text alongside a button that copies the text to the clipboard."
      mainSectionId="text-with-copy-button"
    >
      <TextWithCopyButtonComponent />
    </ContentWithTOC>
  );
}
