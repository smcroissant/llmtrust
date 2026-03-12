import Script from "next/script";

interface SoftwareApplicationProps {
  name: string;
  description: string;
  slug: string;
  author?: string;
  version?: string;
  license?: string;
  downloadUrl?: string;
  category?: string;
  rating?: number;
  ratingCount?: number;
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  slug,
  author,
  license,
  downloadUrl,
  category,
  rating,
  ratingCount,
}: SoftwareApplicationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `https://llmtrust.com/models/${slug}`,
    applicationCategory: category ?? "DeveloperApplication",
    operatingSystem: "Any",
    ...(author && {
      author: {
        "@type": "Organization",
        name: author,
      },
    }),
    ...(license && { license }),
    ...(downloadUrl && {
      downloadUrl,
      installUrl: downloadUrl,
    }),
    ...(rating &&
      ratingCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount: ratingCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Script
      id={`jsonld-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LLM Trust",
    description:
      "Discover, compare, and run open-source LLMs. The trusted platform for AI model discovery and local execution.",
    url: "https://llmtrust.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://llmtrust.com/models?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="jsonld-website"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="jsonld-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
