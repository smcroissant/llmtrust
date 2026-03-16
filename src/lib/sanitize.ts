/**
 * Input Sanitization Utilities
 *
 * Defense-in-depth against XSS, even though React escapes by default.
 * Apply to user-generated content before storage or display.
 */

/**
 * Strip HTML tags and dangerous characters from a string.
 * Use for plain-text fields (names, descriptions, etc.)
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>.*?<\/[^>]*>/gi, "") // Remove paired tags and their content
    .replace(/<[^>]*>/g, "") // Remove remaining self-closing/single tags
    .replace(/[<>&'"]/g, (char) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&#x27;",
        '"': "&quot;",
      };
      return entities[char] ?? char;
    })
    .trim();
}

/**
 * Sanitize a URL — only allow http/https schemes.
 * Returns empty string if URL is invalid or dangerous.
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Truncate a string to a maximum length.
 * Prevents DoS via extremely long inputs.
 */
export function truncate(input: string, maxLen: number): string {
  if (input.length <= maxLen) return input;
  return input.slice(0, maxLen);
}

/**
 * Strip null bytes and control characters (except \n, \r, \t).
 * Prevents injection attacks at the database layer.
 */
export function stripControlChars(input: string): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Full sanitization pipeline for user text input.
 */
export function sanitize(input: string, maxLen = 10000): string {
  return truncate(stripControlChars(sanitizeText(input)), maxLen);
}
