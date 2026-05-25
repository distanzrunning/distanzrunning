import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Iconography from "../components/content/Iconography";

export const metadata: Metadata = { title: "Iconography" };

export default function IconographyPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <Iconography />
    </ContentWithTOC>
  );
}
