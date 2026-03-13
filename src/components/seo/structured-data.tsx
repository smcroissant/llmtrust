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
  parameterCount?: string;
  architecture?: string;
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
  parameterCount,
  architecture,
}: SoftwareApplicationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `https://llmtrust.com/models/${slug}`,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: category ?? "Artificial Intelligence",
    operatingSystem: "Any",
    softwareVersion: parameterCount ?? undefined,
    softwareRequirements: "Python 3.8+, Ollama or llama.cpp for local execution",
    ...(architecture && {
      processorRequirements: `Supports ${architecture} architecture`,
    }),
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
      availability: "https://schema.org/InStock",
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

// ============================================
// FAQPage — for model detail pages
// ============================================

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqPageJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="jsonld-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// ItemList — for category pages
// ============================================

interface ItemListEntry {
  name: string;
  url: string;
  description?: string;
}

export function ItemListJsonLd({
  name,
  description,
  items,
}: {
  name: string;
  description?: string;
  items: ItemListEntry[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description && { description }),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
      ...(item.description && { description: item.description }),
    })),
  };

  return (
    <Script
      id="jsonld-itemlist"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// Article — for blog posts
// ============================================

// ============================================
// Organization — for homepage / global
// ============================================

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LLM Trust",
    url: "https://llmtrust.com",
    logo: "https://llmtrust.com/og-default.svg",
    description:
      "The trusted platform for discovering, comparing, and running open-source large language models locally.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/llmtrust",
      "https://github.com/llmtrust",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@llmtrust.com",
      url: "https://llmtrust.com/docs",
    },
  };

  return (
    <Script
      id="jsonld-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://llmtrust.com/blog/${slug}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: authorName ?? "LLM Trust",
    },
    publisher: {
      "@type": "Organization",
      name: "LLM Trust",
      logo: {
        "@type": "ImageObject",
        url: "https://llmtrust.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://llmtrust.com/blog/${slug}`,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };

  return (
    <Script
      id={`jsonld-article-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
