import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Typefaces from "../components/content/Typefaces";

export const metadata: Metadata = { title: "Typefaces" };

export default function TypefacesPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <Typefaces />
    </ContentWithTOC>
  );
}
