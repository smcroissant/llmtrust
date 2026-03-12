import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, guides, and insights about open-source LLMs.",
};

const posts = [
  {
    slug: "ultimate-guide-open-source-llms-2026",
    title: "The Ultimate Guide to Open-Source LLMs in 2026",
    date: "2026-01-15",
  },
  {
    slug: "run-llama-3-locally-complete-guide",
    title: "Run Llama 3 Locally: Complete Guide",
    date: "2026-01-20",
  },
  {
    slug: "gpt-4-vs-claude-3-vs-llama-3-comparison",
    title: "GPT-4 vs Claude 3 vs Llama 3: Comparison",
    date: "2026-02-01",
  },
  {
    slug: "best-small-language-models-laptop",
    title: "Best Small Language Models for Your Laptop",
    date: "2026-02-10",
  },
  {
    slug: "understanding-llm-benchmarks-mmlu-humaneval",
    title: "Understanding LLM Benchmarks: MMLU, HumanEval & More",
    date: "2026-02-20",
  },
];

export default function BlogPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
            <p className="text-sm text-muted-foreground">
              Guides, comparisons, and insights about open-source LLMs
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1 rounded-xl border p-5 transition-colors hover:bg-muted/50"
            >
              <h2 className="font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
