import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TextStyles from "../components/content/TextStyles";

export const metadata: Metadata = { title: "Text Styles" };

export default function TextStylesPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <TextStyles />
    </ContentWithTOC>
  );
}
