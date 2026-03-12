"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <EmptyState
        variant="generic"
        title="Something went wrong"
        description={error.message || "An unexpected error occurred in the dashboard."}
        action={
          <div className="flex gap-3">
            <Button onClick={() => reset()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" render={<Link href="/" />}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        }
      />
    </div>
  );
}
