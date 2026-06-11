import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CardComponent from "../components/content/CardComponent";

export const metadata: Metadata = { title: "Card" };

export default function CardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Card"
      pageSubtitle="A container that groups related content and actions on a surface."
      mainSectionId="card"
    >
      <CardComponent />
    </ContentWithTOC>
  );
}
