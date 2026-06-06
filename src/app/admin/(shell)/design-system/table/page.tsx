import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TableComponent from "../components/content/TableComponent";

export const metadata: Metadata = { title: "Table" };

export default function TablePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Table"
      mainSectionId="table"
    >
      <TableComponent />
    </ContentWithTOC>
  );
}
