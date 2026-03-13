import type { Metadata } from "next";
import Script from "next/script";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { CompareClientPage } from "./compare-client";

function slugToName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}): Promise<Metadata> {
  const { slugA, slugB } = await params;
  const nameA = slugToName(slugA);
  const nameB = slugToName(slugB);

  return generatePageMetadata({
    title: `${nameA} vs ${nameB} — LLM Comparison`,
    description: `Compare ${nameA} and ${nameB} side by side. Architecture, parameters, context length, benchmarks, and more on LLM Trust.`,
    canonical: canonicalUrl(`/compare/${slugA}/vs/${slugB}`),
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}) {
  const { slugA, slugB } = await params;
  const nameA = slugToName(slugA);
  const nameB = slugToName(slugB);
  const compareUrl = `https://llmtrust.com/compare/${slugA}/vs/${slugB}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${nameA} vs ${nameB} — LLM Comparison`,
    description: `Side-by-side comparison of ${nameA} and ${nameB} language models.`,
    numberOfItems: 2,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: `https://llmtrust.com/models/${slugA}`,
        name: nameA,
      },
      {
        "@type": "ListItem",
        position: 2,
        url: `https://llmtrust.com/models/${slugB}`,
        name: nameB,
      },
    ],
  };

  return (
    <>
      <Script
        id="jsonld-compare"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Compare", url: "https://llmtrust.com/compare" },
          { name: `${nameA} vs ${nameB}`, url: compareUrl },
        ]}
      />
      <CompareClientPage slugA={slugA} slugB={slugB} />
    </>
  );
}
