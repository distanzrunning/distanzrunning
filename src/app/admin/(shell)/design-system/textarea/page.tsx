import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TextareaComponent from "../components/content/TextareaComponent";

export const metadata: Metadata = { title: "Textarea" };

export default function TextareaPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Textarea"
      pageSubtitle="Retrieve multi-line user input."
      mainSectionId="textarea"
    >
      <TextareaComponent />
    </ContentWithTOC>
  );
}
