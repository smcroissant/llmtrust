import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "API Reference — LLM Trust REST API",
  description: "LLM Trust REST API documentation. Endpoints for model data, trust scores, trust-adjusted cost, benchmarks & comparisons. Integrate LLM Trust into your apps.",
  canonical: canonicalUrl("/docs/api"),
});

function EndpointCard({
  method,
  path,
  description,
  params,
  response,
}: {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; required?: boolean; desc: string }[];
  response: string;
}) {
  return (
    <div className="card-glow p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${method === "GET" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>
          {method}
        </span>
        <code className="text-sm font-mono">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {params && params.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2">Parameters</p>
          <div className="space-y-1">
            {params.map((p) => (
              <div key={p.name} className="flex items-start gap-2 text-xs">
                <code className="bg-muted px-1.5 py-0.5 rounded">{p.name}</code>
                <span className="text-muted-foreground">{p.type}</span>
                {p.required && <span className="text-red-500">required</span>}
                <span className="text-muted-foreground">— {p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold mb-2">Response</p>
        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
          <code>{response}</code>
        </pre>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API" },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">API Reference</h1>
        <p className="text-muted-foreground mb-8">
          Integrate LLM Trust into your applications with our REST API.
        </p>

        <div className="space-y-6">
          {/* Auth */}
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Authentication</h2>
            <p className="text-sm text-muted-foreground mb-4">
              All API requests require an API key. Generate one from your dashboard.
            </p>
            <code className="text-sm bg-muted px-3 py-1.5 rounded-md block">
              Authorization: Bearer llmt_your_api_key
            </code>
          </div>

          {/* Models */}
          <EndpointCard
            method="GET"
            path="/api/v1/models"
            description="List and search available models with trust scores."
            params={[
              { name: "provider", type: "string", desc: "Filter by provider ID" },
              { name: "limit", type: "number", desc: "Max results (default: 50)" },
            ]}
            response={`{
  "data": [
    {
      "id": "uuid",
      "name": "GPT-4o",
      "slug": "gpt-4o",
      "provider": "openai",
      "trustScore": 92.5
    }
  ]
}`}
          />

          {/* Trust-Adjusted Cost */}
          <div className="pt-4">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              Trust-Adjusted Cost (TAC)
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              The true cost of an LLM when reliability, hallucination rates, consistency, and compliance are factored in.
              TAC = nominalCost × (1/reliability) × (1 + hallucinationRate × 3) × consistencyPenalty × compliancePenalty
            </p>
          </div>

          <EndpointCard
            method="GET"
            path="/api/v1/models/{id}/trust-adjusted-cost"
            description="Get the Trust-Adjusted Cost for a specific model. Accepts model slug or UUID."
            params={[
              { name: "id", type: "string", required: true, desc: "Model slug or UUID (path param)" },
              { name: "provider", type: "string", desc: "Filter by provider ID (query param)" },
            ]}
            response={`{
  "data": [
    {
      "modelId": "uuid",
      "modelSlug": "gpt-4o",
      "modelName": "GPT-4o",
      "provider": "openai",
      "nominalCost": { "perMToken": 15.0, "currency": "USD" },
      "trustAdjustedCost": { "perMToken": 18.75, "currency": "USD" },
      "breakdown": {
        "reliabilityScore": 95,
        "reliabilityMultiplier": 1.053,
        "hallucinationRate": 0.03,
        "hallucinationOverhead": 1.09,
        "consistencyScore": 92,
        "consistencyPenalty": 1.04,
        "complianceScore": 88,
        "compliancePenalty": 1.036
      },
      "sampleSize": 1500,
      "lastUpdated": "2026-03-15T12:00:00Z"
    }
  ]
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/v1/models/trust-adjusted-cost/leaderboard"
            description="Get TAC leaderboard — all models sorted by trust-adjusted cost. Lower TAC = better value."
            params={[
              { name: "limit", type: "number", desc: "Max results (default: 20, max: 100)" },
              { name: "provider", type: "string", desc: "Filter by provider ID" },
              { name: "sortBy", type: "tac | nominal | penalty", desc: "Sort field (default: tac)" },
            ]}
            response={`{
  "data": [
    {
      "modelId": "uuid",
      "modelName": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "tacPerMToken": 22.4,
      "nominalCostPerMToken": 18.0,
      "savingsOrPenalty": 4.4,
      "grade": { "grade": "B", "description": "Fair value" }
    }
  ]
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/v1/models/{id}/trust-adjusted-cost/history"
            description="Get historical TAC data for trend analysis."
            params={[
              { name: "id", type: "string", required: true, desc: "Model slug or UUID" },
              { name: "provider", type: "string", required: true, desc: "Provider ID" },
              { name: "days", type: "number", desc: "Lookback window in days (default: 90, max: 365)" },
            ]}
            response={`{
  "data": [
    {
      "snapshotDate": "2026-03-15",
      "tacPerMToken": 18.75,
      "nominalCostPerMToken": 15.0,
      "reliabilityScore": 95,
      "hallucinationRate": 0.03,
      "consistencyScore": 92,
      "complianceScore": 88
    }
  ]
}`}
          />
        </div>

        <div className="mt-8">
          <Link href="/docs" className="text-primary text-sm hover:underline">
            ← Back to docs
          </Link>
        </div>
      </div>
    </>
  );
}
