import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelDetailPage } from "./model-detail-client";
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";

// Static model data for MVP (will be replaced by DB)
const modelsData: Record<string, {
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
}> = {
  "llama-3-8b": {
    slug: "llama-3-8b",
    name: "Llama 3 8B",
    description: "Meta's latest open-source LLM with strong performance across benchmarks.",
    longDescription: "Llama 3 8B is part of Meta's latest generation of large language models. It features improved reasoning, coding, and instruction-following capabilities compared to its predecessor. The model is available under the Llama 3 license which allows commercial use.",
    parameterCount: "8B",
    architecture: "llama",
    category: "text-generation",
    downloadCount: 125000,
    license: "Llama 3",
    tags: ["chat", "code", "reasoning"],
    downloadUrl: "https://huggingface.co/meta-llama/Meta-Llama-3-8B",
    author: "Meta",
    contextLength: 8192,
  },
  "mistral-7b": {
    slug: "mistral-7b",
    name: "Mistral 7B",
    description: "Efficient 7B parameter model with strong reasoning capabilities.",
    longDescription: "Mistral 7B is a high-performance language model that outperforms Llama 2 13B on all benchmarks. It uses grouped-query attention (GQA) for faster inference and sliding window attention (SWA) for handling longer sequences efficiently.",
    parameterCount: "7B",
    architecture: "mistral",
    category: "text-generation",
    downloadCount: 98000,
    license: "Apache 2.0",
    tags: ["efficient", "reasoning"],
    downloadUrl: "https://huggingface.co/mistralai/Mistral-7B-v0.1",
    author: "Mistral AI",
    contextLength: 8192,
  },
  "phi-3-mini": {
    slug: "phi-3-mini",
    name: "Phi-3 Mini",
    description: "Microsoft's compact model that punches above its weight class.",
    longDescription: "Phi-3 Mini is a 3.8B parameter language model that rivals models many times its size. Trained on high-quality data, it excels at reasoning and coding tasks while being small enough to run on consumer hardware.",
    parameterCount: "3.8B",
    architecture: "phi",
    category: "text-generation",
    downloadCount: 75000,
    license: "MIT",
    tags: ["compact", "efficient"],
    downloadUrl: "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct",
    author: "Microsoft",
    contextLength: 4096,
  },
  "gemma-2b": {
    slug: "gemma-2b",
    name: "Gemma 2B",
    description: "Google's lightweight model for on-device AI applications.",
    longDescription: "Gemma 2B is a lightweight, state-of-the-art open model built from the same research and technology used to create the Gemini models. It's designed for efficient deployment on resource-constrained devices.",
    parameterCount: "2B",
    architecture: "gemma",
    category: "text-generation",
    downloadCount: 62000,
    license: "Gemma",
    tags: ["lightweight", "on-device"],
    downloadUrl: "https://huggingface.co/google/gemma-2b",
    author: "Google",
    contextLength: 8192,
  },
  "codellama-13b": {
    slug: "codellama-13b",
    name: "Code Llama 13B",
    description: "Meta's code-specialized model for programming tasks and code generation.",
    longDescription: "Code Llama 13B is a code-specialized version of Llama 2 that can generate code and natural language about code. It supports many popular programming languages including Python, C++, Java, and more.",
    parameterCount: "13B",
    architecture: "llama",
    category: "code",
    downloadCount: 54000,
    license: "Llama 2",
    tags: ["code", "programming"],
    downloadUrl: "https://huggingface.co/codellama/CodeLlama-13b-hf",
    author: "Meta",
    contextLength: 16384,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = modelsData[slug];

  if (!model) {
    return { title: "Model Not Found" };
  }

  return {
    title: `${model.name} (${model.parameterCount})`,
    description: model.description,
    openGraph: {
      title: `${model.name} (${model.parameterCount}) | LLM Trust`,
      description: model.description,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(modelsData).map((slug) => ({ slug }));
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = modelsData[slug];

  if (!model) {
    notFound();
  }

  return (
    <>
      <SoftwareApplicationJsonLd
        name={model.name}
        description={model.description}
        slug={model.slug}
        author={model.author}
        license={model.license}
        downloadUrl={model.downloadUrl}
        category={model.category}
        rating={4.5}
        ratingCount={100}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Models", url: "https://llmtrust.com/models" },
          { name: model.name, url: `https://llmtrust.com/models/${model.slug}` },
        ]}
      />
      <ModelDetailPage model={model} />
    </>
  );
}
