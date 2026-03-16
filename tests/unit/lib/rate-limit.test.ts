import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  API_RATE_LIMIT,
  AUTH_RATE_LIMIT,
} from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const result = checkRateLimit("test-key-1", { maxRequests: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("tracks multiple requests against the same key", () => {
    const config = { maxRequests: 3, windowMs: 60_000 };

    const r1 = checkRateLimit("test-key-2", config);
    const r2 = checkRateLimit("test-key-2", config);
    const r3 = checkRateLimit("test-key-2", config);

    expect(r1.remaining).toBe(2);
    expect(r2.remaining).toBe(1);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over the limit", () => {
    const config = { maxRequests: 2, windowMs: 60_000 };

    checkRateLimit("test-key-3", config);
    checkRateLimit("test-key-3", config);
    const blocked = checkRateLimit("test-key-3", config);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("resets after the window expires", () => {
    const config = { maxRequests: 1, windowMs: 1_000 };

    const first = checkRateLimit("test-key-4", config);
    expect(first.allowed).toBe(true);

    // Advance time past the window
    vi.advanceTimersByTime(1_500);

    const afterReset = checkRateLimit("test-key-4", config);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it("isolates different keys", () => {
    const config = { maxRequests: 1, windowMs: 60_000 };

    const key1 = checkRateLimit("isolated-a", config);
    const key2 = checkRateLimit("isolated-b", config);

    expect(key1.allowed).toBe(true);
    expect(key2.allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("preset configs", () => {
  it("API_RATE_LIMIT allows 100 requests per minute", () => {
    expect(API_RATE_LIMIT.maxRequests).toBe(100);
    expect(API_RATE_LIMIT.windowMs).toBe(60_000);
  });

  it("AUTH_RATE_LIMIT is stricter than API", () => {
    expect(AUTH_RATE_LIMIT.maxRequests).toBe(10);
    expect(AUTH_RATE_LIMIT.maxRequests).toBeLessThan(API_RATE_LIMIT.maxRequests);
    expect(AUTH_RATE_LIMIT.windowMs).toBe(60_000);
  });
});
