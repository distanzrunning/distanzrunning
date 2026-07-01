import { describe, it, expect } from "vitest";
import {
  parseFilters,
  matchesFilters,
  rankBreakdowns,
  type EnrichedConsent,
  type ConsentDimKey,
} from "./data";

// Characterization tests — these pin the CURRENT behaviour of the pure
// filter/rank functions so the Plan 002 refactor (extracting the shared parser)
// can be proven behaviour-preserving. Do not "fix" behaviour here.

const ALL_DIMS: ConsentDimKey[] = [
  "devices",
  "browsers",
  "os",
  "geography",
  "languages",
  "ui",
  "domains",
  "policy",
];

/** Minimal EnrichedConsent for the functions under test — only `dims` and
 *  `dimLabels` are read by matchesFilters/rankBreakdowns. Labels mirror the
 *  raw value so `rank` uses the value as its display label. */
function mkConsent(
  dims: Partial<Record<ConsentDimKey, string | null>>,
): EnrichedConsent {
  const full = Object.fromEntries(
    ALL_DIMS.map((d) => [d, dims[d] ?? null]),
  ) as Record<ConsentDimKey, string | null>;
  return { dims: full, dimLabels: { ...full } } as unknown as EnrichedConsent;
}

describe("parseFilters", () => {
  it("returns [] for undefined", () => {
    expect(parseFilters(undefined)).toEqual([]);
  });

  it("returns [] for an empty string", () => {
    expect(parseFilters("")).toEqual([]);
  });

  it("skips an entry with no colon", () => {
    expect(parseFilters("devices")).toEqual([]);
  });

  it("skips an entry with a colon at position 0", () => {
    expect(parseFilters(":desktop")).toEqual([]);
  });

  it("skips an unknown dimension key", () => {
    expect(parseFilters("unknowndim:x")).toEqual([]);
  });

  it("skips an empty value", () => {
    expect(parseFilters("devices:")).toEqual([]);
  });

  it("parses a single valid filter", () => {
    expect(parseFilters("devices:desktop")).toEqual([
      { dim: "devices", val: "desktop" },
    ]);
  });

  it("keeps everything after the FIRST colon as the value", () => {
    expect(parseFilters("geography:GB:extra")).toEqual([
      { dim: "geography", val: "GB:extra" },
    ]);
  });

  it("parses an array of distinct-dimension filters", () => {
    expect(parseFilters(["devices:desktop", "geography:GB"])).toEqual([
      { dim: "devices", val: "desktop" },
      { dim: "geography", val: "GB" },
    ]);
  });

  it("collapses same-dimension entries to one — later wins", () => {
    expect(parseFilters(["devices:desktop", "devices:mobile"])).toEqual([
      { dim: "devices", val: "mobile" },
    ]);
  });
});

describe("matchesFilters", () => {
  const row = mkConsent({ devices: "desktop", geography: "GB" });

  it("is true when the single filter matches", () => {
    expect(matchesFilters(row, [{ dim: "devices", val: "desktop" }])).toBe(true);
  });

  it("ANDs across dimensions (all must match)", () => {
    expect(
      matchesFilters(row, [
        { dim: "devices", val: "desktop" },
        { dim: "geography", val: "GB" },
      ]),
    ).toBe(true);
  });

  it("is false when any filter mismatches", () => {
    expect(
      matchesFilters(row, [
        { dim: "devices", val: "desktop" },
        { dim: "geography", val: "FR" },
      ]),
    ).toBe(false);
  });

  it("is false for a mismatched single filter", () => {
    expect(matchesFilters(row, [{ dim: "devices", val: "mobile" }])).toBe(false);
  });

  it("never matches a null (unknown) bucket", () => {
    const unknownDevice = mkConsent({ devices: null });
    expect(
      matchesFilters(unknownDevice, [{ dim: "devices", val: "desktop" }]),
    ).toBe(false);
  });

  it("is true with no active filters (every() of [])", () => {
    expect(matchesFilters(row, [])).toBe(true);
  });
});

describe("rankBreakdowns", () => {
  it("counts and orders a dimension by total desc", () => {
    const rows = [
      mkConsent({ devices: "desktop" }),
      mkConsent({ devices: "desktop" }),
      mkConsent({ devices: "mobile" }),
    ];
    expect(rankBreakdowns(rows).devices).toEqual([
      { key: "desktop", label: "desktop", total: 2 },
      { key: "mobile", label: "mobile", total: 1 },
    ]);
  });

  it("collapses unknown values into one italic '(unknown)' bar", () => {
    const rows = [mkConsent({ devices: "desktop" }), mkConsent({ devices: null })];
    const unknown = rankBreakdowns(rows).devices.find(
      (b) => b.label === "(unknown)",
    );
    expect(unknown).toMatchObject({ label: "(unknown)", total: 1, italic: true });
  });

  it("returns an empty-but-shaped result for no rows without throwing", () => {
    const empty = rankBreakdowns([]);
    expect(empty.sessions).toBe(0);
    expect(empty.devices).toEqual([]);
    expect(empty.countries).toEqual([]);
    expect(empty.policies).toEqual([]);
  });
});
