import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import {
  BookOpen,
  Search,
  GitCompareArrows,
  Upload,
  Code2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation — LLM Trust",
  description:
    "Complete docs for LLM Trust. Browse 200+ open-source LLMs, compare models, use the API, and contribute. Get started in minutes.",
  canonical: canonicalUrl("/docs"),
});

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    content: (
      <>
        <p className="mb-4">
          Welcome to LLM Trust! This guide will help you get up and running in minutes.
        </p>
        <h3 className="font-semibold text-lg mb-2">What is LLM Trust?</h3>
        <p className="mb-4">
          LLM Trust is the developer&apos;s platform for discovering, comparing, and reviewing
          open-source large language models. We provide real benchmarks, community reviews,
          and side-by-side comparisons so you can find the best model for your project.
        </p>
        <h3 className="font-semibold text-lg mb-2">Quick Start</h3>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            <strong>Browse models</strong> — Head to{" "}
            <Link href="/models" className="text-primary hover:underline">
              /models
            </Link>{" "}
            to explore 200+ LLMs
          </li>
          <li>
            <strong>Create an account</strong> — Sign up to save favorites, leave reviews,
            and submit models
          </li>
          <li>
            <strong>Compare</strong> — Pick two models and see a detailed side-by-side
            comparison
          </li>
          <li>
            <strong>Contribute</strong> — Share your experience by reviewing models
            you&apos;ve used
          </li>
        </ol>
        <h3 className="font-semibold text-lg mb-2">Installation (CLI)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto mb-4">
          <code>{`# Install via npm
npm install -g @llmtrust/cli

# Or with Homebrew
brew install llmtrust

# Search for a model
llmt search "code generation"

# Run a model locally
llmt run deepseek-coder-v2`}</code>
        </pre>
      </>
    ),
  },
  {
    id: "browse-models",
    title: "How to Browse Models",
    icon: Search,
    content: (
      <>
        <p className="mb-4">
          The{" "}
          <Link href="/models" className="text-primary hover:underline">
            Models page
          </Link>{" "}
          is your starting point for discovering LLMs.
        </p>
        <h3 className="font-semibold text-lg mb-2">Search & Filter</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Search bar</strong> — Type a model name, architecture, or keyword
          </li>
          <li>
            <strong>Category badges</strong> — Filter by use case: text-generation, code,
            vision, embedding
          </li>
          <li>
            <strong>Sort options</strong> — Order by popularity, newest, downloads, or name
          </li>
        </ul>
        <h3 className="font-semibold text-lg mb-2">Model Cards</h3>
        <p className="mb-4">
          Each model card shows key information at a glance:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Parameter count</strong> — e.g., &quot;7B&quot;, &quot;70B&quot;,
            &quot;8x7B&quot; (MoE)
          </li>
          <li>
            <strong>Architecture</strong> — e.g., llama, mistral, qwen
          </li>
          <li>
            <strong>Category</strong> — Primary use case
          </li>
          <li>
            <strong>License</strong> — Apache 2.0, MIT, Llama Community, etc.
          </li>
          <li>
            <strong>Download count</strong> — Community adoption signal
          </li>
        </ul>
        <h3 className="font-semibold text-lg mb-2">Model Detail Page</h3>
        <p className="mb-4">
          Click any model card to see the full detail page with:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Complete specifications and benchmarks</li>
          <li>Community reviews and ratings</li>
          <li>One-command CLI run instructions</li>
          <li>HuggingFace download link</li>
          <li>Related models and comparisons</li>
        </ul>
      </>
    ),
  },
  {
    id: "compare-models",
    title: "How to Compare Models",
    icon: GitCompareArrows,
    content: (
      <>
        <p className="mb-4">
          Side-by-side comparison helps you choose between models for your specific needs.
        </p>
        <h3 className="font-semibold text-lg mb-2">How to Compare</h3>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            Go to{" "}
            <Link href="/compare" className="text-primary hover:underline">
              /compare
            </Link>
          </li>
          <li>Select two models from the dropdowns</li>
          <li>View the comparison table with specs, benchmarks, and reviews</li>
        </ol>
        <h3 className="font-semibold text-lg mb-2">Direct URL</h3>
        <p className="mb-4">
          You can also link directly to a comparison using the URL format:
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto mb-4">
          <code>{`/compare/[model-a-slug]/vs/[model-b-slug]

# Example
/compare/llama-3-70b-vs-gpt-4/page`}</code>
        </pre>
        <h3 className="font-semibold text-lg mb-2">What&apos;s Compared</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Parameter count and architecture</li>
          <li>Context length and training data</li>
          <li>License and pricing</li>
          <li>Benchmark scores (MMLU, HumanEval, etc.)</li>
          <li>Community ratings and reviews</li>
          <li>Download statistics</li>
        </ul>
      </>
    ),
  },
  {
    id: "upload-model",
    title: "How to Upload a Model",
    icon: Upload,
    content: (
      <>
        <p className="mb-4">
          Any registered user can submit an open-source model for listing on LLM Trust.
        </p>
        <h3 className="font-semibold text-lg mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>A free LLM Trust account</li>
          <li>The model must be open-source with a valid license</li>
          <li>A public HuggingFace (or equivalent) download URL</li>
        </ul>
        <h3 className="font-semibold text-lg mb-2">Upload Process</h3>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            Go to{" "}
            <Link href="/models/upload" className="text-primary hover:underline">
              /models/upload
            </Link>
          </li>
          <li>
            <strong>Basic Info</strong> — Name, slug (auto-generated), and description
          </li>
          <li>
            <strong>Technical</strong> — Architecture, parameter count, context length,
            license, category
          </li>
          <li>
            <strong>Links</strong> — HuggingFace download URL
          </li>
          <li>
            <strong>Details</strong> — Format (GGUF, Safetensors, etc.) and tags
          </li>
          <li>
            <strong>Preview</strong> — Review your model card before submitting
          </li>
        </ol>
        <h3 className="font-semibold text-lg mb-2">Review Process</h3>
        <p className="mb-4">
          All submissions are reviewed by our team before publication to ensure quality
          and accuracy. You&apos;ll receive an email once your model is approved.
        </p>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Include a detailed description and accurate
            benchmarks to speed up the review process.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Code2,
    content: (
      <>
        <p className="mb-4">
          LLM Trust provides a REST API for integrating model data into your applications.
        </p>
        <h3 className="font-semibold text-lg mb-2">Authentication</h3>
        <p className="mb-4">
          Generate an API key from your{" "}
          <Link href="/dashboard/api-keys" className="text-primary hover:underline">
            Dashboard → API Keys
          </Link>
          . Include it in the <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
            Authorization
          </code>{" "}
          header:
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto mb-4">
          <code>{`Authorization: Bearer llmt_your_api_key_here`}</code>
        </pre>
        <h3 className="font-semibold text-lg mb-2">Endpoints</h3>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border p-3">
            <code className="text-sm font-mono text-primary">GET /api/v1/models</code>
            <p className="text-sm text-muted-foreground mt-1">
              List all models with pagination, search, and filters
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <code className="text-sm font-mono text-primary">
              GET /api/v1/models/:slug
            </code>
            <p className="text-sm text-muted-foreground mt-1">
              Get detailed info for a specific model
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <code className="text-sm font-mono text-primary">
              GET /api/v1/models/:slug/reviews
            </code>
            <p className="text-sm text-muted-foreground mt-1">
              Get community reviews for a model
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <code className="text-sm font-mono text-primary">
              POST /api/v1/models/:slug/reviews
            </code>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a review (authenticated)
            </p>
          </div>
        </div>
        <p>
          Full API documentation with request/response schemas is available at{" "}
          <Link href="/docs/api" className="text-primary hover:underline">
            /docs/api
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    content: (
      <>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">Is LLM Trust free to use?</h3>
            <p className="text-muted-foreground">
              Yes! Browsing models, reading reviews, and comparing models is completely
              free. Creating an account is also free and unlocks saving favorites and
              writing reviews.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Do you host the models?</h3>
            <p className="text-muted-foreground">
              No. LLM Trust is a discovery and comparison platform. We link to
              HuggingFace and other hosting providers for downloads. Models are run
              locally on your machine.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">How are benchmarks calculated?</h3>
            <p className="text-muted-foreground">
              We aggregate benchmark results from model creators, independent
              evaluations, and community testing. Each benchmark source is clearly
              attributed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Can I submit a commercial model?</h3>
            <p className="text-muted-foreground">
              LLM Trust focuses on open-source models. Models must have a recognized
              open-source license (Apache 2.0, MIT, Llama Community, etc.) to be listed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">How do I get the Trusted Reviewer badge?</h3>
            <p className="text-muted-foreground">
              Write 3+ helpful reviews that receive positive community feedback. Our team
              reviews reviewer quality periodically and awards the badge to consistent
              contributors.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">
              I found inaccurate information. How do I report it?
            </h3>
            <p className="text-muted-foreground">
              Use the &quot;Suggest Edit&quot; button on any model page, or email us at{" "}
              <a
                href="mailto:support@llmtrust.com"
                className="text-primary hover:underline"
              >
                support@llmtrust.com
              </a>
              . We review all reports within 24 hours.
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export default function DocsPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs" },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Documentation</h1>
          <p className="text-muted-foreground mb-8">
            Everything you need to discover, compare, and contribute open-source LLMs.
          </p>

          {/* Table of Contents */}
          <nav className="mb-12 rounded-lg border bg-muted/30 p-6">
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              On this page
            </h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="space-y-16">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="size-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Help CTA */}
          <div className="mt-16 rounded-xl border bg-muted/30 p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our team is here to help. Reach out and we&apos;ll get back to you within 24
              hours.
            </p>
            <a
              href="mailto:support@llmtrust.com"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
