import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ButtonComponentNew from "../components/content/ButtonComponentNew";

export const metadata: Metadata = { title: "Button" };

export default function ButtonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Button"
      pageSubtitle="Trigger an action or event, such as submitting a form or displaying a dialog."
      mainSectionId="button"
    >
      <ButtonComponentNew />
    </ContentWithTOC>
  );
}
