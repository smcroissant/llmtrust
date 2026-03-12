"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { validatePasswordStrength } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (mode === "sign-up" && value.length > 0) {
      const result = validatePasswordStrength(value);
      setPasswordErrors(result.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side password validation for sign-up
    if (mode === "sign-up") {
      const result = validatePasswordStrength(password);
      if (!result.valid) {
        setPasswordErrors(result.errors);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (result.error) {
          setError(result.error.message ?? "Sign up failed");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message ?? "Sign in failed");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === "sign-up" && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            autoComplete="name"
            className="bg-surface border-border/60 focus:border-primary/50 focus:ring-primary/20 h-11"
          />
        </div>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
          minLength={8}
          maxLength={128}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          className="bg-surface border-border/60 focus:border-primary/50 focus:ring-primary/20 h-11"
        />
        {mode === "sign-up" && passwordErrors.length > 0 && (
          <ul className="text-xs text-destructive space-y-1 mt-1">
            {passwordErrors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        )}
        {mode === "sign-up" && password.length > 0 && passwordErrors.length === 0 && (
          <p className="text-xs text-green-600 mt-1">✓ Password meets requirements</p>
        )}
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
            {mode === "sign-in" ? "Signing in..." : "Creating account..."}
          </span>
        ) : mode === "sign-in" ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
