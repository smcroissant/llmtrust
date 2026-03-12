import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelDetailPage } from "./model-detail-client";
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
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
      <ModelDetailPage model={modelData} />
    </>
  );
}
