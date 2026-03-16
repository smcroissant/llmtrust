import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { trustScore, scoreSnapshot, model } from "@/server/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { TrustScoreDetailClient } from "./trust-score-detail-client";
import { getScoreBand } from "@/lib/trust-score-utils";

interface Props {
  params: Promise<{ provider: string; model: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provider, model: modelSlug } = await params;

  const [modelData] = await db
    .select({ id: model.id, name: model.name, description: model.description })
    .from(model)
    .where(eq(model.slug, modelSlug))
    .limit(1);

  if (!modelData) return { title: "Trust Score Not Found" };

  const [score] = await db
    .select({ overallScore: trustScore.overallScore })
    .from(trustScore)
    .where(
      and(
        eq(trustScore.modelId, modelData.id),
        eq(trustScore.providerId, provider),
      ),
    )
    .orderBy(desc(trustScore.computedAt))
    .limit(1);

  const band = score ? getScoreBand(score.overallScore) : null;
  const title = `${modelData.name} Trust Score on ${provider}${band ? ` — ${band.label} (${score!.overallScore}/100)` : ""}`;
  const description = `Real trust score for ${modelData.name} via ${provider}. Computed from production API traffic: reliability, consistency, and cost efficiency metrics.`;

  return {
    ...generatePageMetadata({
      title,
      description,
      canonical: canonicalUrl(`/trust-scores/${provider}/${modelSlug}`),
      type: "article",
    }),
    openGraph: {
      ...generatePageMetadata({
        title,
        description,
        canonical: canonicalUrl(`/trust-scores/${provider}/${modelSlug}`),
        type: "article",
      }).openGraph,
      images: [
        {
          url: `/api/og/trust-score?model=${modelSlug}&provider=${provider}`,
          width: 1200,
          height: 630,
          alt: `${modelData.name} Trust Score`,
        },
      ],
    },
  };
}

export default async function TrustScoreDetailPage({ params }: Props) {
  const { provider, model: modelSlug } = await params;

  // Get model
  const [modelData] = await db
    .select({ id: model.id, name: model.name, slug: model.slug, description: model.description, parameterCount: model.parameterCount, architecture: model.architecture })
    .from(model)
    .where(eq(model.slug, modelSlug))
    .limit(1);

  if (!modelData) notFound();

  // Get current trust score
  const [currentScore] = await db
    .select()
    .from(trustScore)
    .where(
      and(
        eq(trustScore.modelId, modelData.id),
        eq(trustScore.providerId, provider),
      ),
    )
    .orderBy(desc(trustScore.computedAt))
    .limit(1);

  if (!currentScore) notFound();

  // Get 30-day history
  const cutoff30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const snapshots30d = await db
    .select({
      overallScore: scoreSnapshot.overallScore,
      reliabilityScore: scoreSnapshot.reliabilityScore,
      consistencyScore: scoreSnapshot.consistencyScore,
      costEfficiencyScore: scoreSnapshot.costEfficiencyScore,
      sampleSize: scoreSnapshot.sampleSize,
      snapshotDate: scoreSnapshot.snapshotDate,
    })
    .from(scoreSnapshot)
    .where(
      and(
        eq(scoreSnapshot.modelId, modelData.id),
        eq(scoreSnapshot.providerId, provider),
        gte(scoreSnapshot.snapshotDate, cutoff30d),
      ),
    )
    .orderBy(scoreSnapshot.snapshotDate);

  // Serialize dates for client component
  const serializedSnapshots = snapshots30d.map((s) => ({
    ...s,
    snapshotDate: s.snapshotDate.toISOString(),
  }));

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${modelData.name} (${provider})`,
            description: `Trust score for ${modelData.name} on ${provider}`,
            brand: { "@type": "Brand", name: provider },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: currentScore.overallScore,
              bestRating: 100,
              worstRating: 0,
              ratingCount: currentScore.sampleSize,
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Reliability Score",
                value: currentScore.reliabilityScore,
              },
              {
                "@type": "PropertyValue",
                name: "Consistency Score",
                value: currentScore.consistencyScore,
              },
              {
                "@type": "PropertyValue",
                name: "Cost Efficiency Score",
                value: currentScore.costEfficiencyScore,
              },
            ],
          }),
        }}
      />
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://llmtrust.com" },
              { "@type": "ListItem", position: 2, name: "Trust Scores", item: "https://llmtrust.com/trust-scores" },
              { "@type": "ListItem", position: 3, name: `${modelData.name} (${provider})`, item: `https://llmtrust.com/trust-scores/${provider}/${modelSlug}` },
            ],
          }),
        }}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trust Scores", href: "/trust-scores" },
          { label: `${modelData.name} (${provider})` },
        ]}
      />
      <TrustScoreDetailClient
        model={{
          name: modelData.name,
          slug: modelData.slug,
          description: modelData.description,
          parameterCount: modelData.parameterCount,
          architecture: modelData.architecture,
        }}
        providerId={provider}
        currentScore={{
          overallScore: currentScore.overallScore,
          reliabilityScore: currentScore.reliabilityScore,
          consistencyScore: currentScore.consistencyScore,
          costEfficiencyScore: currentScore.costEfficiencyScore,
          sampleSize: currentScore.sampleSize,
          periodDays: currentScore.periodDays,
          previousOverallScore: currentScore.previousOverallScore,
          trend: currentScore.trend,
          computedAt: currentScore.computedAt.toISOString(),
        }}
        snapshots={serializedSnapshots}
      />
    </>
  );
}
