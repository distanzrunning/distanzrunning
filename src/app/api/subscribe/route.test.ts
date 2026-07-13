import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// The route reads public/brand/*.png at module load — the files exist
// in the repo, so a plain import works under the node test env.

const fetchMock = vi.fn();

function subscribeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** All calls fetch made to a given host. */
function callsTo(host: string) {
  return fetchMock.mock.calls.filter(([url]) => String(url).includes(host));
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "test-confirm-secret");
  vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://distanzrunning.com");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

describe("POST /api/subscribe — validation", () => {
  it("400 when email is missing", async () => {
    const res = await POST(subscribeRequest({}));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Email address is required");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("400 when email format is invalid", async () => {
    const res = await POST(subscribeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Please enter a valid email address");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/subscribe — Turnstile", () => {
  it("400 with no token when the secret is set, and Resend is never called", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts-secret");
    const res = await POST(subscribeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(
      "Verification failed. Please try again."
    );
    expect(callsTo("api.resend.com")).toHaveLength(0);
  });

  it("400 when siteverify returns success:false, and Resend is never called", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts-secret");
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), { status: 200 })
    );
    const res = await POST(
      subscribeRequest({ email: "a@b.com", turnstileToken: "tok" })
    );
    expect(res.status).toBe(400);
    expect(callsTo("challenges.cloudflare.com")).toHaveLength(1);
    expect(callsTo("api.resend.com")).toHaveLength(0);
  });
});

describe("POST /api/subscribe — configuration guard", () => {
  it("503 when RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(subscribeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe(
      "Newsletter signups are temporarily unavailable."
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("503 when NEWSLETTER_CONFIRM_SECRET is missing", async () => {
    vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "");
    const res = await POST(subscribeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/subscribe — happy path", () => {
  it("sends exactly one Resend email with confirm link, inline attachments, lowercased to", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "email_123" }), { status: 200 })
    );
    const res = await POST(subscribeRequest({ email: "Runner@Example.COM" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      message: "Please check your email to confirm your subscription!",
    });

    const resendCalls = callsTo("api.resend.com");
    expect(resendCalls).toHaveLength(1);
    const [url, init] = resendCalls[0];
    expect(String(url)).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer re_test_key");

    const body = JSON.parse(init.body);
    expect(body.to).toBe("runner@example.com");
    expect(body.html).toContain("/api/confirm?token=");
    // Email travels inside the token now — no separate query param.
    expect(body.html).not.toContain("&email=");
    expect(body.attachments.map((a: { content_id: string }) => a.content_id))
      .toEqual(["icon-badge.png", "wordmark-gray.png"]);
    expect(body.tags).toEqual([{ name: "type", value: "confirmation-email" }]);
  });
});

describe("POST /api/subscribe — provider error handling", () => {
  it("502 on Resend failure without reflecting the provider body", async () => {
    const providerLeak = "API key is invalid, internal trace id abc123";
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: providerLeak }), { status: 401 })
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(subscribeRequest({ email: "a@b.com" }));
    consoleSpy.mockRestore();

    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toBe(
      "We could not send the confirmation email. Please try again."
    );
    // Regression: the old Mailgun handler echoed provider messages.
    expect(JSON.stringify(json)).not.toContain(providerLeak);
    expect(JSON.stringify(json)).not.toContain("abc123");
  });
});
