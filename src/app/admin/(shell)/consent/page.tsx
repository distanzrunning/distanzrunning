import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/site-settings";
import { ConsentDashboardContent } from "./ConsentDashboard";
import ConsentFilterRow from "./ConsentFilterRow";
import { ConsentFilterShell } from "./ConsentFilterShell";
import {
  ConsentLookupContent,
  ConsentLookupSkeleton,
} from "./ConsentLookup";
import { windowFromParams } from "@/components/admin/datePresets";
import { getEarliestDecisionDate, parseFilters } from "./data";

export const metadata = {
  title: "Consent — Stride Admin",
  robots: { index: false, follow: false },
};

type DecisionFilter = "accept_all" | "reject_all" | "custom";
type Metric = "decisions" | "visitors";

function normaliseFilter(raw: string | undefined): DecisionFilter | null {
  if (raw === "accept_all" || raw === "reject_all" || raw === "custom") {
    return raw;
  }
  return null;
}

// Visitors is the default — the bare `/admin/consent` URL renders
// the broadest "what's happening" view. Explicit `?metric=decisions`
// switches to decisions mode; a present `?filter=` also implies
// decisions (you can't filter visitors by decision type).
function resolveMetric(
  raw: string | undefined,
  filter: DecisionFilter | null,
): Metric {
  if (raw === "decisions") return "decisions";
  if (raw === "visitors") return "visitors";
  return filter ? "decisions" : "visitors";
}

export default async function ConsentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    metric?: string;
    period?: string;
    from?: string;
    to?: string;
    f?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  // Filter parses first; metric is derived from explicit param or
  // implied by the filter. If metric ends up as visitors, drop any
  // filter the URL still carries (defensive against manual edits).
  const rawFilter = normaliseFilter(params.filter);
  const metric = resolveMetric(params.metric, rawFilter);
  const filter = metric === "visitors" ? null : rawFilter;
  // Page-wide breakdown filters (repeated ?f=dim:val) — validated against the
  // known dimensions, one per dimension. Compose with metric/decision-filter;
  // orthogonal to both. Managed from the chart-area filter buttons + funnels.
  const filters = parseFilters(params.f);
  const { timezone: tz } = await getSiteSettings();
  // Earliest stored decision date — drives the "All time" preset
  // for both server-side window resolution and the client picker's
  // visual range. Cached per (env) by unstable_cache, so calling
  // it from ConsentDashboardContent in parallel is free.
  const earliestDate = await getEarliestDecisionDate();
  const window = windowFromParams(
    {
      period: params.period,
      from: params.from,
      to: params.to,
    },
    tz,
    earliestDate,
  );
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
        {query && (
          <div style={{ marginBottom: 8 }}>
            <ButtonLink
              href="/admin/consent"
              variant="tertiary"
              size="small"
              prefixIcon={<ChevronLeft />}
            >
              Back to dashboard
            </ButtonLink>
          </div>
        )}

        {/* Lookup view keeps a heading so the anonymous ID is visible
            as the page identity. Dashboard view drops the heading
            entirely — the sidebar + shell top bar already name the
            route, and dropping it gives the data more vertical room. */}
        {query && (
          <header style={{ marginBottom: 24 }}>
            <h1
              className="text-heading-32 font-mono"
              style={{
                margin: 0,
                color: "hsl(var(--color-textDefault))",
                wordBreak: "break-all",
              }}
            >
              {query}
            </h1>
          </header>
        )}

        {query ? (
          <Suspense fallback={<ConsentLookupSkeleton query={query} />}>
            <ConsentLookupContent query={query} />
          </Suspense>
        ) : (
          <ConsentFilterShell>
            <ConsentFilterRow tz={tz} earliestDate={earliestDate} />
            {/* No in-page Suspense: loading.tsx is the single loading
                boundary. It streams on both hard load and client nav, so the
                whole page (filter row + dashboard) resolves together — no
                second skeleton stage where the filter row goes live while the
                content is still a skeleton, and nothing re-flashes to skeleton
                when you navigate away. Filter/date changes are searchParam
                transitions (loading.tsx doesn't fire), so React holds the
                previous tile values and NumberTicker animates old → new. */}
            <ConsentDashboardContent
              filter={filter}
              metric={metric}
              filters={filters}
              windowStart={window.start}
              windowEnd={window.end}
              tz={tz}
              earliestDate={earliestDate}
            />
          </ConsentFilterShell>
        )}
      </div>
    </div>
  );
}
