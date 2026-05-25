import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ArticleCardComponent from "../components/content/ArticleCardComponent";

export const metadata: Metadata = { title: "Article Card" };

export default function ArticleCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Article Card"
      pageSubtitle="The editorial card used in homepage rows and section listings — cinematic image, kicker · date meta, clamped title and excerpt."
      mainSectionId="overview"
    >
      <ArticleCardComponent />
    </ContentWithTOC>
  );
}
