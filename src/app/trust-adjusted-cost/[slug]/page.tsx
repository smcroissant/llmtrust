import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TACModelDetailClient } from "./tac-model-client";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { serverCaller } from "@/server/api/caller";
import { TopBar } from "@/components/layout/top-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await serverCaller.tac.byModelSlug({ slug });
    if (!result) return { title: "TAC Not Found" };

    return generatePageMetadata({
      title: `${result.model.name} — Trust-Adjusted Cost Breakdown`,
      description: `See the true cost of ${result.model.name} when reliability, hallucination rates, consistency, and compliance are factored in.`,
      canonical: canonicalUrl(`/trust-adjusted-cost/${slug}`),
      type: "article",
    });
  } catch {
    return { title: "TAC Not Found" };
  }
}

export default async function TACModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let data;
  try {
    data = await serverCaller.tac.byModelSlug({ slug });
  } catch {
    notFound();
  }

  if (!data) notFound();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trust-Adjusted Cost", href: "/trust-adjusted-cost" },
          { label: data.model.name },
        ]}
      />
      <TACModelDetailClient
        model={data.model}
        scores={data.scores}
        slug={slug}
      />
    </>
  );
}
