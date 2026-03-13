"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to send reset email");
      } else {
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-gradient-brand">LLM Trust</span>
            </h1>
          </Link>
        </div>

        <div className="card-glow p-8 space-y-6 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-muted-foreground text-sm">
            We sent a password reset link to <strong>{email}</strong>. Check your
            inbox and click the link to reset your password.
          </p>
          <Link
            href="/auth/sign-in"
            className="block text-sm text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo / Brand */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block group">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-brand">LLM Trust</span>
          </h1>
        </Link>
        <p className="text-muted-foreground text-sm">
          Reset your password
        </p>
      </div>

      {/* Card */}
      <div className="card-glow p-8 space-y-6">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              maxLength={254}
              className="bg-surface border-border/60 focus:border-primary/50 focus:ring-primary/20 h-11"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-[0_0_20px_oklch(0.68_0.24_290/0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290/0.3)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <Link
          href="/auth/sign-in"
          className="block w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
