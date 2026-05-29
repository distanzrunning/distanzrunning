import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/site-settings";
import {
  ConsentDashboardContent,
  ConsentDashboardSkeleton,
} from "./ConsentDashboard";
import ConsentFilterRow from "./ConsentFilterRow";
import { ConsentFilterShell } from "./ConsentFilterShell";
import {
  ConsentLookupContent,
  ConsentLookupSkeleton,
} from "./ConsentLookup";
import type { EnvFilter } from "@/components/admin/env";
import { windowFromParams } from "@/components/admin/datePresets";
import { getEarliestDecisionDate } from "./data";

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

function normaliseEnv(raw: string | undefined): EnvFilter {
  if (raw === "production" || raw === "staging" || raw === "development") {
    return raw;
  }
  return "all";
}

export default async function ConsentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    metric?: string;
    env?: string;
    period?: string;
    from?: string;
    to?: string;
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
  const env = normaliseEnv(params.env);
  const { timezone: tz } = await getSiteSettings();
  // Earliest stored decision date — drives the "All time" preset
  // for both server-side window resolution and the client picker's
  // visual range. Cached per (env) by unstable_cache, so calling
  // it from ConsentDashboardContent in parallel is free.
  const earliestDate = await getEarliestDecisionDate(env);
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
          maxWidth: 1248,
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
                color: "var(--ds-gray-1000)",
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
            <ConsentFilterRow
              tz={tz}
              earliestDate={earliestDate}
              env={env}
            />
            {/* No `key` on this Suspense — keeping the boundary
                stable across filter/window changes means React
                preserves the existing dashboard tree during a
                transition (Link click / picker startTransition),
                so the previous tile values stay on screen while
                the new data streams in and NumberTicker animates
                between old and new readings instead of the row
                flashing a skeleton. */}
            <Suspense fallback={<ConsentDashboardSkeleton />}>
              <ConsentDashboardContent
                filter={filter}
                metric={metric}
                windowStart={window.start}
                windowEnd={window.end}
                tz={tz}
                earliestDate={earliestDate}
                env={env}
              />
            </Suspense>
          </ConsentFilterShell>
        )}
      </div>
    </div>
  );
}
