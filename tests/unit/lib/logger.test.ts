import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, generateRequestId, perfTimer } from "@/lib/logger";

describe("logger", () => {
  let consoleSpy: {
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages", () => {
    logger.info("test message");
    expect(consoleSpy.info).toHaveBeenCalledOnce();
    const call = consoleSpy.info.mock.calls[0][0] as string;
    expect(call).toContain("test message");
  });

  it("logs error messages", () => {
    logger.error("something broke");
    expect(consoleSpy.error).toHaveBeenCalledOnce();
  });

  it("logs warn messages", () => {
    logger.warn("heads up");
    expect(consoleSpy.warn).toHaveBeenCalledOnce();
  });

  it("includes context in log output", () => {
    logger.info("with context", { requestId: "req_123", userId: "user_456" });
    const call = consoleSpy.info.mock.calls[0][0] as string;
    expect(call).toContain("req_123");
  });
});

describe("generateRequestId", () => {
  it("generates unique IDs", () => {
    const id1 = generateRequestId();
    const id2 = generateRequestId();
    expect(id1).not.toBe(id2);
  });

  it("starts with req_ prefix", () => {
    const id = generateRequestId();
    expect(id.startsWith("req_")).toBe(true);
  });
});

describe("perfTimer", () => {
  beforeEach(() => {
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns duration in ms", async () => {
    const timer = perfTimer("test.op", 100);
    await new Promise((r) => setTimeout(r, 10));
    const duration = timer.end();
    expect(duration).toBeGreaterThanOrEqual(5);
  });

  it("logs slow operations as warnings", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const timer = perfTimer("slow.op", 5); // 5ms threshold
    await new Promise((r) => setTimeout(r, 20));
    timer.end();
    expect(warnSpy).toHaveBeenCalled();
  });
});
