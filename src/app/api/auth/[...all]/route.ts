import { getAuth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { type NextRequest } from "next/server";

// Lazy handler creation — only initializes auth when the route is actually called.
// Prevents DATABASE_URL crashes during CI builds.
let _handlers: ReturnType<typeof toNextJsHandler> | null = null;

function getHandlers() {
  if (!_handlers) {
    _handlers = toNextJsHandler(getAuth().handler);
  }
  return _handlers;
}

export async function GET(request: NextRequest) {
  return getHandlers().GET(request);
}

export async function POST(request: NextRequest) {
  return getHandlers().POST(request);
}
