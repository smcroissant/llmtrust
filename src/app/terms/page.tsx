import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description: "LLM Trust terms of service. Usage guidelines, user responsibilities & legal terms for using our LLM discovery platform.",
  canonical: canonicalUrl("/terms"),
  noIndex: true,
});

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using LLM Trust, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
          <p className="text-muted-foreground">
            LLM Trust provides a platform for discovering and downloading open-source language models.
            Models are sourced from third-party providers and are subject to their respective licenses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the security of your account and API keys.
            You agree to provide accurate information when creating an account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Disclaimer</h2>
          <p className="text-muted-foreground">
            The service is provided &quot;as is&quot; without warranties of any kind.
            We do not guarantee the accuracy or availability of any model.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-primary text-sm hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
