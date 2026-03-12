import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Cookie Policy",
  description:
    "LLM Trust cookie policy. Learn about the cookies we use, why we use them, and how to manage your preferences.",
  canonical: canonicalUrl("/cookies"),
  noIndex: true,
});

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 13, 2026 · Effective immediately
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. What Are Cookies?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files placed on your device when you visit a
            website. They are widely used to make websites work efficiently, provide
            a better user experience, and supply information to site owners.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This Cookie Policy explains how LLM Trust (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;, &ldquo;our&rdquo;) uses cookies and similar tracking
            technologies on{" "}
            <span className="text-primary">llmtrust.com</span> (the
            &ldquo;Service&rdquo;). It should be read alongside our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        {/* Types of Cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Types of Cookies We Use
          </h2>

          {/* Essential */}
          <div className="bg-card border border-border rounded-lg p-5 mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                Essential
              </span>
              <h3 className="text-lg font-medium text-foreground">
                Strictly Necessary Cookies
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These cookies are required for the Service to function and cannot be
              disabled. They are typically set in response to actions you take, such
              as logging in or setting privacy preferences.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-foreground font-medium">Name</th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Purpose
                    </th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">
                      next-auth.session-token
                    </td>
                    <td className="py-2 pr-4">
                      Session authentication and user identification
                    </td>
                    <td className="py-2 pr-4">Session / 30 days</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">
                      next-auth.csrf-token
                    </td>
                    <td className="py-2 pr-4">
                      Cross-site request forgery protection
                    </td>
                    <td className="py-2 pr-4">Session</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">__Host-next-auth.csrf-token</td>
                    <td className="py-2 pr-4">
                      CSRF protection (host-locked, secure)
                    </td>
                    <td className="py-2 pr-4">Session</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">theme</td>
                    <td className="py-2 pr-4">
                      Stores your light/dark mode preference
                    </td>
                    <td className="py-2 pr-4">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">cookie-consent</td>
                    <td className="py-2 pr-4">
                      Stores your cookie preferences
                    </td>
                    <td className="py-2 pr-4">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-card border border-border rounded-lg p-5 mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent">
                Analytics
              </span>
              <h3 className="text-lg font-medium text-foreground">
                Analytics & Performance Cookies
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These cookies help us understand how visitors interact with the
              Service by collecting and reporting information anonymously. They
              allow us to measure traffic, identify popular pages, and improve
              performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Consent required.</strong> These
              cookies are only set after you provide consent.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-foreground font-medium">Name</th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Provider
                    </th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Purpose
                    </th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">_vercel_analytics</td>
                    <td className="py-2 pr-4">Vercel</td>
                    <td className="py-2 pr-4">
                      Page views and visitor analytics (anonymized)
                    </td>
                    <td className="py-2 pr-4">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">_vercel_speed_insights</td>
                    <td className="py-2 pr-4">Vercel</td>
                    <td className="py-2 pr-4">
                      Core Web Vitals and performance metrics
                    </td>
                    <td className="py-2 pr-4">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Functional */}
          <div className="bg-card border border-border rounded-lg p-5 mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                Functional
              </span>
              <h3 className="text-lg font-medium text-foreground">
                Functional Cookies
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These cookies enable enhanced functionality and personalization, such
              as remembering your preferences (language, filters, sort order) and
              improving your experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Consent required.</strong> These
              cookies are set only after you provide consent.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-foreground font-medium">Name</th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Purpose
                    </th>
                    <th className="py-2 pr-4 text-foreground font-medium">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">model-filters</td>
                    <td className="py-2 pr-4">
                      Remembers your model list filter preferences
                    </td>
                    <td className="py-2 pr-4">30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">recent-models</td>
                    <td className="py-2 pr-4">
                      Tracks recently viewed models for quick access
                    </td>
                    <td className="py-2 pr-4">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. Third-Party Cookies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Some cookies are set by third-party services that appear on our pages.
            We do not control these cookies. The third-party services we use
            include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Vercel Analytics:</strong> Privacy-friendly,
              anonymized page view analytics. No personal data is sent to Vercel.{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vercel Privacy Policy ↗
              </a>
            </li>
            <li>
              <strong className="text-foreground">OAuth Providers (GitHub, Google):</strong>{" "}
              Authentication cookies set during the login flow. These are governed
              by the respective provider&rsquo;s privacy policies.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We do <strong className="text-foreground">not</strong> use advertising
            cookies, social media tracking pixels, or any cross-site behavioral
            tracking.
          </p>
        </section>

        {/* Managing Preferences */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Managing Your Cookie Preferences
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4">
            4.1 On Our Service
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            When you first visit LLM Trust, you are presented with a cookie consent
            banner. You can accept all cookies, reject non-essential cookies, or
            customize your preferences by category.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You can change your preferences at any time by clearing your
            <code className="text-xs bg-muted px-1 py-0.5 rounded text-foreground mx-1">
              cookie-consent
            </code>
            cookie in your browser settings, which will trigger the consent banner
            again on your next visit.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            4.2 Through Your Browser
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Most web browsers allow you to control cookies through their settings.
            You can typically find these options under &ldquo;Settings&rdquo; →
            &ldquo;Privacy&rdquo; or &ldquo;Cookies&rdquo;. Here are links to
            cookie management for common browsers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Chrome ↗
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mozilla Firefox ↗
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Apple Safari ↗
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Microsoft Edge ↗
              </a>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Note: Disabling essential cookies may prevent the Service from
            functioning correctly, including the ability to log in.
          </p>
        </section>

        {/* Local Storage */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. Similar Technologies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In addition to cookies, we use:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Local Storage:</strong> Used to
              cache model data, comparison state, and UI preferences on your device.
              This data is not transmitted to our servers.
            </li>
            <li>
              <strong className="text-foreground">Session Storage:</strong> Used for
              temporary data during a single browsing session (e.g., form state).
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            These technologies are used to improve performance and user experience.
            They do not track you across websites.
          </p>
        </section>

        {/* Do Not Track */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. Do Not Track
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal. We
            respect DNT signals: when detected, we do not set any non-essential
            cookies or analytics tracking.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. Contact Us
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about our use of cookies or this policy, contact
            us:
          </p>
          <div className="bg-card border border-border rounded-lg p-5 mt-3">
            <p className="text-foreground font-medium">LLM Trust</p>
            <p className="text-muted-foreground mt-1">
              Privacy:{" "}
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
          </div>
        </section>

        {/* Changes */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. Changes to This Policy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time. Changes will be
            posted on this page with an updated &ldquo;Last updated&rdquo; date.
            For significant changes, we will provide additional notice through the
            Service.
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-6 text-sm">
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy →
        </Link>
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service →
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
