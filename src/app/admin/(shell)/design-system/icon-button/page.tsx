import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ButtonIconComponent from "../components/content/ButtonIconComponent";

export const metadata: Metadata = { title: "Icon Button" };

export default function IconButtonPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <ButtonIconComponent />
    </ContentWithTOC>
  );
}
