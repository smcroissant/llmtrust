import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { GitCompareArrows } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Compare LLM Models Side by Side",
  description: "Compare open-source LLMs head-to-head. Benchmarks, pricing, features & real-world performance. Find the best AI model for your use case.",
  canonical: canonicalUrl("/compare"),
});

export default function ComparePage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare" },
        ]}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <GitCompareArrows className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Compare LLM Models</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Select two models to compare their capabilities, performance benchmarks, pricing, and specifications side by side.
        </p>
        <Link
          href="/models"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Models
        </Link>
        <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
          Or start with our{" "}
          <Link href="/blog/gpt-4-vs-claude-3-vs-llama-3-comparison" className="text-primary hover:underline">
            GPT-4 vs Claude 3 vs Llama 3 comparison
          </Link>
          {" "}to see how the top models stack up.
        </p>
      </div>
    </>
  );
}
