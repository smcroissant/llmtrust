import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ArticleJsonLd } from "@/components/seo/structured-data";
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
  TrendingUp,
  Cpu,
  DollarSign,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Phi-3 Mini vs Gemma 2 9B: Best Small LLM Comparison (2026)",
  description:
    "Phi-3 Mini vs Gemma 2 9B comparison: benchmarks, efficiency, on-device performance, coding & best use cases for small language models in 2026.",
  canonical: canonicalUrl("/compare/phi-3-mini-vs-gemma-2-9b"),
  type: "article",
});

const benchmarks = [
  { name: "MMLU", phi: "68.8", gemma: "71.3", unit: "%" },
  { name: "HumanEval", phi: "58.5", gemma: "40.2", unit: "%" },
  { name: "GSM8K", phi: "75.6", gemma: "68.1", unit: "%" },
  { name: "ARC-Challenge", phi: "78.5", gemma: "72.3", unit: "%" },
  { name: "HellaSwag", phi: "76.8", gemma: "80.0", unit: "%" },
  { name: "TruthfulQA", phi: "52.0", gemma: "48.7", unit: "%" },
  { name: "MT-Bench", phi: "7.2", gemma: "6.8", unit: "/10" },
  { name: "Model Size", phi: "3.8B", gemma: "9B", unit: "" },
  { name: "Memory (FP16)", phi: "~8 GB", gemma: "~18 GB", unit: "" },
  { name: "Speed (4-bit)", phi: "~80 t/s", gemma: "~45 t/s", unit: "" },
];

const verdictCategories = [
  { category: "Coding & Code Generation", winner: "phi", reason: "Phi-3 Mini scores significantly higher on HumanEval (58.5% vs 40.2%) despite being smaller. Microsoft's code-heavy training pays off." },
  { category: "General Knowledge", winner: "gemma", reason: "Gemma 2 9B leads on MMLU (71.3% vs 68.8%) and HellaSwag thanks to its larger parameter count and Google's training data." },
  { category: "Math & Reasoning", winner: "phi", reason: "Phi-3 Mini outperforms on GSM8K (75.6% vs 68.1%) and ARC-Challenge, showing superior mathematical reasoning for its size." },
  { category: "On-Device Efficiency", winner: "phi", reason: "At 3.8B parameters, Phi-3 Mini runs on phones, laptops, and edge devices. Gemma 2 9B needs more powerful hardware." },
  { category: "Speed & Latency", winner: "phi", reason: "Phi-3 Mini generates ~80 tokens/sec on a laptop GPU vs Gemma 2 9B's ~45 tokens/sec. Nearly 2x faster." },
  { category: "Output Quality", winner: "gemma", reason: "Gemma 2 9B produces more coherent, nuanced responses for open-ended generation thanks to its larger capacity." },
  { category: "Instruction Following", winner: "phi", reason: "Phi-3 Mini's MT-Bench score of 7.2 edges out Gemma 2 9B's 6.8, suggesting better instruction adherence." },
  { category: "Licensing", winner: "tie", reason: "Both use permissive licenses: MIT (Phi-3) and Gemma Terms (Google). Both allow commercial use with minimal restrictions." },
];

export default function Phi3MiniVsGemma29bPage() {
  return (
    <>
      <ArticleJsonLd
        title="Phi-3 Mini vs Gemma 2 9B: Small LLM Comparison (2026)"
        description="Detailed comparison of Microsoft's Phi-3 Mini and Google's Gemma 2 9B. Benchmarks, efficiency, on-device performance, and best use cases."
        slug="phi-3-mini-vs-gemma-2-9b"
        datePublished="2026-02-01"
        dateModified="2026-03-12"
      />

      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: "Phi-3 Mini vs Gemma 2 9B" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-10 p-6 md:p-8 max-w-5xl mx-auto">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Phi-3 Mini vs Gemma 2 9B: Which Small LLM Is Better?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Microsoft&apos;s efficient Phi-3 Mini punches above its weight against Google&apos;s Gemma 2 9B.
            We compare benchmarks, speed, on-device performance, and real-world use cases for the best small language models.
          </p>
          <div className="neural-line" />
        </header>

        <GlowCard className="border-primary/30">
          <GlowCardHeader>
            <GlowCardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              TL;DR — Quick Verdict
            </GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="text-sm leading-relaxed space-y-2">
            <p>
              <strong>Phi-3 Mini (3.8B)</strong> wins on <em>efficiency, speed, coding, and math reasoning</em>.
              Runs on laptops and phones — 2x faster with better code generation despite fewer parameters.
            </p>
            <p>
              <strong>Gemma 2 9B</strong> wins on <em>general knowledge, output quality, and coherence</em>.
              Better for open-ended generation and tasks requiring nuanced understanding.
            </p>
            <p className="font-medium text-primary">
              Choose Phi-3 Mini for edge deployment and speed. Choose Gemma 2 9B for higher quality output when resources allow.
            </p>
          </GlowCardContent>
        </GlowCard>

        {/* Model Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Model Overview</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard>
              <GlowCardHeader>
                <GlowCardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔬</span> Phi-3 Mini
                </GlowCardTitle>
              </GlowCardHeader>
              <GlowCardContent>
                <table className="w-full text-sm">
                  <tbody className="[&>tr]:border-b [&>tr]:border-border/40 [&>tr:last-child]:border-0">
                    <tr><td className="py-2 text-muted-foreground">Developer</td><td className="py-2 font-medium">Microsoft</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Parameters</td><td className="py-2 font-medium">3.8 billion</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Context</td><td className="py-2 font-medium">128K tokens</td></tr>
                    <tr><td className="py-2 text-muted-foreground">License</td><td className="py-2 font-medium">MIT</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Release</td><td className="py-2 font-medium">April 2024</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Memory (FP16)</td><td className="py-2 font-medium text-green-500">~8 GB</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Phone Compatible</td><td className="py-2 font-medium text-green-500">Yes (Q4)</td></tr>
                  </tbody>
                </table>
              </GlowCardContent>
            </GlowCard>

            <GlowCard>
              <GlowCardHeader>
                <GlowCardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💎</span> Gemma 2 9B
                </GlowCardTitle>
              </GlowCardHeader>
              <GlowCardContent>
                <table className="w-full text-sm">
                  <tbody className="[&>tr]:border-b [&>tr]:border-border/40 [&>tr:last-child]:border-0">
                    <tr><td className="py-2 text-muted-foreground">Developer</td><td className="py-2 font-medium">Google DeepMind</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Parameters</td><td className="py-2 font-medium">9 billion</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Context</td><td className="py-2 font-medium">8K tokens</td></tr>
                    <tr><td className="py-2 text-muted-foreground">License</td><td className="py-2 font-medium">Gemma Terms</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Release</td><td className="py-2 font-medium">June 2024</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Memory (FP16)</td><td className="py-2 font-medium text-amber-500">~18 GB</td></tr>
                    <tr><td className="py-2 text-muted-foreground">Phone Compatible</td><td className="py-2 font-medium text-amber-500">Q4 only</td></tr>
                  </tbody>
                </table>
              </GlowCardContent>
            </GlowCard>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="size-6 text-primary" />
            Benchmark Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-4 font-semibold">Benchmark</th>
                  <th className="text-center py-3 px-4 font-semibold">🔬 Phi-3 Mini</th>
                  <th className="text-center py-3 px-4 font-semibold">💎 Gemma 2 9B</th>
                  <th className="text-center py-3 px-4 font-semibold">Winner</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b) => {
                  const phiNum = parseFloat(b.phi);
                  const gemmaNum = parseFloat(b.gemma);
                  const isNumeric = !isNaN(phiNum) && !isNaN(gemmaNum);
                  let winner: "phi" | "gemma" | "tie" = "tie";
                  if (["Model Size", "Memory (FP16)"].includes(b.name)) {
                    winner = "phi"; // lower is better
                  } else if (b.name === "Speed (4-bit)") {
                    winner = "phi"; // higher is better
                  } else if (isNumeric) {
                    winner = phiNum > gemmaNum ? "phi" : gemmaNum > phiNum ? "gemma" : "tie";
                  }
                  return (
                    <tr key={b.name} className="border-b border-border/40 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{b.name}</td>
                      <td className={`text-center py-3 px-4 font-mono ${winner === "phi" ? "text-green-500 font-bold" : ""}`}>
                        {b.phi}{b.unit}
                      </td>
                      <td className={`text-center py-3 px-4 font-mono ${winner === "gemma" ? "text-green-500 font-bold" : ""}`}>
                        {b.gemma}{b.unit}
                      </td>
                      <td className="text-center py-3 px-4">
                        {winner === "phi" && <span className="text-amber-500">🔬 Phi-3</span>}
                        {winner === "gemma" && <span className="text-amber-500">💎 Gemma</span>}
                        {winner === "tie" && <span className="text-muted-foreground">Tie</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Cpu className="size-6 text-primary" />
            Detailed Analysis
          </h2>

          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle>The Efficiency Champion: Why Phi-3 Mini Punches Above Its Weight</GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="text-sm leading-relaxed space-y-3">
              <p>
                Phi-3 Mini&apos;s <strong>3.8B parameters</strong> outperform many models 2-3x its size.
                Microsoft achieved this through careful training on &quot;textbook-quality&quot; data —
                high-quality educational content that teaches reasoning rather than memorizing patterns.
              </p>
              <p>
                The result: a model that can run on a <strong>smartphone</strong> while matching or
                beating 7B-class models on coding and math. This makes Phi-3 Mini the ideal choice
                for edge AI, mobile apps, and on-device inference where GPU memory is limited.
              </p>
            </GlowCardContent>
          </GlowCard>

          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle>Gemma 2 9B: Quality Over Efficiency</GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="text-sm leading-relaxed space-y-3">
              <p>
                Google&apos;s Gemma 2 9B leverages knowledge distillation from Gemini models,
                resulting in <strong>higher quality open-ended generation</strong>. Its 9B parameters
                give it more capacity for nuanced understanding, creative writing, and complex reasoning
                that requires world knowledge.
              </p>
              <p>
                With Google&apos;s knowledge about <Link href="/models/gemma-2.0-9b" className="text-primary hover:underline">Gemma 2 9B</Link>,
                it uses grouped-query attention and sliding window attention for efficient inference,
                but still requires ~18GB of memory in FP16 — more than a typical laptop GPU.
              </p>
            </GlowCardContent>
          </GlowCard>

          <GlowCard>
            <GlowCardHeader>
              <GlowCardTitle className="flex items-center gap-2">
                <DollarSign className="size-5 text-primary" />
                Running Costs
              </GlowCardTitle>
            </GlowCardHeader>
            <GlowCardContent className="text-sm leading-relaxed space-y-3">
              <p>
                <strong>Phi-3 Mini:</strong> Runs on a laptop RTX 4060 (8GB) at ~80 tokens/sec.
                Cloud inference costs ~$0.05/1M tokens. Can run on CPU at ~15 tokens/sec.
              </p>
              <p>
                <strong>Gemma 2 9B:</strong> Needs an RTX 4090 (24GB) for comfortable inference.
                Cloud inference costs ~$0.10/1M tokens. CPU inference is slow (~5 tokens/sec).
              </p>
              <p>
                For high-volume applications, Phi-3 Mini is roughly <strong>2x cheaper</strong> to run
                while also being faster. The tradeoff is lower quality on open-ended tasks.
              </p>
            </GlowCardContent>
          </GlowCard>
        </section>

        {/* Verdict Grid */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            Category-by-Category Verdict
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {verdictCategories.map((v) => (
              <GlowCard key={v.category} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    v.winner === "phi" ? "bg-cyan-500/10" : v.winner === "gemma" ? "bg-emerald-500/10" : "bg-muted"
                  }`}>
                    <span className="text-lg">{v.winner === "phi" ? "🔬" : v.winner === "gemma" ? "💎" : "🤝"}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{v.category}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {v.winner === "tie" ? "Tie" : `Winner: ${v.winner === "phi" ? "Phi-3 Mini" : "Gemma 2 9B"}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{v.reason}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* When to Use */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">When to Use Which Model</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard className="border-cyan-500/30">
              <GlowCardHeader>
                <GlowCardTitle className="text-cyan-500">Choose Phi-3 Mini When…</GlowCardTitle>
              </GlowCardHeader>
              <GlowCardContent>
                <ul className="space-y-2 text-sm">
                  {[
                    "Deploying AI on mobile or edge devices",
                    "Speed and low latency are critical",
                    "Running on consumer hardware (8GB VRAM)",
                    "Code generation is a primary task",
                    "Mathematical reasoning matters",
                    "You need the most efficient model per parameter",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-cyan-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlowCardContent>
            </GlowCard>

            <GlowCard className="border-emerald-500/30">
              <GlowCardHeader>
                <GlowCardTitle className="text-emerald-500">Choose Gemma 2 9B When…</GlowCardTitle>
              </GlowCardHeader>
              <GlowCardContent>
                <ul className="space-y-2 text-sm">
                  {[
                    "Output quality matters more than speed",
                    "You have 18GB+ VRAM available",
                    "Open-ended generation and creative writing",
                    "Nuanced understanding of complex topics",
                    "General-purpose chatbot applications",
                    "Quality of reasoning trumps raw efficiency",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlowCardContent>
            </GlowCard>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "Can Phi-3 Mini run on a smartphone?",
                a: "Yes. The Q4 quantized version of Phi-3 Mini (~2GB) can run on modern smartphones using frameworks like MLX (iOS) or MLC LLM (Android). Expect 10-20 tokens/sec on flagship phones.",
              },
              {
                q: "Is Gemma 2 9B really better for creative writing?",
                a: "Yes. Its 9B parameters give it more capacity for nuanced, creative output. In blind tests, Gemma 2 9B is preferred for open-ended text generation, storytelling, and content that requires depth.",
              },
              {
                q: "Which model is better for RAG applications?",
                a: "For RAG, Phi-3 Mini's 128K context window is a significant advantage over Gemma 2 9B's 8K. You can feed more retrieved context into Phi-3 Mini. However, Gemma 2 9B may better synthesize the retrieved information.",
              },
              {
                q: "Can I fine-tune both models?",
                a: "Yes. Both support fine-tuning with LoRA/QLoRA. Phi-3 Mini's smaller size makes fine-tuning faster and cheaper (~2x less GPU memory). Both have active communities on HuggingFace.",
              },
            ].map((faq, i) => (
              <GlowCard key={i} className="p-4">
                <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="space-y-4 border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">Related Comparisons</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/compare/llama-3-70b-vs-gpt-4", label: "Llama 3 70B vs GPT-4" },
              { href: "/compare/mistral-large-vs-claude-3-opus", label: "Mistral Large vs Claude 3 Opus" },
              { href: "/best/small-llms", label: "Best Small LLMs 2026" },
              { href: "/best/code-llms", label: "Best Code LLMs" },
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
          Last updated: March 12, 2026 · Benchmarks from official reports and independent evaluations ·{" "}
          <Link href="/compare" className="text-primary hover:underline">Compare more models</Link>
        </footer>
      </div>
    </>
  );
}
