import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Typography from "../components/content/Typography";

export const metadata: Metadata = { title: "Typography" };

export default function TypographyPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Typography"
      pageSubtitle="Pre-set combinations of font-size, line-height, letter-spacing, and font-weight based on the Geist design system."
      mainSectionId="typography"
    >
      <Typography />
    </ContentWithTOC>
  );
}
