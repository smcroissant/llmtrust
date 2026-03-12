import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/layout/top-bar";
import { ArrowRight, Download, Zap, Search } from "lucide-react";

const featuredModels = [
  {
    slug: "llama-3-8b",
    name: "Llama 3 8B",
    description: "Meta's latest open-source LLM with strong performance across benchmarks.",
    parameterCount: "8B",
    architecture: "llama",
    category: "text-generation",
    downloadCount: 125000,
    license: "Llama 3",
    tags: ["chat", "code", "reasoning"],
  },
  {
    slug: "mistral-7b",
    name: "Mistral 7B",
    description: "Efficient 7B parameter model with strong reasoning capabilities.",
    parameterCount: "7B",
    architecture: "mistral",
    category: "text-generation",
    downloadCount: 98000,
    license: "Apache 2.0",
    tags: ["efficient", "reasoning"],
  },
  {
    slug: "phi-3-mini",
    name: "Phi-3 Mini",
    description: "Microsoft's compact model that punches above its weight class.",
    parameterCount: "3.8B",
    architecture: "phi",
    category: "text-generation",
    downloadCount: 75000,
    license: "MIT",
    tags: ["compact", "efficient"],
  },
  {
    slug: "gemma-2b",
    name: "Gemma 2B",
    description: "Google's lightweight model for on-device AI applications.",
    parameterCount: "2B",
    architecture: "gemma",
    category: "text-generation",
    downloadCount: 62000,
    license: "Gemma",
    tags: ["lightweight", "on-device"],
  },
];

const categories = [
  { name: "Text Generation", count: 145, icon: "💬" },
  { name: "Code", count: 89, icon: "💻" },
  { name: "Vision", count: 34, icon: "👁️" },
  { name: "Embedding", count: 28, icon: "🔢" },
  { name: "Audio", count: 15, icon: "🎵" },
];

const stats = [
  { value: "200+", label: "Open-Source Models" },
  { value: "500K+", label: "Downloads" },
  { value: "15+", label: "Architectures" },
  { value: "100%", label: "Free & Open" },
];

export default function HomePage() {
  return (
    <>
      <TopBar breadcrumbs={[{ label: "Home" }]} />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 200+ Open-Source Models
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover & Run{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Open-Source LLMs
              </span>{" "}
              Locally
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              The trusted platform for discovering, comparing, and running AI models.
              Browse curated models, read community reviews, and download directly from HuggingFace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/models">
                <Button size="lg">
                  Browse Models <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/api">
                <Button size="lg" variant="outline">API Documentation</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y bg-muted/20 py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10">
              Why LLM Trust?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Curated Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Find the right model for your use case with detailed specs, benchmarks, and community reviews.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Direct Downloads</h3>
                <p className="text-sm text-muted-foreground">
                  Download models directly from HuggingFace. No hosting fees, always the latest versions.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Run Locally</h3>
                <p className="text-sm text-muted-foreground">
                  Use our Electron app to download and run models locally with one click. Privacy-first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Models</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Hand-picked models trusted by the community
                </p>
              </div>
              <Link href="/models">
                <Button variant="ghost">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredModels.map((model) => (
                <Link key={model.slug} href={`/models/${model.slug}`}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge variant="secondary">{model.parameterCount}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {model.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {model.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {model.downloadCount.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {model.architecture}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-2 text-center">Browse by Category</h2>
            <p className="text-muted-foreground text-center text-sm mb-8">
              Find models by use case
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/models?category=${cat.name.toLowerCase().replace(" ", "-")}`}
                >
                  <Card className="text-center py-6 transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cat.count} models</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Models Preview */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-2">Latest Additions</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Recently added models to the platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Qwen 2.5 72B", params: "72B", date: "2 days ago", arch: "qwen" },
                { name: "DeepSeek Coder V2", params: "236B", date: "5 days ago", arch: "deepseek" },
                { name: "Command R+", params: "104B", date: "1 week ago", arch: "cohere" },
              ].map((item) => (
                <Card key={item.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.arch} · {item.params}</p>
                    </div>
                    <Badge variant="secondary">{item.date}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background border-t">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to explore open-source AI?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of developers discovering and running open-source AI models locally.
              Free forever, no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/models">
                <Button size="lg">
                  Explore Models <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer (inline) */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} LLM Trust. All rights reserved.</p>
            <p className="mt-1">
              Models sourced from{" "}
              <a
                href="https://huggingface.co"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                HuggingFace
              </a>
              . Built with ❤️ for the open-source community.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
