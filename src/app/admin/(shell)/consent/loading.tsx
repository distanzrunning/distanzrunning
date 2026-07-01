import { Skeleton } from "@/components/ui/Skeleton";
import { ConsentDashboardSkeleton } from "./ConsentDashboard";

// Route-level instant fallback. Next renders this the moment you navigate INTO
// /admin/consent (a path change) — before the server render lands — so the page
// area shows a skeleton immediately instead of the previous page hanging while
// getSiteSettings + getEarliestDecisionDate resolve. It does NOT fire on
// filter/date changes (searchParam-only navigation), so the in-page Suspense
// still keeps the live tile values across those.
export default function Loading() {
  return (
    <div>
      <div
        style={{
          maxWidth: "none",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        {/* Filter row placeholder — search input (flex) + date picker. */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Skeleton
            width="100%"
            height={40}
            style={{ display: "block", flex: 1 }}
          />
          <Skeleton width={240} height={40} style={{ display: "block" }} />
        </div>
        <ConsentDashboardSkeleton />
      </div>
    </div>
  );
}
