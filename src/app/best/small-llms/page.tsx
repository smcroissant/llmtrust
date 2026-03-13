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
  TrendingUp,
  Zap,
  ArrowRight,
  Smartphone,
  Cpu,
  Battery,
  Wifi,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Best Small LLMs in 2026 — Models Under 10B Parameters",
  description:
    "Best small LLMs under 10B parameters for 2026: on-device AI, mobile inference, edge deployment & local running. Ranked by efficiency and benchmarks.",
  canonical: canonicalUrl("/best/small-llms"),
  type: "article",
});

const smallModels = [
  {
    rank: 1,
    name: "Phi-3.5 Mini",
    developer: "Microsoft",
    params: "3.8B",
    mmlu: "69.0",
    humaneval: "61.0",
    memory: "8 GB",
    speed: "~80 t/s",
    context: "128K",
    highlight: "Best efficiency per parameter. Runs on phones and laptops with surprising quality. 128K context in a 3.8B model.",
    slug: "phi-3.5-mini",
  },
  {
    rank: 2,
    name: "Gemma 2 9B",
    developer: "Google",
    params: "9B",
    mmlu: "71.3",
    humaneval: "40.2",
    memory: "18 GB",
    speed: "~45 t/s",
    context: "8K",
    highlight: "Best output quality in the small category. Knowledge distillation from Gemini delivers punch above its weight.",
    slug: "gemma-2-9b",
  },
  {
    rank: 3,
    name: "Llama 3.2 3B",
    developer: "Meta AI",
    params: "3B",
    mmlu: "63.4",
    humaneval: "55.0",
    memory: "6 GB",
    speed: "~90 t/s",
    context: "128K",
    highlight: "Smallest Llama with 128K context. Optimized for on-device use with strong general capability.",
    slug: "llama-3.2-3b",
  },
  {
    rank: 4,
    name: "Qwen 2.5 7B",
    developer: "Alibaba",
    params: "7B",
    mmlu: "70.0",
    humaneval: "65.0",
    memory: "14 GB",
    speed: "~50 t/s",
    context: "128K",
    highlight: "Strong multilingual small model. Excellent Chinese/Asian language support with 128K context.",
    slug: "qwen-2.5-7b",
  },
  {
    rank: 5,
    name: "DeepSeek Coder V2 Lite",
    developer: "DeepSeek",
    params: "16B (2.4B active)",
    mmlu: "60.0",
    humaneval: "82.0",
    memory: "6 GB",
    speed: "~70 t/s",
    context: "128K",
    highlight: "MoE magic: 82% HumanEval with only 2.4B active parameters. Best small model for coding.",
    slug: "deepseek-coder-v2-lite",
  },
  {
    rank: 6,
    name: "Mistral 7B v0.3",
    developer: "Mistral AI",
    params: "7B",
    mmlu: "64.2",
    humaneval: "32.0",
    memory: "14 GB",
    speed: "~55 t/s",
    context: "32K",
    highlight: "The OG efficient model. Still great for general tasks with sliding window attention for long context.",
    slug: "mistral-7b-v0.3",
  },
  {
    rank: 7,
    name: "SmolLM2 1.7B",
    developer: "HuggingFace",
    params: "1.7B",
    mmlu: "50.0",
    humaneval: "30.0",
    memory: "3.5 GB",
    speed: "~120 t/s",
    context: "8K",
    highlight: "Runs on literally anything. Phones, Raspberry Pi, browsers. Incredible for resource-constrained devices.",
    slug: "smollm2-1.7b",
  },
  {
    rank: 8,
    name: "Gemma 2 2B",
    developer: "Google",
    params: "2B",
    mmlu: "52.0",
    humaneval: "28.0",
    memory: "4 GB",
    speed: "~100 t/s",
    context: "8K",
    highlight: "Google's smallest. Good for simple tasks, classification, and mobile apps with Google-quality training.",
    slug: "gemma-2-2b",
  },
  {
    rank: 9,
    name: "TinyLlama 1.1B",
    developer: "TinyLlama",
    params: "1.1B",
    mmlu: "35.0",
    humaneval: "18.0",
    memory: "2.2 GB",
    speed: "~150 t/s",
    context: "2K",
    highlight: "Smallest useful LLM. Great for learning, experimentation, and very basic NLP tasks on any device.",
    slug: "tinyllama-1.1b",
  },
  {
    rank: 10,
    name: "Phi-3 Mini (4K)",
    developer: "Microsoft",
    params: "3.8B",
    mmlu: "68.8",
    humaneval: "58.5",
    memory: "8 GB",
    speed: "~80 t/s",
    context: "4K",
    highlight: "Original Phi-3 with shorter context but same efficiency. Perfect when you don't need 128K.",
    slug: "phi-3-mini",
  },
];

const deploymentScenarios = [
  { icon: Smartphone, title: "Mobile & Phone", description: "Run AI inference on iOS/Android. Models: SmolLM2, Gemma 2B, Llama 3.2 3B. Frameworks: MLX, MLC LLM, MediaPipe." },
  { icon: Cpu, title: "Laptop & Desktop", description: "Consumer hardware with 8-24GB RAM. Models: Phi-3.5, Gemma 2 9B, Qwen 2.5 7B. Tools: Ollama, LM Studio, GPT4All." },
  { icon: Battery, title: "Edge & IoT", description: "Raspberry Pi, Jetson Nano, embedded systems. Models: TinyLlama, SmolLM2, Gemma 2B. Frameworks: llama.cpp, ExecuTorch." },
  { icon: Wifi, title: "Browser-Based", description: "Run inference directly in the browser with WebGPU. Models: SmolLM2, Phi-3 Mini. Frameworks: WebLLM, Transformers.js." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Small LLMs in 2026 (Under 10B Parameters)",
  description: "Top 10 small language models ranked by efficiency, benchmarks, and on-device performance.",
  numberOfItems: 10,
  itemListElement: smallModels.map((m) => ({
    "@type": "ListItem",
    position: m.rank,
    url: `https://llmtrust.com/models/${m.slug}`,
    name: m.name,
    description: m.highlight,
  })),
};

export default function BestSmallLlmsPage() {
  return (
    <>
      <Script
        id="jsonld-best-small-llms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Best Of", url: "https://llmtrust.com/best" },
          { name: "Small LLMs", url: "https://llmtrust.com/best/small-llms" },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Best Of", href: "/best" },
          { label: "Small LLMs" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-10 p-6 md:p-8 max-w-5xl mx-auto">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Best Small LLMs in 2026
              </h1>
              <p className="text-muted-foreground mt-1">Top 10 Models Under 10B Parameters</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            You don&apos;t need a datacenter to run powerful AI. These small language models deliver impressive
            capabilities on phones, laptops, and edge devices. We rank the top 10 by efficiency, benchmarks,
            and real-world on-device performance.
          </p>
          <div className="neural-line" />
        </header>

        {/* Deployment Scenarios */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Where to Run Small LLMs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deploymentScenarios.map((s) => (
              <GlowCard key={s.title} className="text-center p-4">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Top 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            Top 3 Small LLMs
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {smallModels.slice(0, 3).map((m, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <GlowCard key={m.name}>
                  <GlowCardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{medals[i]}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {m.params}
                      </span>
                    </div>
                    <GlowCardTitle className="text-base">{m.name}</GlowCardTitle>
                  </GlowCardHeader>
                  <GlowCardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{m.highlight}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-mono font-bold text-primary">{m.mmlu}%</p>
                        <p className="text-muted-foreground">MMLU</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">{m.speed}</p>
                        <p className="text-muted-foreground">Speed</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">{m.memory}</p>
                        <p className="text-muted-foreground">VRAM</p>
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
                  <th className="text-center py-3 px-3 font-semibold">Params</th>
                  <th className="text-center py-3 px-3 font-semibold">MMLU</th>
                  <th className="text-center py-3 px-3 font-semibold">HumanEval</th>
                  <th className="text-center py-3 px-3 font-semibold">Memory</th>
                  <th className="text-center py-3 px-3 font-semibold">Speed</th>
                </tr>
              </thead>
              <tbody>
                {smallModels.map((m) => (
                  <tr key={m.name} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="py-3 px-3 font-bold text-primary">#{m.rank}</td>
                    <td className="py-3 px-3">
                      <Link href={`/models/${m.slug}`} className="font-medium hover:text-primary transition-colors">
                        {m.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.developer}</p>
                    </td>
                    <td className="text-center py-3 px-3 font-mono">{m.params}</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.mmlu}%</td>
                    <td className="text-center py-3 px-3 font-mono font-bold text-primary">{m.humaneval}%</td>
                    <td className="text-center py-3 px-3 font-mono">{m.memory}</td>
                    <td className="text-center py-3 px-3 font-mono">{m.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Speed measured with 4-bit quantization on consumer GPU (RTX 4090 or equivalent). Memory is FP16 requirement.
          </p>
        </section>

        {/* Detailed Reviews */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Detailed Reviews</h2>
          {smallModels.map((m) => (
            <GlowCard key={m.name}>
              <GlowCardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    #{m.rank}
                  </span>
                  <div>
                    <GlowCardTitle className="text-lg">{m.name}</GlowCardTitle>
                    <p className="text-xs text-muted-foreground">{m.developer} · {m.params} parameters · {m.context} context</p>
                  </div>
                </div>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{m.highlight}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.mmlu}%</p>
                    <p className="text-xs text-muted-foreground">MMLU</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold text-primary">{m.humaneval}%</p>
                    <p className="text-xs text-muted-foreground">HumanEval</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold">{m.memory}</p>
                    <p className="text-xs text-muted-foreground">VRAM</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="font-mono font-bold">{m.speed}</p>
                    <p className="text-xs text-muted-foreground">Speed</p>
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
            <GlowCardTitle>Our Recommendation</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="text-sm leading-relaxed space-y-2">
            <p>
              <strong>Best overall small model:</strong> Phi-3.5 Mini (3.8B) — unmatched efficiency with 128K context.
              Runs on a laptop and delivers surprising quality.
            </p>
            <p>
              <strong>Best for coding on-device:</strong> DeepSeek Coder V2 Lite — 82% HumanEval with only 2.4B active parameters.
              MoE architecture makes it incredibly efficient.
            </p>
            <p>
              <strong>Best for mobile phones:</strong> SmolLM2 1.7B — runs on literally anything. Perfect for mobile apps
              and very resource-constrained environments.
            </p>
            <p>
              Compare with bigger models:{" "}
              <Link href="/compare/phi-3-mini-vs-gemma-2-9b" className="text-primary hover:underline">Phi-3 vs Gemma 2</Link>
              {" "}&middot;{" "}
              <Link href="/best/open-source-llms" className="text-primary hover:underline">Best Open-Source LLMs</Link>
              {" "}&middot;{" "}
              <Link href="/best/code-llms" className="text-primary hover:underline">Best Code LLMs</Link>
            </p>
          </GlowCardContent>
        </GlowCard>

        <section className="space-y-4 border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">More Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/best/open-source-llms", label: "Best Open-Source LLMs" },
              { href: "/best/code-llms", label: "Best Code LLMs" },
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
          Last updated: March 12, 2026 · Benchmarks from official reports and community evaluations ·{" "}
          <Link href="/models" className="text-primary hover:underline">Browse all models</Link>
        </footer>
      </div>
    </>
  );
}
