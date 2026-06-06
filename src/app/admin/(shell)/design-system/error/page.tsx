import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ErrorComponent from "../components/content/ErrorComponent";

export const metadata: Metadata = { title: "Error" };

export default function ErrorPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Error"
      pageSubtitle="Good error design is clear, useful, and friendly. Designing concise and accurate error messages unblocks users and builds trust by meeting people where they are."
      mainSectionId="error"
    >
      <ErrorComponent />
    </ContentWithTOC>
  );
}
