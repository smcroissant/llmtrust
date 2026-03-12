"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import {
  GlowCard,
} from "@/components/ui/glow-card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const unsubscribe = trpc.newsletter.unsubscribe.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Unsubscribe failed.");
    },
  });

  useEffect(() => {
    if (token) {
      unsubscribe.mutate({ token });
    } else {
      setStatus("error");
      setMessage("Missing unsubscribe token.");
    }
  }, [token]);

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Home", href: "/" }, { label: "Newsletter" }, { label: "Unsubscribe" }]} />
      <div className="flex-1 overflow-auto">
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-md text-center">
            <GlowCard className="p-8">
              {status === "loading" && (
                <>
                  <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin mb-4" />
                  <h2 className="text-lg font-semibold">Unsubscribing...</h2>
                </>
              )}
              {status === "success" && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <CheckCircle2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Unsubscribed</h2>
                  <p className="text-sm text-muted-foreground mb-6">{message}</p>
                  <Link href="/newsletter">
                    <Button variant="outline">Re-subscribe</Button>
                  </Link>
                </>
              )}
              {status === "error" && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                    <XCircle className="h-7 w-7 text-destructive" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                  <p className="text-sm text-muted-foreground mb-6">{message}</p>
                  <Link href="/">
                    <Button variant="outline">Go Home</Button>
                  </Link>
                </>
              )}
            </GlowCard>
          </div>
        </section>
      </div>
    </>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
