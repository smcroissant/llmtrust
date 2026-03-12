import { type NextRequest, NextResponse } from "next/server";

/**
 * Sentry tunnel route — bypasses ad-blockers by proxying Sentry events
 * through our own domain at /monitoring-tunnel
 */
export async function POST(request: NextRequest) {
  const SENTRY_HOST = "o450000000000000.ingest.sentry.io";
  const SENTRY_PROJECT_IDS = ["4500000000000000"];

  try {
    const envelope = await request.text();
    const piece = envelope.split("\n")[0];
    const header = JSON.parse(piece) as { dsn?: string };

    const dsn = header.dsn;
    if (!dsn) {
      return NextResponse.json({ error: "Missing DSN" }, { status: 400 });
    }

    const url = new URL(dsn);
    const projectId = url.pathname.replace("/", "");

    if (!SENTRY_PROJECT_IDS.includes(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const upstreamUrl = `https://${SENTRY_HOST}/api/${projectId}/envelope/`;

    const response = await fetch(upstreamUrl, {
      method: "POST",
      body: envelope,
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "Tunnel error" }, { status: 500 });
  }
}
