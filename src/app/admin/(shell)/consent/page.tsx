import { Suspense } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ConsentDashboardContent,
  ConsentDashboardSkeleton,
} from "./ConsentDashboard";
import {
  ConsentLookupContent,
  ConsentLookupSkeleton,
} from "./ConsentLookup";

export const metadata = {
  title: "Consent — Stride Admin",
  robots: { index: false, follow: false },
};

function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      method="GET"
      action="/admin/consent"
      style={{ display: "flex", gap: 8, marginBottom: 16 }}
    >
      <div style={{ flex: 1 }}>
        <Input
          name="q"
          type="text"
          defaultValue={defaultValue}
          placeholder="Look up by anonymous ID…"
          spellCheck={false}
          autoComplete="off"
          prefix={<Search className="w-4 h-4" />}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}

export default async function ConsentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

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
              className="text-heading-32"
              style={{
                margin: 0,
                color: "var(--ds-gray-1000)",
                wordBreak: "break-all",
              }}
            >
              <span
                style={{ color: "var(--ds-gray-700)", fontWeight: 500 }}
              >
                ANON ID:
              </span>{" "}
              <span className="font-mono">{query}</span>
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

        <SearchForm defaultValue={query} />

        {query ? (
          <Suspense fallback={<ConsentLookupSkeleton query={query} />}>
            <ConsentLookupContent query={query} />
          </Suspense>
        ) : (
          <Suspense fallback={<ConsentDashboardSkeleton />}>
            <ConsentDashboardContent />
          </Suspense>
        )}
      </div>
    </div>
  );
}
