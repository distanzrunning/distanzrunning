import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ErrorCardComponent from "../components/content/ErrorCardComponent";

export const metadata: Metadata = { title: "Error Card" };

export default function ErrorCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Error Card"
      pageSubtitle="A card used to communicate an error state with a title and message."
      mainSectionId="error-card"
    >
      <ErrorCardComponent />
    </ContentWithTOC>
  );
}
