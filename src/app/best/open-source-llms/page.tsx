import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import {
  CheckCircle2,
  Trophy,
  Star,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Award,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Best Open-Source LLMs in 2026 — Top 10 Ranked",
  description:
    "Top 10 best open-source LLMs in 2026 ranked by benchmarks, community adoption, licensing & real-world performance. Llama, Mistral, Gemma & more.",
  canonical: canonicalUrl("/best/open-source-llms"),
  type: "article",
});

const models = [
  {
    rank: 1,
    name: "Llama 3.1 405B",
    developer: "Meta AI",
    params: "405B",
    context: "128K",
    license: "Llama 3.1 Community",
    mmlu: "88.6",
    humaneval: "89.0",
    gsm8k: "96.8",
    category: "General Purpose",
    verdict: "The most capable open-source LLM ever released. Matches GPT-4 on most benchmarks with full weights available.",
    slug: "llama-3.1-405b",
  },
  {
    rank: 2,
    name: "Llama 3.1 70B",
    developer: "Meta AI",
    params: "70B",
    context: "128K",
    license: "Llama 3.1 Community",
    mmlu: "83.6",
    humaneval: "81.7",
    gsm8k: "95.1",
    category: "Best Value",
    verdict: "Sweet spot of capability and efficiency. Runs on 2 GPUs and handles most tasks as well as much larger models.",
    slug: "llama-3.1-70b",
  },
  {
    rank: 3,
    name: "Mixtral 8x22B",
    developer: "Mistral AI",
    params: "141B (MoE)",
    context: "64K",
    license: "Apache 2.0",
    mmlu: "77.8",
    humaneval: "75.0",
    gsm8k: "91.2",
    category: "Efficiency",
    verdict: "MoE architecture delivers excellent quality with only 39B active parameters. Best open-source MoE model.",
    slug: "mixtral-8x22b",
  },
  {
    rank: 4,
    name: "Qwen 2.5 72B",
    developer: "Alibaba",
    params: "72B",
    context: "128K",
    license: "Apache 2.0",
    mmlu: "86.1",
    humaneval: "86.4",
    gsm8k: "95.8",
    category: "Multilingual",
    verdict: "Exceptional multilingual capabilities, especially for Chinese and Asian languages. Strong coding performance.",
    slug: "qwen-2.5-72b",
  },
  {
    rank: 5,
    name: "Gemma 2 27B",
    developer: "Google",
    params: "27B",
    context: "8K",
    license: "Gemma Terms",
    mmlu: "75.2",
    humaneval: "62.8",
    gsm8k: "78.0",
    category: "Mid-Size",
    verdict: "Google's best open-weight model. Excellent instruction following and safety at a manageable size.",
    slug: "gemma-2-27b",
  },
  {
    rank: 6,
    name: "Command R+",
    developer: "Cohere",
    params: "104B",
    context: "128K",
    license: "CC-BY-NC-4.0",
    mmlu: "75.7",
    humaneval: "71.0",
    gsm8k: "82.4",
    category: "RAG & Search",
    verdict: "Purpose-built for RAG and search applications. Excellent tool use and multi-step reasoning.",
    slug: "command-r-plus",
  },
  {
    rank: 7,
    name: "DeepSeek V2.5",
    developer: "DeepSeek",
    params: "236B (MoE)",
    context: "128K",
    license: "DeepSeek License",
    mmlu: "84.0",
    humaneval: "89.2",
    gsm8k: "94.0",
    category: "Coding",
    verdict: "Exceptional coding and math performance. MoE architecture with only 21B active parameters per token.",
    slug: "deepseek-v2.5",
  },
  {
    rank: 8,
    name: "Yi-Lightning",
    developer: "01.AI",
    params: "Undisclosed",
    context: "16K",
    license: "Yi License",
    mmlu: "74.1",
    humaneval: "66.0",
    gsm8k: "82.0",
    category: "Lightweight",
    verdict: "Strong performance from a lean architecture. Good balance of capability and deployment ease.",
    slug: "yi-lightning",
  },
  {
    rank: 9,
    name: "Mistral Large 2",
    developer: "Mistral AI",
    params: "123B",
    context: "128K",
    license: "Research",
    mmlu: "84.0",
    humaneval: "84.0",
    gsm8k: "91.0",
    category: "European",
    verdict: "European AI excellence. Strong multilingual support and code generation with research availability.",
    slug: "mistral-large-2",
  },
  {
    rank: 10,
    name: "Falcon 180B",
    developer: "TII",
    params: "180B",
    context: "2K",
    license: "Apache 2.0",
    mmlu: "70.4",
    humaneval: "50.0",
    gsm8k: "65.0",
    category: "Commercial Use",
    verdict: "Fully Apache 2.0 licensed — no restrictions. Good for commercial projects needing permissive licensing.",
    slug: "falcon-180b",
  },
];

const selectionCriteria = [
  {
    icon: TrendingUp,
    title: "Benchmark Performance",
    description: "MMLU, HumanEval, GSM8K, and other standardized benchmarks for objective capability measurement.",
  },
  {
    icon: Star,
    title: "Community Adoption",
    description: "HuggingFace downloads, GitHub stars, and community fine-tunes indicate real-world utility.",
  },
  {
    icon: Shield,
    title: "Licensing & Commercial Use",
    description: "We favor truly open licenses (Apache 2.0, MIT) but include strong models with community licenses.",
  },
  {
    icon: Zap,
    title: "Efficiency & Deployability",
    description: "How well the model performs relative to its size. MoE models score bonus points for efficiency.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Open-Source LLMs in 2026",
  description: "Top 10 open-source large language models ranked by benchmarks, community adoption, and real-world performance.",
  numberOfItems: 10,
  itemListElement: models.map((m) => ({
    "@type": "ListItem",
    position: m.rank,
    url: `https://llmtrust.com/models/${m.slug}`,
    name: m.name,
    description: m.verdict,
  })),
};

export default function BestOpenSourceLlmsPage() {
  return (
    <>
      <Script
        id="jsonld-best-oss-llms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Best Of", href: "/best" },
          { label: "Open-Source LLMs" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-10 p-6 md:p-8 max-w-5xl mx-auto">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Award className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Best Open-Source LLMs in 2026
              </h1>
              <p className="text-muted-foreground mt-1">Top 10 Ranked by Performance & Adoption</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            The open-source AI landscape has never been more competitive. From Meta&apos;s Llama 3.1 to Mistral&apos;s
            MoE models, we rank the top 10 open-source LLMs by benchmarks, community adoption, licensing,
            and real-world performance to help you find the best model for your project.
          </p>
          <div className="neural-line" />
        </header>

        {/* Selection Criteria */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">How We Ranked These Models</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectionCriteria.map((c) => (
              <GlowCard key={c.title} className="text-center p-4">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Top 3 Highlight */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            Top 3 at a Glance
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {models.slice(0, 3).map((m, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const colors = ["border-yellow-500/30", "border-gray-400/30", "border-amber-700/30"];
              return (
                <GlowCard key={m.name} className={colors[i]}>
                  <GlowCardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{medals[i]}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.category}</span>
                    </div>
                    <GlowCardTitle className="text-base">{m.name}</GlowCardTitle>
                  </GlowCardHeader>
                  <GlowCardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{m.verdict}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-mono font-bold text-primary">{m.mmlu}%</p>
                        <p className="text-muted-foreground">MMLU</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">{m.humaneval}%</p>
                        <p className="text-muted-foreground">HumanEval</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">{m.gsm8k}%</p>
                        <p className="text-muted-foreground">GSM8K</p>
                      </div>
                    </div>
                    <Link
                      href={`/models/${m.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View model <ArrowRight className="size-3" />
                    </Link>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </div>
        </section>

        {/* Full Ranking Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Complete Top 10 Ranking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-3 font-semibold">#</th>
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-left py-3 px-3 font-semibold">Developer</th>
                  <th className="text-center py-3 px-3 font-semibold">Size</th>
                  <th className="text-center py-3 px-3 font-semibold">Context</th>
                  <th className="text-center py-3 px-3 font-semibold">MMLU</th>
                  <th className="text-center py-3 px-3 font-semibold">HumanEval</th>
                  <th className="text-center py-3 px-3 font-semibold">License</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="py-3 px-3 font-bold text-primary">#{m.rank}</td>
                    <td className="py-3 px-3">
                      <Link href={`/models/${m.slug}`} className="font-medium hover:text-primary transition-colors">
                        {m.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{m.verdict}</p>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{m.developer}</td>
                    <td className="text-center py-3 px-3 font-mono">{m.params}</td>
                    <td className="text-center py-3 px-3 font-mono">{m.context}</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.mmlu}%</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.humaneval}%</td>
                    <td className="py-3 px-3 text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        m.license.includes("Apache") || m.license.includes("MIT")
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {m.license}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Reviews */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Detailed Model Reviews</h2>
          {models.map((m) => (
            <GlowCard key={m.name} id={m.slug}>
              <GlowCardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    #{m.rank}
                  </span>
                  <div>
                    <GlowCardTitle className="text-lg">{m.name}</GlowCardTitle>
                    <p className="text-xs text-muted-foreground">{m.developer} · {m.params} parameters · {m.context} context</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.category}</span>
                </div>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{m.verdict}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.mmlu}%</p>
                    <p className="text-xs text-muted-foreground">MMLU</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.humaneval}%</p>
                    <p className="text-xs text-muted-foreground">HumanEval</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.gsm8k}%</p>
                    <p className="text-xs text-muted-foreground">GSM8K</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{m.license}</p>
                    <p className="text-xs text-muted-foreground">License</p>
                  </div>
                </div>
                <Link
                  href={`/models/${m.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View full specs <ArrowRight className="size-3.5" />
                </Link>
              </GlowCardContent>
            </GlowCard>
          ))}
        </section>

        {/* Conclusion */}
        <GlowCard className="border-primary/30">
          <GlowCardHeader>
            <GlowCardTitle>Our Recommendation</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="text-sm leading-relaxed space-y-2">
            <p>
              For most developers in 2026, <strong>Llama 3.1 70B</strong> offers the best balance of capability,
              efficiency, and accessibility. It matches GPT-3.5 on most tasks and approaches GPT-4 on many benchmarks,
              while being free to run locally.
            </p>
            <p>
              If you need maximum capability and have the hardware, <strong>Llama 3.1 405B</strong> is the
              most powerful open-source model available. For efficiency-focused deployments, <strong>Mixtral 8x22B</strong>
              {" "}delivers excellent quality with MoE efficiency.
            </p>
            <p>
              Check out our other guides:{" "}
              <Link href="/best/code-llms" className="text-primary hover:underline">Best Code LLMs</Link>
              {" "}&middot;{" "}
              <Link href="/best/small-llms" className="text-primary hover:underline">Best Small LLMs</Link>
              {" "}&middot;{" "}
              <Link href="/compare/llama-3-70b-vs-gpt-4" className="text-primary hover:underline">Llama 3 vs GPT-4</Link>
            </p>
          </GlowCardContent>
        </GlowCard>

        {/* Related */}
        <section className="space-y-4 border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">More Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/best/code-llms", label: "Best Code LLMs" },
              { href: "/best/small-llms", label: "Best Small LLMs" },
              { href: "/compare/llama-3-70b-vs-gpt-4", label: "Llama 3 vs GPT-4" },
              { href: "/compare/mistral-large-vs-claude-3-opus", label: "Mistral vs Claude 3" },
              { href: "/blog", label: "LLM Trust Blog" },
              { href: "/models", label: "Browse All Models" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowRight className="size-3.5" />
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <footer className="text-xs text-muted-foreground border-t border-border/40 pt-4 pb-8">
          Last updated: March 12, 2026 · Rankings based on official benchmarks and community feedback ·{" "}
          <Link href="/models" className="text-primary hover:underline">Browse all models</Link>
        </footer>
      </div>
    </>
  );
}
