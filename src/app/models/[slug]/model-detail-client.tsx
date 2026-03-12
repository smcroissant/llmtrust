"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  ExternalLink,
  Star,
  ArrowLeft,
  Cpu,
  Ruler,
  Scale,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface ModelDetailProps {
  model: {
    slug: string;
    name: string;
    description: string;
    longDescription: string;
    parameterCount: string;
    architecture: string;
    category: string;
    downloadCount: number;
    license: string;
    tags: string[];
    downloadUrl: string;
    author: string;
    contextLength: number;
  };
}

export function ModelDetailPage({ model }: ModelDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{model.name}</h1>
            <Badge variant="secondary" className="text-sm">
              {model.parameterCount}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-3">{model.description}</p>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <a href={model.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download on HuggingFace
            </Button>
          </a>
          <a href={model.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Source
            </Button>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Cpu className="h-4 w-4" />
              <span className="text-xs">Architecture</span>
            </div>
            <p className="font-semibold capitalize">{model.architecture}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Ruler className="h-4 w-4" />
              <span className="text-xs">Parameters</span>
            </div>
            <p className="font-semibold">{model.parameterCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Context Length</span>
            </div>
            <p className="font-semibold">{model.contextLength.toLocaleString()} tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Scale className="h-4 w-4" />
              <span className="text-xs">License</span>
            </div>
            <p className="font-semibold">{model.license}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About {model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {model.longDescription}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Author</h4>
                  <p className="text-muted-foreground">{model.author}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <p className="text-muted-foreground capitalize">
                    {model.category.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Downloads</h4>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {model.downloadCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">License</h4>
                  <p className="text-muted-foreground">{model.license}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Format</h4>
                    <p className="text-muted-foreground">GGUF (recommended), Safetensors</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Quantizations</h4>
                    <p className="text-muted-foreground">Q4_K_M, Q5_K_M, Q8_0</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Recommended RAM</h4>
                    <p className="text-muted-foreground">
                      {parseInt(model.parameterCount) <= 4
                        ? "8 GB"
                        : parseInt(model.parameterCount) <= 13
                          ? "16 GB"
                          : "32+ GB"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Template Format</h4>
                    <p className="text-muted-foreground">ChatML</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Download from HuggingFace</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Click the download button above or visit the HuggingFace page directly.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Use with Ollama</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  <code>ollama run {model.slug}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Use with llama.cpp</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  <code>./main -m {model.slug}.gguf -p &quot;Hello&quot;</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">4. Use with the LLM Trust Desktop App</h4>
                <p className="text-sm text-muted-foreground">
                  Coming soon — one-click download and local execution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Community Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">4.5</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">100 reviews</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Reviews are coming soon. Sign up to be notified when you can leave reviews.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
