import type { Metadata } from "next";

interface PageSeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

const SITE_NAME = "LLM Trust";
const BASE_URL = "https://llmtrust.com";

/**
 * Generates Next.js Metadata object for a page.
 * Use in `generateMetadata()` or page-level `metadata` export.
 */
export function generatePageMetadata({
  title,
  description,
  canonical,
  ogImage,
  type = "website",
  noIndex = false,
}: PageSeoProps): Metadata {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  const url = canonical ?? BASE_URL;
  const imageUrl = ogImage ?? `${BASE_URL}/og-default.svg`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Helper to build canonical URLs
 */
export function canonicalUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${clean}`;
}
