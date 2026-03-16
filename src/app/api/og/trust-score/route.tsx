import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/og/trust-score?model=slug&provider=openai
 *
 * Generates OpenGraph images for trust score pages.
 * Shows model name, provider, overall score, and score band.
 */

// Score band colors and labels
const BANDS = [
  { min: 80, label: "Excellent", color: "#10b981", bg: "#ecfdf5" },
  { min: 60, label: "Good", color: "#84cc16", bg: "#f7fee7" },
  { min: 40, label: "Fair", color: "#f59e0b", bg: "#fffbeb" },
  { min: 20, label: "Caution", color: "#f97316", bg: "#fff7ed" },
  { min: 0, label: "Unreliable", color: "#ef4444", bg: "#fef2f2" },
];

function getBand(score: number) {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const modelSlug = searchParams.get("model") ?? "unknown";
  const provider = searchParams.get("provider") ?? "unknown";
  const score = parseInt(searchParams.get("score") ?? "0", 10);
  const modelName = searchParams.get("name") ?? modelSlug;

  const band = getBand(score);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
            }}
          >
            LLMTrust
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#52525b",
            }}
          >
            Trust Score
          </div>
        </div>

        {/* Model name */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#fafafa",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {modelName}
        </div>

        {/* Provider */}
        <div
          style={{
            fontSize: "24px",
            color: "#71717a",
            marginBottom: "40px",
          }}
        >
          via {provider}
        </div>

        {/* Score display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Score circle */}
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              border: `6px solid ${band.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: band.color,
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#a1a1aa",
              }}
            >
              / 100
            </div>
          </div>

          {/* Band label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: band.color,
              }}
            >
              {band.label}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#71717a",
              }}
            >
              Trust Rating
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            color: "#52525b",
          }}
        >
          Computed from real production LLM API traffic
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
