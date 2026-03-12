import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "LLM Trust privacy policy. Learn how we collect, use & protect your data. GDPR-compliant. We never sell personal information.",
  canonical: canonicalUrl("/privacy"),
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 13, 2026 · Effective immediately
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. Introduction
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LLM Trust (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is
            committed to protecting your privacy. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your personal data when you
            use our platform at{" "}
            <span className="text-primary">llmtrust.com</span> (the
            &ldquo;Service&rdquo;).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We comply with the General Data Protection Regulation (EU) 2016/679
            (&ldquo;GDPR&rdquo;) and other applicable data protection laws. For
            the purposes of the GDPR, LLM Trust acts as the{" "}
            <strong className="text-foreground">Data Controller</strong> of your
            personal data.
          </p>
        </section>

        {/* Data We Collect */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Data We Collect
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Account data:</strong> Name,
              email address, and password (hashed) when you create an account.
            </li>
            <li>
              <strong className="text-foreground">Profile data:</strong>{" "}
              Username, avatar, and optional bio information.
            </li>
            <li>
              <strong className="text-foreground">User-generated content:</strong>{" "}
              Model reviews, comments, ratings, and uploaded model metadata.
            </li>
            <li>
              <strong className="text-foreground">Communications:</strong> Messages
              sent through our contact forms, support tickets, or email.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            2.2 Information Collected Automatically
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Usage data:</strong> Pages
              visited, models browsed, search queries, click patterns, and feature
              usage.
            </li>
            <li>
              <strong className="text-foreground">Device data:</strong> IP address,
              browser type and version, operating system, and screen resolution.
            </li>
            <li>
              <strong className="text-foreground">Log data:</strong> Access times,
              error logs, and referring URLs.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            2.3 Information from Third Parties
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            When you sign in via OAuth providers (GitHub, Google), we receive your
            name, email address, and profile picture as authorized by you during
            the authentication flow.
          </p>
        </section>

        {/* Legal Basis */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. Legal Basis for Processing (GDPR Art. 6)
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Contract performance:</strong>{" "}
              Processing necessary to provide the Service (account management, model
              access, API keys).
            </li>
            <li>
              <strong className="text-foreground">Legitimate interest:</strong>{" "}
              Improving the Service, ensuring security, preventing fraud, and
              analyzing usage patterns.
            </li>
            <li>
              <strong className="text-foreground">Consent:</strong> Marketing
              communications, non-essential cookies. You may withdraw consent at
              any time.
            </li>
            <li>
              <strong className="text-foreground">Legal obligation:</strong>{" "}
              Compliance with applicable laws and regulatory requirements.
            </li>
          </ul>
        </section>

        {/* Cookies & Tracking */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Cookies & Tracking
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to operate and improve the
            Service. For detailed information on the types of cookies we use and
            how to manage your preferences, please see our{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Essential cookies are required for the Service to function (session
            management, authentication). Analytics cookies are used only with your
            consent and can be managed through your browser settings or our cookie
            preferences center.
          </p>
        </section>

        {/* Data Sharing */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. Data Sharing & Disclosure
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">
              We do not sell your personal data.
            </strong>{" "}
            We may share data only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Service providers:</strong>{" "}
              Trusted third parties who assist in operating the Service (hosting via
              Vercel, database via Neon Postgres, analytics). All providers are bound
              by data processing agreements.
            </li>
            <li>
              <strong className="text-foreground">Legal requirements:</strong> When
              required by law, regulation, or valid legal process.
            </li>
            <li>
              <strong className="text-foreground">Business transfers:</strong> In
              connection with a merger, acquisition, or sale of assets, with prior
              notice to affected users.
            </li>
            <li>
              <strong className="text-foreground">With your consent:</strong> When
              you explicitly authorize data sharing.
            </li>
          </ul>
        </section>

        {/* International Transfers */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. International Data Transfers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data may be transferred to and processed in countries outside the
            European Economic Area (EEA). When we transfer data internationally, we
            ensure appropriate safeguards are in place, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>EU Standard Contractual Clauses (SCCs)</li>
            <li>Adequacy decisions by the European Commission</li>
            <li>Binding Corporate Rules where applicable</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Data Retention
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain personal data only as long as necessary for the purposes
            described in this policy:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Account data:</strong> Until you
              delete your account, plus 30 days for backup recovery.
            </li>
            <li>
              <strong className="text-foreground">Usage logs:</strong> 12 months
              from collection.
            </li>
            <li>
              <strong className="text-foreground">Analytics data:</strong>{" "}
              Anonymized after 26 months.
            </li>
            <li>
              <strong className="text-foreground">Support communications:</strong>{" "}
              3 years from last interaction.
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. Your Rights (GDPR Chapter 3)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Under the GDPR, you have the following rights regarding your personal
            data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Right of access (Art. 15):</strong>{" "}
              Request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong className="text-foreground">
                Right to rectification (Art. 16):
              </strong>{" "}
              Request correction of inaccurate or incomplete data.
            </li>
            <li>
              <strong className="text-foreground">
                Right to erasure (Art. 17):
              </strong>{" "}
              Request deletion of your personal data (&ldquo;right to be
              forgotten&rdquo;).
            </li>
            <li>
              <strong className="text-foreground">
                Right to restriction (Art. 18):
              </strong>{" "}
              Request limitation of processing in certain circumstances.
            </li>
            <li>
              <strong className="text-foreground">
                Right to data portability (Art. 20):
              </strong>{" "}
              Receive your data in a structured, machine-readable format.
            </li>
            <li>
              <strong className="text-foreground">Right to object (Art. 21):</strong>{" "}
              Object to processing based on legitimate interest or direct marketing.
            </li>
            <li>
              <strong className="text-foreground">
                Right to withdraw consent:
              </strong>{" "}
              Withdraw consent at any time where processing is based on consent.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@llmtrust.com"
              className="text-primary hover:underline"
            >
              privacy@llmtrust.com
            </a>
            . We will respond within 30 days.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You also have the right to lodge a complaint with your local data
            protection authority if you believe we have not adequately addressed
            your concerns.
          </p>
        </section>

        {/* Security */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            9. Security Measures
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Password hashing using bcrypt with per-user salts</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls with principle of least privilege</li>
            <li>Automated monitoring and incident response procedures</li>
          </ul>
        </section>

        {/* Children */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            10. Children&rsquo;s Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service is not directed to individuals under 16 years of age. We
            do not knowingly collect personal data from children. If we become
            aware that we have collected data from a child under 16, we will take
            steps to delete it promptly.
          </p>
        </section>

        {/* DPO Contact */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            11. Data Protection Officer
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            For any questions or concerns regarding this Privacy Policy or our data
            practices, contact our Data Protection Officer:
          </p>
          <div className="bg-card border border-border rounded-lg p-5 mt-3">
            <p className="text-foreground font-medium">
              LLM Trust — Data Protection Officer
            </p>
            <p className="text-muted-foreground mt-1">
              Email:{" "}
              <a
                href="mailto:privacy@llmtrust.com"
                className="text-primary hover:underline"
              >
                privacy@llmtrust.com
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
            <p className="text-muted-foreground mt-2 text-sm">
              We aim to respond to all inquiries within 48 hours and to data subject
              requests within 30 days.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            12. Changes to This Policy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you
            of material changes by email or through a prominent notice on the
            Service. Your continued use of the Service after such changes constitutes
            acceptance of the updated policy.
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-6 text-sm">
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service →
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
