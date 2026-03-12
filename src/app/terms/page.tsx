import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description:
    "LLM Trust terms of service. Usage guidelines, user responsibilities & legal terms for using our LLM discovery platform.",
  canonical: canonicalUrl("/terms"),
  noIndex: true,
});

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 13, 2026 · Effective immediately
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using LLM Trust at{" "}
            <span className="text-primary">llmtrust.com</span> (the
            &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
            (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use
            the Service.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            These Terms constitute a legally binding agreement between you
            (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and LLM Trust (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;, &ldquo;our&rdquo;). By creating an account or using the
            Service in any capacity, you confirm that you are at least 16 years old
            and have the legal capacity to enter into this agreement.
          </p>
        </section>

        {/* Description of Service */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Description of the Service
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LLM Trust is a platform for discovering, comparing, reviewing, and
            downloading open-source large language models (LLMs). Our Service
            includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              A curated database of open-source LLMs with benchmarks, metrics, and
              metadata.
            </li>
            <li>
              Side-by-side model comparison tools and search functionality.
            </li>
            <li>
              Community reviews, ratings, and user-generated content.
            </li>
            <li>
              API access for programmatic querying of our model database.
            </li>
            <li>
              Model submission tools for contributors.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any aspect of
            the Service at any time without prior notice.
          </p>
        </section>

        {/* User Accounts */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. User Accounts
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4">
            3.1 Account Creation
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            To access certain features, you must create an account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Provide accurate, current, and complete information during
              registration.
            </li>
            <li>
              Maintain and promptly update your account information as needed.
            </li>
            <li>
              Maintain the security of your credentials and not share them with
              others.
            </li>
            <li>
              Accept responsibility for all activities under your account.
            </li>
            <li>
              Notify us immediately at{" "}
              <a
                href="mailto:support@llmtrust.com"
                className="text-primary hover:underline"
              >
                support@llmtrust.com
              </a>{" "}
              of any unauthorized access.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            3.2 API Keys
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            API keys provided to you are confidential and intended for your
            personal or organizational use only. You must not share, publish, or
            expose API keys in client-side code, public repositories, or any
            publicly accessible location. We reserve the right to revoke API keys
            that are misused or compromised without liability.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            3.3 Account Termination
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We may suspend or terminate your account if you violate these Terms,
            engage in abusive behavior, or for any reason with reasonable notice.
            You may delete your account at any time through your account settings.
          </p>
        </section>

        {/* Acceptable Use */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Acceptable Use
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Use the Service for any unlawful purpose or in violation of
              applicable laws.
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service or its
              underlying systems.
            </li>
            <li>
              Scrape, crawl, or harvest data from the Service without our prior
              written consent (except through the official API within rate limits).
            </li>
            <li>
              Upload malicious code, viruses, or any harmful content.
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation.
            </li>
            <li>
              Interfere with or disrupt the Service or its infrastructure.
            </li>
            <li>
              Use automated means to access the Service in a manner that exceeds
              reasonable usage or places disproportionate load on our systems.
            </li>
          </ul>
        </section>

        {/* User Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. User-Generated Content
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4">
            5.1 Model Submissions
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            When you submit model metadata, reviews, or other content to the
            Service:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              You represent that you have the right to submit such content and that
              it does not infringe any third-party rights.
            </li>
            <li>
              You retain ownership of your content but grant us a worldwide,
              non-exclusive, royalty-free license to use, display, reproduce, and
              distribute it in connection with the Service.
            </li>
            <li>
              You are responsible for ensuring that submitted model metadata
              accurately represents the model and complies with its original
              license.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            5.2 Content Moderation
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right (but have no obligation) to review, edit, or
            remove any user-generated content that violates these Terms or is
            otherwise objectionable. We do not endorse or guarantee the accuracy of
            user-submitted content.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. Intellectual Property
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4">
            6.1 Our IP
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            The Service, including its design, code, branding, database structure,
            and original content (excluding user-generated content), is owned by LLM
            Trust and protected by intellectual property laws. You may not copy,
            modify, distribute, or create derivative works based on the Service
            without our express written permission.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            6.2 Third-Party Models
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Models listed on LLM Trust are developed and licensed by third parties.
            Each model is subject to its own license (e.g., Apache 2.0, MIT,
            Llama License). LLM Trust is not the author or licensor of these
            models. You are responsible for reviewing and complying with each
            model&rsquo;s license before use.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            6.3 DMCA / Takedown
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            If you believe content on the Service infringes your intellectual
            property rights, contact us at{" "}
            <a
              href="mailto:legal@llmtrust.com"
              className="text-primary hover:underline"
            >
              legal@llmtrust.com
            </a>{" "}
            with a detailed notice. We will investigate and respond in accordance
            with applicable law.
          </p>
        </section>

        {/* Disclaimer & Limitation */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</li>
            <li>
              The accuracy, completeness, or reliability of model benchmarks,
              metadata, or reviews.
            </li>
            <li>
              Uninterrupted, secure, or error-free operation of the Service.
            </li>
            <li>
              The suitability of any model for your specific use case.
            </li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LLM TRUST AND ITS AFFILIATES,
            OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Any indirect, incidental, special, consequential, or punitive damages.
            </li>
            <li>
              Loss of profits, data, use, goodwill, or other intangible losses.
            </li>
            <li>
              Damages resulting from your access to or use of (or inability to
              access or use) the Service.
            </li>
            <li>
              Damages arising from models downloaded from or through the Service.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Our total liability for any claims arising under these Terms shall not
            exceed the amount you paid us in the 12 months preceding the claim, or
            €100, whichever is greater.
          </p>
        </section>

        {/* Indemnification */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            9. Indemnification
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to indemnify and hold harmless LLM Trust and its affiliates
            from any claims, damages, losses, or expenses (including reasonable
            legal fees) arising from your use of the Service, your violation of
            these Terms, or your infringement of any third-party rights.
          </p>
        </section>

        {/* Modifications */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            10. Modifications to Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may revise these Terms at any time by posting an updated version on
            this page. Material changes will be communicated via email or a
            prominent notice on the Service at least 30 days before taking effect.
            Your continued use of the Service after changes become effective
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            11. Governing Law & Disputes
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms are governed by the laws of France. Any disputes arising
            from these Terms or the Service shall be subject to the exclusive
            jurisdiction of the courts of Paris, France. For EU consumers, this
            does not affect your mandatory rights under local consumer protection
            laws.
          </p>
        </section>

        {/* Severability */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            12. Severability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If any provision of these Terms is found to be unenforceable, the
            remaining provisions will continue in full force and effect. The
            unenforceable provision shall be modified to the minimum extent
            necessary to make it enforceable.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            13. Contact
          </h2>
          <div className="bg-card border border-border rounded-lg p-5 mt-3">
            <p className="text-foreground font-medium">LLM Trust</p>
            <p className="text-muted-foreground mt-1">
              Legal:{" "}
              <a
                href="mailto:legal@llmtrust.com"
                className="text-primary hover:underline"
              >
                legal@llmtrust.com
              </a>
            </p>
            <p className="text-muted-foreground">
              Support:{" "}
              <a
                href="mailto:support@llmtrust.com"
                className="text-primary hover:underline"
              >
                support@llmtrust.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-6 text-sm">
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy →
        </Link>
        <Link href="/cookies" className="text-primary hover:underline">
          Cookie Policy →
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
