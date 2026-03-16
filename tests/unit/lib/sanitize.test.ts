import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeUrl,
  truncate,
  stripControlChars,
  sanitize,
} from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("strips HTML tags", () => {
    expect(sanitizeText("<script>alert('xss')</script>hello")).toBe(
      "hello"
    );
  });

  it("escapes remaining special characters", () => {
    const result = sanitizeText("a<b & c>d");
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).not.toContain("&");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(sanitizeText("")).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("allows valid https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
  });

  it("allows valid http URLs", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects javascript: URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("rejects data: URLs", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  it("rejects invalid URLs", () => {
    expect(sanitizeUrl("not a url")).toBe("");
  });

  it("rejects ftp: URLs", () => {
    expect(sanitizeUrl("ftp://example.com")).toBe("");
  });
});

describe("truncate", () => {
  it("returns string unchanged when under limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings", () => {
    expect(truncate("hello world", 5)).toBe("hello");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("stripControlChars", () => {
  it("removes null bytes", () => {
    expect(stripControlChars("hello\x00world")).toBe("helloworld");
  });

  it("preserves newlines and tabs", () => {
    expect(stripControlChars("hello\nworld\ttab")).toBe("hello\nworld\ttab");
  });

  it("removes bell characters", () => {
    expect(stripControlChars("hello\x07world")).toBe("helloworld");
  });
});

describe("sanitize (full pipeline)", () => {
  it("applies full sanitization", () => {
    const input = "  <b>hello</b>\x00world  ";
    const result = sanitize(input);
    expect(result).not.toContain("<");
    expect(result).not.toContain("\x00");
    expect(result).toBe(result.trim());
  });

  it("respects max length", () => {
    const longInput = "a".repeat(20000);
    const result = sanitize(longInput, 100);
    expect(result.length).toBe(100);
  });

  it("defaults to 10000 max length", () => {
    const longInput = "a".repeat(15000);
    const result = sanitize(longInput);
    expect(result.length).toBe(10000);
  });
});
