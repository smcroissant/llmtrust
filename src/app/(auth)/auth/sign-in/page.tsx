import Link from "next/link";
import { AuthForm } from "../auth-forms";

export default function SignInPage() {
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
          Sign in to your account
        </p>
      </div>

      {/* Card */}
      <div className="card-glow p-8 space-y-6">
        {/* Decorative glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <AuthForm mode="sign-in" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              New to LLM Trust?
            </span>
          </div>
        </div>

        <Link
          href="/auth/sign-up"
          className="block w-full text-center py-2.5 px-4 rounded-lg border border-border/60 text-sm font-medium text-foreground/80 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          Create an account
        </Link>
      </div>

      {/* Footer links */}
      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-primary/80 hover:text-primary transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary/80 hover:text-primary transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
