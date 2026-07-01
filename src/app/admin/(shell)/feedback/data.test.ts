import { describe, it, expect } from "vitest";
import {
  parseFeedbackFilters,
  matchesFeedbackFilters,
  type FeedbackRowRaw,
} from "./data";

// Characterization tests — pin current behaviour of the feedback filter
// functions (safety net for the Plan 002 shared-parser refactor).

/** Minimal FeedbackRowRaw — matchesFeedbackFilters only reads page_path/topic. */
function mkFeedback(
  page_path: string | null,
  topic: string | null,
): FeedbackRowRaw {
  return { page_path, topic } as unknown as FeedbackRowRaw;
}

describe("parseFeedbackFilters", () => {
  it("returns [] for undefined", () => {
    expect(parseFeedbackFilters(undefined)).toEqual([]);
  });

  it("skips an entry with no colon", () => {
    expect(parseFeedbackFilters("pages")).toEqual([]);
  });

  it("skips an unknown dimension key", () => {
    expect(parseFeedbackFilters("nope:x")).toEqual([]);
  });

  it("skips an empty value", () => {
    expect(parseFeedbackFilters("pages:")).toEqual([]);
  });

  it("parses a pages filter", () => {
    expect(parseFeedbackFilters("pages:/races")).toEqual([
      { dim: "pages", val: "/races" },
    ]);
  });

  it("parses a topics filter", () => {
    expect(parseFeedbackFilters("topics:bug")).toEqual([
      { dim: "topics", val: "bug" },
    ]);
  });

  it("keeps colons inside a path value (split on first colon only)", () => {
    expect(parseFeedbackFilters("pages:/races/2026:preview")).toEqual([
      { dim: "pages", val: "/races/2026:preview" },
    ]);
  });

  it("collapses same-dimension entries to one — later wins", () => {
    expect(parseFeedbackFilters(["pages:/a", "pages:/b"])).toEqual([
      { dim: "pages", val: "/b" },
    ]);
  });

  it("parses an array across both dimensions", () => {
    expect(parseFeedbackFilters(["pages:/races", "topics:bug"])).toEqual([
      { dim: "pages", val: "/races" },
      { dim: "topics", val: "bug" },
    ]);
  });
});

describe("matchesFeedbackFilters", () => {
  it("maps the 'pages' dimension to row.page_path", () => {
    expect(
      matchesFeedbackFilters(mkFeedback("/races", null), [
        { dim: "pages", val: "/races" },
      ]),
    ).toBe(true);
  });

  it("is false when the page_path differs", () => {
    expect(
      matchesFeedbackFilters(mkFeedback("/races", null), [
        { dim: "pages", val: "/gear" },
      ]),
    ).toBe(false);
  });

  it("maps the 'topics' dimension to row.topic", () => {
    expect(
      matchesFeedbackFilters(mkFeedback(null, "bug"), [
        { dim: "topics", val: "bug" },
      ]),
    ).toBe(true);
  });

  it("ANDs across dimensions", () => {
    expect(
      matchesFeedbackFilters(mkFeedback("/races", "bug"), [
        { dim: "pages", val: "/races" },
        { dim: "topics", val: "bug" },
      ]),
    ).toBe(true);
  });

  it("is true with no active filters", () => {
    expect(matchesFeedbackFilters(mkFeedback("/races", "bug"), [])).toBe(true);
  });
});
