import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { BreadcrumbJsonLd } from "@/components/seo/structured-data";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import {
  Trophy,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  Code2,
  Terminal,
  FileCode2,
  GitBranch,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Best Code LLMs in 2026 — Top Models for Developers",
  description:
    "Best LLMs for coding in 2026: code generation, debugging, refactoring & completion. Ranked by HumanEval, MBPP, real developer workflows & benchmark data.",
  canonical: canonicalUrl("/best/code-llms"),
  type: "article",
});

const codeModels = [
  {
    rank: 1,
    name: "DeepSeek Coder V2",
    developer: "DeepSeek",
    params: "236B (MoE)",
    humaneval: "90.2",
    mbpp: "84.0",
    context: "128K",
    languages: "Python, JS, TS, Go, Rust, C++",
    highlight: "Top HumanEval score. Excels at complex multi-file refactoring and system design.",
    slug: "deepseek-coder-v2",
  },
  {
    rank: 2,
    name: "Llama 3.1 405B",
    developer: "Meta AI",
    params: "405B",
    humaneval: "89.0",
    mbpp: "82.5",
    context: "128K",
    languages: "All major languages",
    highlight: "Best all-rounder. Strong code generation with excellent general reasoning for complex tasks.",
    slug: "llama-3-405b",
  },
  {
    rank: 3,
    name: "Qwen 2.5 Coder 32B",
    developer: "Alibaba",
    params: "32B",
    humaneval: "88.4",
    mbpp: "80.0",
    context: "32K",
    languages: "Python, JS, Java, C++, Go",
    highlight: "Best mid-size coding model. Runs on a single high-end GPU with near-top performance.",
    slug: "qwen-2-coder-32b",
  },
  {
    rank: 4,
    name: "CodeLlama 70B",
    developer: "Meta AI",
    params: "70B",
    humaneval: "81.7",
    mbpp: "76.0",
    context: "16K",
    languages: "Python, JS, TS, Java, C++",
    highlight: "Purpose-built for code. Infilling support for IDE completion. Excellent Python generation.",
    slug: "codellama-70b",
  },
  {
    rank: 5,
    name: "StarCoder2 15B",
    developer: "BigCode",
    params: "15B",
    humaneval: "72.6",
    mbpp: "68.0",
    context: "16K",
    languages: "600+ languages",
    highlight: "Trained on The Stack v2. Best language coverage. Apache 2.0 licensed for commercial use.",
    slug: "starcoder2-15b",
  },
  {
    rank: 6,
    name: "Llama 3.1 70B",
    developer: "Meta AI",
    params: "70B",
    humaneval: "81.7",
    mbpp: "75.0",
    context: "128K",
    languages: "All major languages",
    highlight: "Great balance of coding and general capability. Runs on 2 GPUs with 4-bit quantization.",
    slug: "llama-3-70b",
  },
  {
    rank: 7,
    name: "Mistral Large 2",
    developer: "Mistral AI",
    params: "123B",
    humaneval: "84.0",
    mbpp: "78.0",
    context: "128K",
    languages: "Python, JS, TS, Java, Rust",
    highlight: "Strong coding with excellent multilingual code comments and documentation generation.",
    slug: "mistral-large-2",
  },
  {
    rank: 8,
    name: "Phi-3 Medium",
    developer: "Microsoft",
    params: "14B",
    humaneval: "78.0",
    mbpp: "72.0",
    context: "128K",
    languages: "Python, JS, C++, Java",
    highlight: "Punches way above its weight. Runs on a single consumer GPU with surprisingly good code quality.",
    slug: "phi-3-medium",
  },
  {
    rank: 9,
    name: "DeepSeek Coder V2 Lite",
    developer: "DeepSeek",
    params: "16B (MoE)",
    humaneval: "82.0",
    mbpp: "74.0",
    context: "128K",
    languages: "Python, JS, TS, Go, Rust",
    highlight: "MoE efficiency. Only 2.4B active params per token. Runs on laptops with strong coding.",
    slug: "deepseek-coder-v2-lite",
  },
  {
    rank: 10,
    name: "CodeGemma 7B",
    developer: "Google",
    params: "7B",
    humaneval: "65.0",
    mbpp: "60.0",
    context: "8K",
    languages: "Python, JS, Java, C++",
    highlight: "Google's code specialist. Good for autocomplete and simple code generation. Easy to deploy.",
    slug: "codegemma-7b",
  },
];

const useCases = [
  { icon: Code2, title: "Code Generation", description: "Generate functions, classes, and modules from natural language descriptions. Best: DeepSeek Coder V2, Llama 3.1 405B." },
  { icon: Terminal, title: "Code Completion", description: "Real-time IDE autocomplete with context awareness. Best: CodeLlama, StarCoder2, DeepSeek Coder Lite." },
  { icon: FileCode2, title: "Code Review & Debugging", description: "Analyze code for bugs, suggest fixes, and improve code quality. Best: Llama 3.1 405B, Qwen 2.5 Coder." },
  { icon: GitBranch, title: "Refactoring & Migration", description: "Refactor legacy code, migrate between languages, modernize codebases. Best: DeepSeek Coder V2, Mistral Large 2." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Code LLMs in 2026",
  description: "Top 10 LLMs for coding ranked by HumanEval, MBPP benchmarks and real developer workflows.",
  numberOfItems: 10,
  itemListElement: codeModels.map((m) => ({
    "@type": "ListItem",
    position: m.rank,
    url: `https://llmtrust.com/models/${m.slug}`,
    name: m.name,
    description: m.highlight,
  })),
};

export default function BestCodeLlmsPage() {
  return (
    <>
      <Script
        id="jsonld-best-code-llms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Best Of", url: "https://llmtrust.com/best" },
          { name: "Code LLMs", url: "https://llmtrust.com/best/code-llms" },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Best Of", href: "/best" },
          { label: "Code LLMs" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-10 p-6 md:p-8 max-w-5xl mx-auto">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Code2 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Best Code LLMs in 2026
              </h1>
              <p className="text-muted-foreground mt-1">Top 10 Models for Developers & Code Generation</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Whether you&apos;re generating boilerplate, debugging complex algorithms, or refactoring legacy code,
            the right code LLM can 10x your productivity. We rank the top 10 coding models by HumanEval,
            MBPP, and real-world developer workflows.
          </p>
          <div className="neural-line" />
        </header>

        {/* Use Cases */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Coding Use Cases</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc) => (
              <GlowCard key={uc.title} className="text-center p-4">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <uc.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{uc.title}</h3>
                <p className="text-xs text-muted-foreground">{uc.description}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Top 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            Top 3 Code Models
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {codeModels.slice(0, 3).map((m, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <GlowCard key={m.name}>
                  <GlowCardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{medals[i]}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {m.humaneval}% HumanEval
                      </span>
                    </div>
                    <GlowCardTitle className="text-base">{m.name}</GlowCardTitle>
                  </GlowCardHeader>
                  <GlowCardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{m.highlight}</p>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div>
                        <p className="font-mono font-bold text-primary">{m.humaneval}%</p>
                        <p className="text-muted-foreground">HumanEval</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">{m.mbpp}%</p>
                        <p className="text-muted-foreground">MBPP</p>
                      </div>
                    </div>
                    <Link href={`/models/${m.slug}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      View model <ArrowRight className="size-3" />
                    </Link>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </div>
        </section>

        {/* Full Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Complete Top 10</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-3 font-semibold">#</th>
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-center py-3 px-3 font-semibold">Size</th>
                  <th className="text-center py-3 px-3 font-semibold">HumanEval</th>
                  <th className="text-center py-3 px-3 font-semibold">MBPP</th>
                  <th className="text-center py-3 px-3 font-semibold">Context</th>
                </tr>
              </thead>
              <tbody>
                {codeModels.map((m) => (
                  <tr key={m.name} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="py-3 px-3 font-bold text-primary">#{m.rank}</td>
                    <td className="py-3 px-3">
                      <Link href={`/models/${m.slug}`} className="font-medium hover:text-primary transition-colors">
                        {m.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.developer} · {m.languages}</p>
                    </td>
                    <td className="text-center py-3 px-3 font-mono">{m.params}</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.humaneval}%</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.mbpp}%</td>
                    <td className="text-center py-3 px-3 font-mono">{m.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Reviews */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Detailed Reviews</h2>
          {codeModels.map((m) => (
            <GlowCard key={m.name}>
              <GlowCardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    #{m.rank}
                  </span>
                  <div>
                    <GlowCardTitle className="text-lg">{m.name}</GlowCardTitle>
                    <p className="text-xs text-muted-foreground">{m.developer} · {m.params} · {m.context} context</p>
                  </div>
                </div>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{m.highlight}</p>
                <div className="flex flex-wrap gap-2">
                  {m.languages.split(", ").map((lang) => (
                    <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.humaneval}%</p>
                    <p className="text-xs text-muted-foreground">HumanEval</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.mbpp}%</p>
                    <p className="text-xs text-muted-foreground">MBPP</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold">{m.context}</p>
                    <p className="text-xs text-muted-foreground">Context</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold">{m.params}</p>
                    <p className="text-xs text-muted-foreground">Parameters</p>
                  </div>
                </div>
                <Link href={`/models/${m.slug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  View full specs <ArrowRight className="size-3.5" />
                </Link>
              </GlowCardContent>
            </GlowCard>
          ))}
        </section>

        {/* Recommendation */}
        <GlowCard className="border-primary/30">
          <GlowCardHeader>
            <GlowCardTitle>Our Recommendation for Developers</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="text-sm leading-relaxed space-y-2">
            <p>
              For <strong>maximum code quality</strong>: DeepSeek Coder V2 with its 90.2% HumanEval score is unmatched.
              For <strong>running locally</strong>: Qwen 2.5 Coder 32B delivers near-top performance on a single GPU.
              For <strong>IDE autocomplete</strong>: DeepSeek Coder V2 Lite runs on laptops with only 2.4B active parameters.
            </p>
            <p>
              Pair these with our comparison guides:{" "}
              <Link href="/compare/llama-3-70b-vs-gpt-4" className="text-primary hover:underline">Llama 3 vs GPT-4</Link>
              {" "}&middot;{" "}
              <Link href="/best/small-llms" className="text-primary hover:underline">Best Small LLMs</Link>
              {" "}&middot;{" "}
              <Link href="/best/open-source-llms" className="text-primary hover:underline">Best Open-Source LLMs</Link>
            </p>
          </GlowCardContent>
        </GlowCard>

        <section className="space-y-4 border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">More Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/best/open-source-llms", label: "Best Open-Source LLMs" },
              { href: "/best/small-llms", label: "Best Small LLMs" },
              { href: "/compare/phi-3-mini-vs-gemma-2-9b", label: "Phi-3 vs Gemma 2" },
              { href: "/compare/llama-3-70b-vs-gpt-4", label: "Llama 3 vs GPT-4" },
              { href: "/blog", label: "LLM Trust Blog" },
              { href: "/models", label: "Browse All Models" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="size-3.5" /> {link.label}
              </Link>
            ))}
          </div>
        </section>

        <footer className="text-xs text-muted-foreground border-t border-border/40 pt-4 pb-8">
          Last updated: March 12, 2026 · Benchmarks from official reports and independent evaluations ·{" "}
          <Link href="/models" className="text-primary hover:underline">Browse all models</Link>
        </footer>
      </div>
    </>
  );
}
