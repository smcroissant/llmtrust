# llmtrust

Trust scores for LLMs — directly in your AI workflows.

[![npm](https://img.shields.io/npm/v/llmtrust)](https://www.npmjs.com/package/llmtrust)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install llmtrust
# or
yarn add llmtrust
# or
pnpm add llmtrust
```

## Quick Start

```typescript
import { llmtrust } from "llmtrust";

// Get trust score for any model
const score = await llmtrust.score("openai", "gpt-4o");
console.log(score.score); // 85
console.log(score.band);  // "gold"

// Get model recommendations
const models = await llmtrust.recommend("coding", { budget: "pro", limit: 5 });
```

## Vercel AI SDK Integration

### Trust Score in Provider Metadata

```typescript
import { llmtrust } from "llmtrust/ai-sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await streamText({
  model: openai("gpt-4o"),
  experimental_providerMetadata: {
    llmtrust: await llmtrust.score("openai", "gpt-4o"),
  },
});
```

### React Badge Component

```tsx
import { ModelTrustBadge } from "llmtrust/ai-sdk/react";

export function ModelSelector() {
  return (
    <ModelTrustBadge
      provider="anthropic"
      model="claude-3.5-sonnet"
      showBreakdown
    />
  );
}

// Compact mode
<ModelTrustBadge
  provider="openai"
  model="gpt-4o"
  compact
/>
```

### Inline Trust Indicator

```tsx
import { TrustIndicator } from "llmtrust/ai-sdk/react";

// Use inside chat UIs
<TrustIndicator score={trustScoreData} inline />
```

### Score Breakdown Chart

```tsx
import { ScoreBreakdownChart } from "llmtrust/ai-sdk/react";

<ScoreBreakdownChart score={trustScoreData} />
```

## LangChain Integration

### Callback Handler

```typescript
import { LLMTrustCallback } from "llmtrust/langchain";

const callback = new LLMTrustCallback({
  logToConsole: true,
  threshold: 60,
  onBelowThreshold: (score) => {
    console.warn(`Low trust score: ${score.score}/100`);
  },
});

// Use with any LangChain chain
const result = await chain.invoke(
  { input: "Hello" },
  { callbacks: [callback] }
);
```

### Trust-Aware Routing

Automatically switch to a fallback model if the primary model's trust score drops below a threshold:

```typescript
import { trustAwareRoute } from "llmtrust/langchain";

const { result, usedProvider, usedModel, trustScore } = await trustAwareRoute(
  {
    primary: { provider: "openai", model: "gpt-4o", llm: openaiLLM },
    fallbacks: [
      { provider: "anthropic", model: "claude-3.5-sonnet", llm: anthropicLLM },
    ],
    minScore: 60,
    verbose: true,
  },
  (llm) => llm.invoke("Hello!")
);
```

### Model Recommendations

```typescript
import { recommend } from "llmtrust/langchain";

const topModels = await recommend({ task: "coding", budget: "pro", limit: 5 });
```

## Trust Bands

| Band | Score Range | Emoji |
|------|-------------|-------|
| Platinum | 90-100 | 💎 |
| Gold | 75-89 | 🥇 |
| Silver | 60-74 | 🥈 |
| Bronze | 40-59 | 🥉 |
| Red Flag | 0-39 | 🚩 |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LLMTRUST_API_KEY` | API key for authenticated requests | — |
| `LLMTRUST_API_URL` | Custom API endpoint | `https://api.llmtrust.io` |

## License

MIT — CroissantLabs 🥐
