import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { createConfirmToken } from "@/lib/newsletterConfirmToken";
import { GET } from "./route";

const SECRET = "test-confirm-secret";
const EMAIL = "runner@example.com";
const BASE = "https://distanzrunning.com";

const fetchMock = vi.fn();

function confirmRequest(token?: string): NextRequest {
  const qs = token !== undefined ? `?token=${encodeURIComponent(token)}` : "";
  return new NextRequest(`http://localhost/api/confirm${qs}`);
}

function callsMatching(predicate: (url: string, init?: RequestInit) => boolean) {
  return fetchMock.mock.calls.filter(([url, init]) =>
    predicate(String(url), init)
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", SECRET);
  vi.stubEnv("NEXT_PUBLIC_BASE_URL", BASE);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

describe("GET /api/confirm — token validation", () => {
  it("400 when the token is missing", async () => {
    const res = await GET(confirmRequest());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid confirmation link");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("400 for a garbage token", async () => {
    const res = await GET(confirmRequest("garbage-token"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(
      "This confirmation link is invalid or has expired. Please subscribe again."
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("400 for an expired token (8 days old)", async () => {
    const token = createConfirmToken(
      EMAIL,
      SECRET,
      Date.now() - 8 * 86_400_000
    );
    const res = await GET(confirmRequest(token));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("503 when the Resend/secret envs are missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await GET(confirmRequest("anything"));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("GET /api/confirm — contact flows", () => {
  it("creates the contact and redirects to /confirmed when none exists", async () => {
    fetchMock
      // GET /contacts/{email} → not found
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "not found" }), { status: 404 })
      )
      // POST /contacts → created
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ object: "contact", id: "c_1" }), {
          status: 201,
        })
      );

    const token = createConfirmToken(EMAIL, SECRET);
    const res = await GET(confirmRequest(token));

    expect([307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toBe(`${BASE}/confirmed`);

    const createCalls = callsMatching(
      (url, init) =>
        url === "https://api.resend.com/contacts" && init?.method === "POST"
    );
    expect(createCalls).toHaveLength(1);
    expect(JSON.parse(createCalls[0][1].body)).toEqual({
      email: EMAIL,
      unsubscribed: false,
    });
  });

  it("redirects to /confirmed?already=true for an existing subscribed contact, with no writes", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ object: "contact", id: "c_1", email: EMAIL, unsubscribed: false }),
        { status: 200 }
      )
    );

    const token = createConfirmToken(EMAIL, SECRET);
    const res = await GET(confirmRequest(token));

    expect([307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toBe(`${BASE}/confirmed?already=true`);

    const writes = callsMatching(
      (_url, init) => init?.method === "POST" || init?.method === "PATCH"
    );
    expect(writes).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("PATCHes unsubscribed:false and redirects to /confirmed for a previously unsubscribed contact", async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ object: "contact", id: "c_1", email: EMAIL, unsubscribed: true }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ object: "contact", id: "c_1" }), {
          status: 200,
        })
      );

    const token = createConfirmToken(EMAIL, SECRET);
    const res = await GET(confirmRequest(token));

    expect([307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toBe(`${BASE}/confirmed`);

    const patchCalls = callsMatching((_url, init) => init?.method === "PATCH");
    expect(patchCalls).toHaveLength(1);
    expect(String(patchCalls[0][0])).toBe(
      `https://api.resend.com/contacts/${encodeURIComponent(EMAIL)}`
    );
    expect(JSON.parse(patchCalls[0][1].body)).toEqual({ unsubscribed: false });

    const postCalls = callsMatching((_url, init) => init?.method === "POST");
    expect(postCalls).toHaveLength(0);
  });

  it("500 when the contact create fails, without reflecting the provider body", async () => {
    const providerLeak = "internal provider trace xyz987";
    fetchMock
      .mockResolvedValueOnce(new Response("not found", { status: 404 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: providerLeak }), { status: 422 })
      );

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const token = createConfirmToken(EMAIL, SECRET);
    const res = await GET(confirmRequest(token));
    consoleSpy.mockRestore();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to confirm subscription");
    expect(JSON.stringify(json)).not.toContain("xyz987");
  });
});
