import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
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
import { isoOf, windowFromParams } from "./presets";

export const metadata = {
  title: "Consent — Stride Admin",
  robots: { index: false, follow: false },
};

type DecisionFilter = "accept_all" | "reject_all" | "custom";

function normaliseFilter(raw: string | undefined): DecisionFilter | null {
  if (raw === "accept_all" || raw === "reject_all" || raw === "custom") {
    return raw;
  }
  return null;
}

export default async function ConsentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const filter = normaliseFilter(params.filter);
  const window = windowFromParams({ from: params.from, to: params.to });
  const windowKey = `${isoOf(window.start)}_${isoOf(window.end)}`;

  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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

        <header style={{ marginBottom: 24 }}>
          {query ? (
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
          ) : (
            <>
              <h1
                className="text-heading-32"
                style={{ margin: 0, color: "var(--ds-gray-1000)" }}
              >
                Consent dashboard
              </h1>
              <p
                className="text-copy-16"
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  color: "var(--ds-gray-700)",
                }}
              >
                Privacy choices made by visitors
              </p>
            </>
          )}
        </header>

        {query ? (
          <Suspense fallback={<ConsentLookupSkeleton query={query} />}>
            <ConsentLookupContent query={query} />
          </Suspense>
        ) : (
          <ConsentFilterShell>
            <ConsentFilterRow />
            <Suspense
              key={`${windowKey}_${filter ?? "all"}`}
              fallback={<ConsentDashboardSkeleton />}
            >
              <ConsentDashboardContent
                filter={filter}
                windowStart={window.start}
                windowEnd={window.end}
              />
            </Suspense>
          </ConsentFilterShell>
        )}
      </div>
    </div>
  );
}
