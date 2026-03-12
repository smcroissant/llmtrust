import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation — Get Started with Open-Source LLMs",
  description: "Learn how to discover, download & run open-source LLMs locally. Install guides for Ollama, llama.cpp, vLLM & more.",
  canonical: canonicalUrl("/docs"),
});

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
        <h1 className="text-3xl font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground mb-8">
          Learn how to discover, download, and run open-source LLMs locally.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
            <p className="text-sm text-muted-foreground">
              Install the LLM Trust CLI and start running models locally in minutes.
            </p>
          </div>
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Browse Models</h2>
            <p className="text-sm text-muted-foreground">
              Discover the right model for your use case with detailed specs and comparisons.
            </p>
            <Link href="/models" className="text-primary text-sm mt-2 inline-block hover:underline">
              Browse models →
            </Link>
          </div>
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Run Locally</h2>
            <p className="text-sm text-muted-foreground">
              Use Ollama, llama.cpp, or our desktop app to run models on your hardware.
            </p>
          </div>
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">API Reference</h2>
            <p className="text-sm text-muted-foreground">
              Integrate LLM Trust into your applications with our REST API.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
