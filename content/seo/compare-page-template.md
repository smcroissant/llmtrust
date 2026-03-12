# Compare Page SEO Template — LLM Trust

> Used for: `/compare/[modelA]-vs-[modelB]` — programmatic generation for all model pairs.
> All `{{variables}}` are replaced at build time. `modelA` = primary (first in URL), `modelB` = secondary.

---

## SEO Meta

```yaml
title: "{{modelA.name}} vs {{modelB.name}} — Which LLM Is Better? | LLM Trust"
meta_description: "{{modelA.name}} vs {{modelB.name}}: compare benchmarks, pricing, features, and real-world performance. Find the best LLM for your project on LLM Trust."
canonical: "https://www.llmtrust.com/compare/{{modelA.slug}}-vs-{{modelB.slug}}"
og_title: "{{modelA.name}} vs {{modelB.name}} — Full Comparison"
og_description: "Side-by-side comparison of {{modelA.name}} and {{modelB.name}}. Benchmarks, pricing, features, and our verdict."
og_image: "https://www.llmtrust.com/og/compare/{{modelA.slug}}-vs-{{modelB.slug}}.png"
og_type: "article"
robots: "index, follow"
structured_data:
  - type: "Article"
  - type: "FAQPage"
  - type: "BreadcrumbList"

# Canonical pair ordering: alphabetical by slug to prevent duplicate content
# /compare/gpt-4o-vs-claude-3 (NOT /compare/claude-3-vs-gpt-4o)
# Redirect non-canonical pair order to canonical
canonical_pair: "alphabetical_by_slug"
```

---

## Breadcrumb

```
Home > Compare > {{modelA.name}} vs {{modelB.name}}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.llmtrust.com" },
    { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://www.llmtrust.com/compare" },
    { "@type": "ListItem", "position": 3, "name": "{{modelA.name}} vs {{modelB.name}}", "item": "https://www.llmtrust.com/compare/{{modelA.slug}}-vs-{{modelB.slug}}" }
  ]
}
```

---

## H1

**{{modelA.name}} vs {{modelB.name}}** — Complete Comparison ({{currentYear}})

---

## Section 1: Quick Verdict

> Goal: TL;DR for users who want a fast answer. Show winner in each category.

### H2: Quick Verdict

```
| Category | Winner | Why |
|---|---|---|
| 🏆 Overall | **{{overallWinner.name}}** | {{overallWinner.reason}} |
| 💰 Pricing | **{{pricingWinner.name}}** | {{pricingWinner.reason}} |
| ⚡ Speed | **{{speedWinner.name}}** | {{speedWinner.reason}} |
| 🧠 Reasoning | **{{reasoningWinner.name}}** | {{reasoningWinner.reason}} |
| 💻 Code | **{{codeWinner.name}}** | {{codeWinner.reason}} |
| 📏 Context | **{{contextWinner.name}}** | {{contextWinner.reason}} |
| 🔓 Open Source | **{{openSourceWinner.name}}** | {{openSourceWinner.reason}} |
```

---

## Section 2: At a Glance — Side-by-Side Specs

> Goal: Full spec comparison. The core data users need.

### H2: {{modelA.name}} vs {{modelB.name}} — Specs at a Glance

```
| Specification | {{modelA.name}} | {{modelB.name}} |
|---|---|---|
| **Creator** | [{{modelA.creatorName}}]({{modelA.creatorUrl}}) | [{{modelB.creatorName}}]({{modelB.creatorUrl}}) |
| **Release Date** | {{modelA.releaseDate \| format("MMM YYYY")}} | {{modelB.releaseDate \| format("MMM YYYY")}} |
| **Model Type** | {{modelA.modelType}} | {{modelB.modelType}} |
| **Architecture** | {{modelA.architecture}} | {{modelB.architecture}} |
| **Parameters** | {{modelA.paramCount \| formatNumber("compact")}} | {{modelB.paramCount \| formatNumber("compact")}} |
| **Context Window** | {{modelA.contextWindow \| formatNumber}} tokens | {{modelB.contextWindow \| formatNumber}} tokens |
| **Max Output Tokens** | {{modelA.maxOutput \| formatNumber}} | {{modelB.maxOutput \| formatNumber}} |
| **Training Cutoff** | {{modelA.trainingCutoff}} | {{modelB.trainingCutoff}} |
| **Open Source** | {{#if modelA.openSource}}✅ {{modelA.license}}{{else}}❌ Proprietary{{/if}} | {{#if modelB.openSource}}✅ {{modelB.license}}{{else}}❌ Proprietary{{/if}} |
| **Multimodal** | {{modelA.modalities \| join(", ")}} | {{modelB.modalities \| join(", ")}} |
| **Languages** | {{modelA.languageCount}}+ | {{modelB.languageCount}}+ |
| **Function Calling** | {{#if modelA.functionCalling}}✅{{else}}❌{{/if}} | {{#if modelB.functionCalling}}✅{{else}}❌{{/if}} |
| **JSON Mode** | {{#if modelA.jsonMode}}✅{{else}}❌{{/if}} | {{#if modelB.jsonMode}}✅{{else}}❌{{/if}} |
| **Vision** | {{#if modelA.vision}}✅{{else}}❌{{/if}} | {{#if modelB.vision}}✅{{else}}❌{{/if}} |
| **Fine-tuning** | {{#if modelA.finetuning}}✅ Available{{else}}❌ Not available{{/if}} | {{#if modelB.finetuning}}✅ Available{{else}}❌ Not available{{/if}} |
```

---

## Section 3: Benchmark Comparison

> Goal: Head-to-head on every relevant benchmark.

### H2: Benchmark Comparison

```
| Benchmark | {{modelA.name}} | {{modelB.name}} | Difference |
|---|---|---|---|
{{#each benchmarks}}
| {{this.name}} | {{this.scoreA}} | {{this.scoreB}} | {{this.winner}} {{this.diff}} |
{{/each}}
| **Wins** | **{{modelA.winCount}}** | **{{modelB.winCount}}** | |
```

**Benchmark visualization (ASCII bar chart for plain text contexts):**

```
MMLU
├─ {{modelA.name}}  ████████████████████░░░░ {{modelA.mmlu}}%
└─ {{modelB.name}}  ██████████████████░░░░░░ {{modelB.mmlu}}%

HumanEval
├─ {{modelA.name}}  ██████████████████████░░ {{modelA.humanEval}}%
└─ {{modelB.name}}  ████████████████████░░░░ {{modelB.humanEval}}%

GSM8K
├─ {{modelA.name}}  ████████████████████████ {{modelA.gsm8k}}%
└─ {{modelB.name}}  ████████████████████░░░░ {{modelB.gsm8k}}%
```

**Note on methodology:**

> *Benchmark scores sourced from {{sources | join(", ")}}. Both models evaluated
> using identical prompts and evaluation harness. Scores represent the
> {{evalSetting}} variant (e.g., 5-shot, chain-of-thought) where applicable.*

---

## Section 4: Pricing Comparison

> Goal: Clear cost comparison with common usage scenarios.

### H2: Pricing Comparison

```
| Pricing | {{modelA.name}} | {{modelB.name}} | Cheaper |
|---|---|---|---|
| **Input (per 1M tokens)** | {{modelA.pricingInput}} | {{modelB.pricingInput}} | {{pricingInputWinner}} |
| **Output (per 1M tokens)** | {{modelA.pricingOutput}} | {{modelB.pricingOutput}} | {{pricingOutputWinner}} |
| **Fine-tuning (per 1M tokens)** | {{modelA.pricingFinetune}} | {{modelB.pricingFinetune}} | {{pricingFinetuneWinner}} |
| **Free Tier** | {{#if modelA.freeTier}}{{modelA.freeTierLimit}}{{else}}None{{/if}} | {{#if modelB.freeTier}}{{modelB.freeTierLimit}}{{else}}None{{/if}} | |
```

**Cost scenarios:**

```
### Cost for Common Use Cases

**Chatbot (1M input + 500K output/month):**
- {{modelA.name}}: {{scenarioChatbotA}}/month
- {{modelB.name}}: {{scenarioChatbotB}}/month
- **Savings with {{pricingScenarioChatbotWinner}}: {{pricingScenarioChatbotDiff}}/month**

**Code Assistant (2M input + 1M output/month):**
- {{modelA.name}}: {{scenarioCodeA}}/month
- {{modelB.name}}: {{scenarioCodeB}}/month
- **Savings with {{pricingScenarioCodeWinner}}: {{pricingScenarioCodeDiff}}/month**

**Content Generation (5M input + 2M output/month):**
- {{modelA.name}}: {{scenarioContentA}}/month
- {{modelB.name}}: {{scenarioContentB}}/month
- **Savings with {{pricingScenarioContentWinner}}: {{pricingScenarioContentDiff}}/month**
```

---

## Section 5: Speed & Latency

> Goal: Real-world latency numbers.

### H2: Speed & Latency Comparison

```
| Metric | {{modelA.name}} | {{modelB.name}} | Faster |
|---|---|---|---|
| Time to First Token | {{modelA.ttft}}ms | {{modelB.ttft}}ms | {{ttftWinner}} |
| Tokens/Second | {{modelA.tps}} | {{modelB.tps}} | {{tpsWinner}} |
| Avg Response (256 tokens) | {{modelA.avgResponse256}}s | {{modelB.avgResponse256}}s | {{avgResponseWinner}} |
| Avg Response (1024 tokens) | {{modelA.avgResponse1024}}s | {{modelB.avgResponse1024}}s | {{avgResponse1024Winner}} |
```

---

## Section 6: Use Case Comparison

> Goal: Which model is better for specific use cases.

### H2: When to Use {{modelA.name}} vs {{modelB.name}}

```
### {{modelA.name}} Is Better For:

{{#each modelA.bestUseCases}}
✅ **{{this.useCase}}** — {{this.reason}}
{{/each}}

### {{modelB.name}} Is Better For:

{{#each modelB.bestUseCases}}
✅ **{{this.useCase}}** — {{this.reason}}
{{/each}}

### Both Are Great For:

{{#each sharedUseCases}}
🤝 **{{this.useCase}}** — {{this.reason}}
{{/each}}
```

**Default use case mappings (from DB tags):**

| Tag | Use Case Description |
|---|---|
| `code-gen` | Building code assistants and IDE integrations |
| `chat` | Customer support chatbots and virtual assistants |
| `rag` | Retrieval-augmented generation over documents |
| `agents` | Autonomous agent workflows with tool use |
| `summarization` | Document and article summarization |
| `creative` | Creative writing, marketing copy, brainstorming |
| `analysis` | Data analysis, research, and report generation |
| `translation` | Multilingual translation and localization |
| `education` | Tutoring and educational content |
| `embeddings` | Semantic search and similarity matching |

---

## Section 7: Developer Experience

> Goal: API quality, SDK support, documentation.

### H2: Developer Experience Comparison

```
| Aspect | {{modelA.name}} | {{modelB.name}} |
|---|---|---|
| **API Quality** | {{modelA.apiQuality}} | {{modelB.apiQuality}} |
| **SDK Support** | {{modelA.sdks \| join(", ")}} | {{modelB.sdks \| join(", ")}} |
| **Documentation** | {{modelA.docQuality}} | {{modelB.docQuality}} |
| **OpenAI-Compatible** | {{#if modelA.openaiCompat}}✅{{else}}❌{{/if}} | {{#if modelB.openaiCompat}}✅{{else}}❌{{/if}} |
| **Streaming** | {{#if modelA.streaming}}✅{{else}}❌{{/if}} | {{#if modelB.streaming}}✅{{else}}❌{{/if}} |
| **Batch API** | {{#if modelA.batch}}✅{{else}}❌{{/if}} | {{#if modelB.batch}}✅{{else}}❌{{/if}} |
| **Rate Limits** | {{modelA.rateLimits}} | {{modelB.rateLimits}} |
| **Community Size** | {{modelA.communitySize}} | {{modelB.communitySize}} |
```

---

## Section 8: Verdict & Recommendation

> Goal: Clear, opinionated recommendation based on data.

### H2: Our Verdict

```
### Overall Winner: {{overallWinner.name}} 🏆

{{overallVerdict}}

**{{modelA.name}}** {{modelA.verdictSummary}}

**{{modelB.name}}** {{modelB.verdictSummary}}

### Final Recommendations:

| If you need... | Choose |
|---|---|
| Best overall quality | **{{overallQualityWinner}}** |
| Lowest cost at scale | **{{costWinner}}** |
| Fastest responses | **{{speedWinner}}** |
| Best for code | **{{codeWinner}}** |
| Open-source / self-host | **{{openSourceWinner}}** |
| Easiest to integrate | **{{dxWinner}}** |
| Largest context window | **{{contextWinner}}** |
| Most multimodal | **{{multimodalWinner}}** |
```

---

## Section 9: FAQ

### H2: Frequently Asked Questions

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is {{modelA.name}} better than {{modelB.name}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqOverallAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "Which is cheaper: {{modelA.name}} or {{modelB.name}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqPricingAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "Can I switch from {{modelA.name}} to {{modelB.name}} easily?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqMigrationAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "Which has a larger context window: {{modelA.name}} or {{modelB.name}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{modelA.name}} supports {{modelA.contextWindow}} tokens while {{modelB.name}} supports {{modelB.contextWindow}} tokens. {{contextWinner.name}} has the larger context window."
      }
    },
    {
      "@type": "Question",
      "name": "Is {{modelA.name}} or {{modelB.name}} better for coding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqCodeAnswer}}"
      }
    }
  ]
}
```

---

## Section 10: CTA

```
**Still not sure which model is right for you?**

Create a free LLM Trust account to compare {{totalModelCount}}+ models,
save your favorites, and get personalized recommendations.

**[Create Free Account →](https://www.llmtrust.com/signup)**
```

---

## Section 11: More Comparisons

### H2: More Comparisons

```
**{{modelA.name}} comparisons:**
{{#each modelA.otherComparisons}}
- [{{modelA.name}} vs {{this.name}}](https://www.llmtrust.com/compare/{{../modelA.slug}}-vs-{{this.slug}})
{{/each}}

**{{modelB.name}} comparisons:**
{{#each modelB.otherComparisons}}
- [{{modelB.name}} vs {{this.name}}](https://www.llmtrust.com/compare/{{../modelB.slug}}-vs-{{this.slug}})
{{/each}}
```

---

## Technical SEO Checklist (per comparison page)

- [ ] Title tag ≤ 60 chars, format: "X vs Y — Which LLM Is Better?"
- [ ] Meta description ≤ 155 chars
- [ ] Canonical URL uses alphabetical slug ordering
- [ ] Non-canonical order redirects (301) to canonical
- [ ] Schema.org: Article
- [ ] Schema.org: FAQPage
- [ ] Schema.org: BreadcrumbList
- [ ] Links to both model pages
- [ ] Links to 3-5 other comparisons per model
- [ ] Quick verdict section above the fold
- [ ] Benchmark table with clear winner indicators
- [ ] Pricing table with per-scenario costs
- [ ] Verdict section with opinionated recommendation
- [ ] Noindex if either model is discontinued
- [ ] Updated timestamp visible
- [ ] Mobile responsive tables
