import type { Metadata } from "next";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Newsletter — The Open-Source AI Weekly Digest",
  description:
    "Subscribe to the LLM Trust newsletter. Weekly updates on new model releases, benchmark results, pro tips, and community highlights. Free, no spam.",
  canonical: canonicalUrl("/newsletter"),
});

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
