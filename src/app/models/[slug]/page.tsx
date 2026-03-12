import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelDetailPage } from "./model-detail-client";
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from "@/components/seo/structured-data";
import { serverCaller } from "@/server/api/caller";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const model = await serverCaller.models.get({ slug });
    return {
      title: `${model.name} (${model.parameterCount})`,
      description: model.description,
      openGraph: {
        title: `${model.name} (${model.parameterCount}) | LLM Trust`,
        description: model.description,
        type: "article",
      },
    };
  } catch {
    return { title: "Model Not Found" };
  }
}

export async function generateStaticParams() {
  try {
    const { models } = await serverCaller.models.list({ limit: 100 });
    return models.map((m: { slug: string }) => ({ slug: m.slug }));
  } catch {
    return [];
  }
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let model;
  try {
    model = await serverCaller.models.get({ slug });
  } catch {
    notFound();
  }

  // Transform to match the client component interface
  const modelData = {
    slug: model.slug,
    name: model.name,
    description: model.description,
    longDescription: model.longDescription ?? model.description,
    parameterCount: model.parameterCount ?? "",
    architecture: model.architecture ?? "",
    category: model.category ?? "",
    downloadCount: model.downloadCount,
    license: model.license ?? "",
    tags: (model.tags as string[]) ?? [],
    downloadUrl: model.downloadUrl,
    author: "Community",
    contextLength: model.contextLength ?? 0,
    avgRating: model.avgRating,
    reviewCount: model.reviewCount,
  };

  return (
    <>
      <SoftwareApplicationJsonLd
        name={model.name}
        description={model.description}
        slug={model.slug}
        author="Community"
        license={model.license ?? ""}
        downloadUrl={model.downloadUrl}
        category={model.category ?? ""}
        rating={model.avgRating}
        ratingCount={model.reviewCount}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Models", url: "https://llmtrust.com/models" },
          { name: model.name, url: `https://llmtrust.com/models/${model.slug}` },
        ]}
      />
      <FaqPageJsonLd
        faqs={[
          {
            question: `What is ${model.name}?`,
            answer: model.description,
          },
          {
            question: `How do I run ${model.name} locally?`,
            answer: `You can run ${model.name} locally using tools like Ollama (ollama run ${model.slug}), llama.cpp, or LM Studio. Download the GGUF quantized version for best performance on consumer hardware.`,
          },
          {
            question: `What license is ${model.name} under?`,
            answer: `${model.name} is released under the ${model.license ?? "open-source"} license. Check the official model page for full license details.`,
          },
          {
            question: `How much RAM do I need for ${model.name}?`,
            answer: `RAM requirements depend on the quantization. For ${model.parameterCount ?? "this"} parameter models, Q4_K_M typically requires around ${parseInt(model.parameterCount ?? "0") <= 4 ? "4-8 GB" : parseInt(model.parameterCount ?? "0") <= 13 ? "8-16 GB" : "32+ GB"} of RAM.`,
          },
        ]}
      />
      <ModelDetailPage model={modelData} />
    </>
  );
}
