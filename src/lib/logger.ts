/**
 * Structured Logger for LLM Trust
 *
 * Levels: debug | info | warn | error
 * Outputs JSON in production, formatted in development.
 * Includes request ID correlation, performance tracking, and slow query detection.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  userId?: string;
  route?: string;
  method?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  duration?: number;
}

import { env } from "~/env";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LOG_LEVEL = env.LOG_LEVEL;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL];
}

function formatLog(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }
  // Pretty format for development
  const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase().padEnd(5)}`;
  const ctx = entry.context?.requestId ? ` [${entry.context.requestId}]` : "";
  const duration = entry.duration ? ` (${entry.duration}ms)` : "";
  const err = entry.error ? `\n  ${entry.error.stack || entry.error.message}` : "";
  return `${prefix}${ctx} ${entry.message}${duration}${err}`;
}

function output(entry: LogEntry): void {
  const formatted = formatLog(entry);

  switch (entry.level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error,
  duration?: number,
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context) entry.context = context;
  if (duration !== undefined) entry.duration = duration;
  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return entry;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (shouldLog("debug")) {
      output(createEntry("debug", message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    if (shouldLog("info")) {
      output(createEntry("info", message, context));
    }
  },

  warn(message: string, context?: LogContext, error?: Error): void {
    if (shouldLog("warn")) {
      output(createEntry("warn", message, context, error));
    }
  },

  error(message: string, context?: LogContext, error?: Error): void {
    if (shouldLog("error")) {
      output(createEntry("error", message, context, error));
    }
  },

  /**
   * Log a slow operation (API call, query, etc.)
   */
  slow(message: string, durationMs: number, context?: LogContext): void {
    const entry = createEntry("warn", `[SLOW] ${message}`, context, undefined, durationMs);
    output(entry);
  },
};

/**
 * Performance timer utility
 * Usage:
 *   const timer = perfTimer("db.query.users");
 *   ... do work ...
 *   timer.end(); // logs if > threshold
 */
export function perfTimer(label: string, thresholdMs = 1000) {
  const start = performance.now();

  return {
    end(context?: LogContext): number {
      const duration = Math.round(performance.now() - start);
      if (duration > thresholdMs) {
        logger.slow(label, duration, context);
      } else {
        logger.debug(`${label} completed`, { ...context, duration });
      }
      return duration;
    },
  };
}

/**
 * Generate a unique request ID (UUID v4-ish for simplicity)
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
