import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "LLM Trust privacy policy. Learn how we collect, use & protect your data. We never sell personal information.",
  canonical: canonicalUrl("/privacy"),
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly (account details, email) and
            usage data (models browsed, search queries) to improve our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use your information to provide and improve the service, send updates,
            and ensure platform security. We do not sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Data Storage</h2>
          <p className="text-muted-foreground">
            Your data is stored securely using industry-standard encryption.
            We use Neon Postgres for database storage and follow best practices for data protection.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, correct, or delete your personal data.
            Contact us to exercise these rights.
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
