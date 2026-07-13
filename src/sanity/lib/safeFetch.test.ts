import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sanityFetchMock = vi.fn();
vi.mock("./live", () => ({
  sanityFetch: (args: unknown) => sanityFetchMock(args),
}));

import { safeSanityFetch } from "./safeFetch";

beforeEach(() => {
  sanityFetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("safeSanityFetch", () => {
  it("passes success through unchanged", async () => {
    const result = { data: [{ _id: "a" }] };
    sanityFetchMock.mockResolvedValueOnce(result);

    const res = await safeSanityFetch({ query: "*[_type == \"post\"]" });

    expect(res).toEqual(result);
  });

  it("degrades to { data: null } on failure and logs once, without rejecting", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    sanityFetchMock.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const res = await safeSanityFetch({ query: "*[_type == \"post\"]" });

    expect(res).toEqual({ data: null });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("degrades to { data: null } on a non-Error throw", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    sanityFetchMock.mockRejectedValueOnce("some string rejection");

    const res = await safeSanityFetch({ query: "*[_type == \"post\"]" });

    expect(res).toEqual({ data: null });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
