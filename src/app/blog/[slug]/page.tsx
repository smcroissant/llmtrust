import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { ArrowLeft } from "lucide-react";

// Blog post data (would come from CMS/DB in production)
const posts: Record<
  string,
  { title: string; date: string; description: string; content: string }
> = {
  "ultimate-guide-open-source-llms-2026": {
    title: "The Ultimate Guide to Open-Source LLMs in 2026",
    date: "2026-01-15",
    description:
      "Everything you need to know about open-source large language models in 2026. From Llama to Mistral, discover the best models for your projects.",
    content: `<p>The landscape of open-source large language models has evolved dramatically. In this comprehensive guide, we cover the most important models, benchmarks, and how to get started.</p>
<h2>Top Models in 2026</h2>
<p>From Meta's Llama series to Mistral and beyond, open-source LLMs now rival proprietary models in many benchmarks while offering full control and privacy.</p>
<h2>Getting Started</h2>
<p>Running LLMs locally has never been easier. Tools like Ollama, LM Studio, and llama.cpp make it simple to download and run models on consumer hardware.</p>`,
  },
  "run-llama-3-locally-complete-guide": {
    title: "Run Llama 3 Locally: Complete Guide",
    date: "2026-01-20",
    description:
      "Step-by-step guide to running Llama 3 locally on your machine using Ollama, llama.cpp, and other popular tools.",
    content: `<p>Llama 3 is one of the most capable open-source models available. This guide walks you through running it locally.</p>
<h2>Prerequisites</h2>
<p>You'll need at least 8GB of RAM for smaller quantizations. For the full model, 32GB+ is recommended.</p>
<h2>Using Ollama</h2>
<p>The simplest way to run Llama 3 is with Ollama. Just run: <code>ollama run llama3</code></p>`,
  },
  "gpt-4-vs-claude-3-vs-llama-3-comparison": {
    title: "GPT-4 vs Claude 3 vs Llama 3: Comparison",
    date: "2026-02-01",
    description:
      "A detailed comparison of GPT-4, Claude 3, and Llama 3 across key benchmarks, capabilities, and use cases.",
    content: `<p>How do the top AI models compare? We break down GPT-4, Claude 3, and Llama 3 across multiple dimensions.</p>
<h2>Performance Benchmarks</h2>
<p>On MMLU, GPT-4 leads with 86.4%, followed by Claude 3 at 84.9%, and Llama 3 70B at 82.0%.</p>
<h2>Cost and Accessibility</h2>
<p>Llama 3 wins on cost—it's free and runs locally. GPT-4 and Claude 3 require API access with per-token pricing.</p>`,
  },
  "best-small-language-models-laptop": {
    title: "Best Small Language Models for Your Laptop",
    date: "2026-02-10",
    description:
      "Discover the best small language models (under 7B parameters) that run smoothly on consumer laptops.",
    content: `<p>Not everyone has a GPU cluster. Here are the best small language models that run well on regular laptops.</p>
<h2>Phi-3 Mini (3.8B)</h2>
<p>Microsoft's Phi-3 punches well above its weight, rivaling models 5x its size.</p>
<h2>Gemma 2B</h2>
<p>Google's Gemma 2B is incredibly efficient for its size, perfect for edge deployment.</p>`,
  },
  "understanding-llm-benchmarks-mmlu-humaneval": {
    title: "Understanding LLM Benchmarks: MMLU, HumanEval & More",
    date: "2026-02-20",
    description:
      "A deep dive into LLM benchmarks—what MMLU, HumanEval, GSM8K, and other metrics actually measure.",
    content: `<p>Benchmarks are how we compare LLMs, but they can be confusing. Here's what each one measures.</p>
<h2>MMLU (Massive Multitask Language Understanding)</h2>
<p>MMLU tests knowledge across 57 subjects from STEM to humanities. It's the most widely cited benchmark.</p>
<h2>HumanEval</h2>
<p>HumanEval measures code generation ability by testing whether generated code passes unit tests.</p>`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    canonical: canonicalUrl(`/blog/${slug}`),
    type: "article",
  });
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        slug={slug}
        datePublished={post.date}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Blog", url: "https://llmtrust.com/blog" },
          { name: post.title, url: `https://llmtrust.com/blog/${slug}` },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <header className="mb-8">
          <time className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl font-bold mt-2 mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
