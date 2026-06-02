import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Icons from "../components/content/Icons";

export const metadata: Metadata = { title: "Icons" };

export default function IconsPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Icons"
      pageSubtitle="A collection of icons used across Distanz products. Right click to copy import statement."
      mainSectionId="icons"
    >
      <Icons />
    </ContentWithTOC>
  );
}
