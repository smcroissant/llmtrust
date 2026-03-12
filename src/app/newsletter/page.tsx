"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/layout/top-bar";
import { trpc } from "@/lib/trpc";
import {
  Sparkles,
  Mail,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  BookOpen,
} from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setErrorMsg("");
    },
    onError: (error) => {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({ email });
  }

  const highlights = [
    {
      icon: TrendingUp,
      title: "Weekly Digest",
      description:
        "New model releases, benchmark results, and trending open-source projects — curated every Friday.",
    },
    {
      icon: Zap,
      title: "New Model Alerts",
      description:
        "Be the first to know when a breakthrough model drops on HuggingFace. No noise, just signal.",
    },
    {
      icon: BookOpen,
      title: "Pro Tips & Tutorials",
      description:
        "Optimize inference, fine-tune locally, and master quantization. Tips from our community of practitioners.",
    },
  ];

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} />

      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Neural glow background */}
          <div
            className="hero-glow hero-glow-primary animate-glow-pulse"
            style={{ width: 500, height: 500, top: -100, right: "20%" }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{
              width: 400,
              height: 400,
              bottom: -150,
              left: "10%",
              opacity: 0.5,
            }}
          />
          <div className="neural-line absolute top-1/3 left-0 right-0" />

          <div className="relative container mx-auto px-6 text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1.5 text-sm border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Join 5,000+ AI developers</span>
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Open-Source AI
              <br />
              <span className="text-gradient-brand">Weekly Digest</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              New LLM models, benchmarks, pro tips, and community highlights.
              Delivered every Friday. No spam, unsubscribe anytime.
            </p>

            {/* Subscribe Form */}
            <div className="mx-auto mt-10 max-w-md">
              {submitted ? (
                <GlowCard className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    You&apos;re almost in! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a confirmation email to{" "}
                    <strong className="text-foreground">{email}</strong>. Click
                    the link inside to activate your subscription.
                  </p>
                </GlowCard>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-9 h-10"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={subscribe.isPending}
                      className="h-10 gap-2 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.3)] transition-shadow"
                    >
                      {subscribe.isPending ? (
                        "Subscribing..."
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  {errorMsg && (
                    <p className="text-sm text-destructive">{errorMsg}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Double opt-in. We respect your inbox. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* What you'll get */}
        <section className="py-20 border-t border-border/60">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
              What You&apos;ll Get
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Everything you need to stay ahead in the open-source AI space.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highlights.map((item) => (
                <GlowCard key={item.title} className="text-center p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <GlowCardTitle className="justify-center mb-2">
                    {item.title}
                  </GlowCardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
