# LLMTrust Integrations — LangChain & Vercel AI SDK

> Trust scores directly in your AI workflows, at the moment you pick a model.

---

## Overview

LLMTrust integrations surface trust scores inside developer toolchains — no need to visit our website. Scores are fetched client-side with 5-minute caching and graceful degradation (integrations work normally if the API is unreachable).

### Available Integrations

| Integration | Package | Platform | Status |
|-------------|---------|----------|--------|
| **Vercel AI SDK** | `llmtrust/ai-sdk` | TypeScript/React | ✅ v0.1 |
| **Vercel AI SDK React** | `llmtrust/ai-sdk/react` | React 18+ | ✅ v0.1 |
| **LangChain (TS)** | `llmtrust/langchain` | TypeScript | ✅ v0.1 |
| **LangChain (Python)** | `llmtrust-langchain` | Python 3.9+ | ✅ v0.1 |
| **OpenAI SDK Wrapper** | `llmtrust` (Python) | Python 3.9+ | ✅ v0.1 |

---

## 1. Vercel AI SDK Integration

### Installation

```bash
npm install llmtrust
```

### Trust Score in Provider Metadata

Add trust scores to any AI SDK call:

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

// Access score in your response handler
console.log(result.experimental_providerMetadata?.llmtrust.score); // 85
console.log(result.experimental_providerMetadata?.llmtrust.band);  // "gold"
```

### React Components

Drop-in components for Next.js App Router (works with both Server and Client Components):

```tsx
import { ModelTrustBadge } from "llmtrust/ai-sdk/react";

// Full badge with score + band
<ModelTrustBadge
  provider="anthropic"
  model="claude-3.5-sonnet"
  showBreakdown
/>

// Compact mode (just emoji + score)
<ModelTrustBadge
  provider="openai"
  model="gpt-4o"
  compact
/>

// With auto-refresh (default: 5 min)
<ModelTrustBadge
  provider="google"
  model="gemini-1.5-pro"
  refreshInterval={60000} // 1 minute
/>

// Inline indicator for chat UIs
import { TrustIndicator } from "llmtrust/ai-sdk/react";
<TrustIndicator score={scoreData} inline />

// Full breakdown chart
import { ScoreBreakdownChart } from "llmtrust/ai-sdk/react";
<ScoreBreakdownChart score={scoreData} />
```

### Component Props

#### `<ModelTrustBadge>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | required | LLM provider (e.g., "openai", "anthropic") |
| `model` | `string` | required | Model ID (e.g., "gpt-4o") |
| `refreshInterval` | `number` | `300000` | Auto-refresh in ms. `0` disables |
| `showScore` | `boolean` | `true` | Show numeric score |
| `showBreakdown` | `boolean` | `false` | Show score breakdown bars |
| `compact` | `boolean` | `false` | Compact mode (emoji + score) |
| `score` | `TrustScore` | — | Skip fetch, use provided score |

---

## 2. LangChain Integration

### TypeScript

```bash
npm install llmtrust @langchain/core
```

#### Callback Handler

```typescript
import { LLMTrustCallback } from "llmtrust/langchain";

const callback = new LLMTrustCallback({
  logToConsole: true,
  threshold: 60,
  onScore: (score) => {
    // Custom handling
    analytics.track("model_used", {
      provider: score.provider,
      model: score.model,
      trustScore: score.score,
    });
  },
  onBelowThreshold: (score) => {
    alert(`Warning: ${score.model} trust score is ${score.score}/100`);
  },
});

// Use with any LangChain chain
const result = await chain.invoke(
  { input: "Summarize this document" },
  { callbacks: [callback] }
);
```

#### Trust-Aware Routing

Automatically route to a fallback model when trust drops:

```typescript
import { trustAwareRoute } from "llmtrust/langchain";

const { result, usedProvider, usedModel, trustScore } = await trustAwareRoute(
  {
    primary: { provider: "openai", model: "gpt-4o", llm: openaiLLM },
    fallbacks: [
      { provider: "anthropic", model: "claude-3.5-sonnet", llm: anthropicLLM },
      { provider: "google", model: "gemini-1.5-pro", llm: googleLLM },
    ],
    minScore: 60,
    verbose: true,
  },
  (llm) => llm.invoke("Generate a report on Q1 sales")
);

console.log(`Used ${usedProvider}/${usedModel} (${trustScore.score}/100)`);
```

#### Model Recommendations

```typescript
import { recommend } from "llmtrust/langchain";

const models = await recommend({
  task: "coding",
  budget: "pro",
  limit: 5,
});

// Returns:
// [
//   { provider: "anthropic", model: "claude-3.5-sonnet", score: 88, band: "gold", reason: "..." },
//   { provider: "openai", model: "gpt-4o", score: 85, band: "gold", reason: "..." },
//   ...
// ]
```

### Python

```bash
pip install llmtrust[langchain]
```

```python
from llmtrust.langchain import LLMTrustCallback, recommend, trust_aware_route

# Callback handler
callback = LLMTrustCallback(
    log_to_console=True,
    threshold=60,
    on_below_threshold=lambda score: print(f"Low trust: {score.score}/100")
)

chain.invoke({"input": "Hello"}, callbacks=[callback])

# Recommendations
models = recommend(task="coding", budget="pro", limit=5)

# Trust-aware routing
result, provider, model, score = trust_aware_route(
    primary={"provider": "openai", "model": "gpt-4o", "llm": openai_llm},
    fallbacks=[{"provider": "anthropic", "model": "claude-3.5-sonnet", "llm": anthropic_llm}],
    min_score=60,
    invoke_fn=lambda llm: llm.invoke("Hello!"),
    verbose=True,
)
```

---

## 3. OpenAI SDK Drop-in Wrapper (Python)

Zero-config trust observability for OpenAI calls:

```bash
pip install llmtrust[openai]
```

```python
from llmtrust import OpenAI

# One line swap — same interface as official SDK
client = OpenAI(api_key="sk-...", trust_log=True)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Trust score is logged and attached to response
print(response._llmtrust_score.score)  # 85
print(response._llmtrust_score.band)   # "gold"
```

Also works with async:

```python
from llmtrust import AsyncOpenAI

client = AsyncOpenAI(api_key="sk-...", trust_log=True)
response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

---

## 4. Core API (Both Platforms)

### Score Bands

| Band | Score Range | Meaning |
|------|-------------|---------|
| 💎 Platinum | 90-100 | Exceptional transparency, consistency, and safety |
| 🥇 Gold | 75-89 | Strong trust metrics across all dimensions |
| 🥈 Silver | 60-74 | Acceptable trust, some areas for improvement |
| 🥉 Bronze | 40-59 | Below average, use with caution |
| 🚩 Red Flag | 0-39 | Significant trust concerns |

### Score Breakdown

Each score includes a breakdown across 5 dimensions:

- **Transparency** — How clearly the model communicates its capabilities and limitations
- **Consistency** — Reliability of outputs across similar prompts
- **Safety** — Resistance to harmful outputs, jailbreaks, and bias
- **Performance** — Task completion quality relative to benchmarks
- **Cost Efficiency** — Quality per dollar spent

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LLMTRUST_API_KEY` | API key for authenticated requests | — |
| `LLMTRUST_API_URL` | Custom API endpoint | `https://api.llmtrust.io` |

### Caching

All integrations cache scores client-side for **5 minutes** to avoid per-request API calls. Cache is in-memory and per-client instance.

### Graceful Degradation

If the LLMTrust API is unreachable:
- Scores default to **50 (Silver)**
- Integrations continue working normally
- No errors thrown — observability is best-effort

---

## 5. Coming Soon

- **LlamaIndex integration** — Trust scores in RAG pipelines
- **Vercel AI SDK middleware** — Automatic score injection for all `streamText`/`generateText` calls
- **Streaming score updates** — Real-time trust score changes via WebSocket
- **Custom scoring rubrics** — Enterprise customers can define their own trust dimensions

---

*— CroissantLabs Engineering 🥐*
