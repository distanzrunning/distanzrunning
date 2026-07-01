import { describe, it, expect } from "vitest";
import { parseFilterParams } from "./filterParams";

// Tests the shared generic directly with a synthetic dim-key allowlist. The
// dashboard-level tests (consent/feedback data.test.ts) prove the wiring; these
// prove the extracted core.

type Dim = "a" | "b";
const isDim = (x: string | undefined): x is Dim => x === "a" || x === "b";

describe("parseFilterParams", () => {
  it("returns [] for undefined", () => {
    expect(parseFilterParams(undefined, isDim)).toEqual([]);
  });

  it("returns [] for an empty string", () => {
    expect(parseFilterParams("", isDim)).toEqual([]);
  });

  it("skips an entry with no colon", () => {
    expect(parseFilterParams("a", isDim)).toEqual([]);
  });

  it("skips a colon at position 0", () => {
    expect(parseFilterParams(":x", isDim)).toEqual([]);
  });

  it("skips a dim outside the allowlist", () => {
    expect(parseFilterParams("z:x", isDim)).toEqual([]);
  });

  it("skips an empty value", () => {
    expect(parseFilterParams("a:", isDim)).toEqual([]);
  });

  it("parses a single valid filter", () => {
    expect(parseFilterParams("a:1", isDim)).toEqual([{ dim: "a", val: "1" }]);
  });

  it("keeps everything after the first colon as the value", () => {
    expect(parseFilterParams("a:1:2", isDim)).toEqual([
      { dim: "a", val: "1:2" },
    ]);
  });

  it("parses an array across dimensions", () => {
    expect(parseFilterParams(["a:1", "b:2"], isDim)).toEqual([
      { dim: "a", val: "1" },
      { dim: "b", val: "2" },
    ]);
  });

  it("collapses same-dimension entries — later wins", () => {
    expect(parseFilterParams(["a:1", "a:2"], isDim)).toEqual([
      { dim: "a", val: "2" },
    ]);
  });
});
