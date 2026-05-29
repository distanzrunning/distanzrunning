import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import AdminDateRangePickerComponent from "../components/content/AdminDateRangePickerComponent";

export const metadata: Metadata = { title: "Admin Date Range Picker" };

export default function AdminDateRangePickerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Admin Date Range Picker"
      pageSubtitle="Shared filter primitive for every admin dashboard — six presets (Last 7 / 30 / 90 days, This month, Last month, All time) plus a custom-range Calendar. URL-driven, tz-aware."
      mainSectionId="admin-date-range-picker"
    >
      <AdminDateRangePickerComponent />
    </ContentWithTOC>
  );
}
