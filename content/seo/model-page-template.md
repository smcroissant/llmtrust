# Model Page SEO Template — LLM Trust

> Used for: `/models/[slug]` — programmatic generation for every LLM in the database.
> All `{{variables}}` are replaced at build time from the database.

---

## SEO Meta

```yaml
title: "{{modelName}} — Complete Guide, Benchmarks & Comparison | LLM Trust"
meta_description: "{{modelName}} by {{creatorName}}: {{paramCount}} parameters, {{contextWindow}} context window. Benchmarks, features, pricing & how to use it. Compare on LLM Trust."
canonical: "https://www.llmtrust.com/models/{{slug}}"
og_title: "{{modelName}} — Everything You Need to Know"
og_description: "Explore {{modelName}}'s features, benchmarks, and real-world performance. Compare with other LLMs on LLM Trust."
og_image: "https://www.llmtrust.com/og/models/{{slug}}.png"
og_type: "article"
robots: "index, follow"
hreflang: "en"
structured_data:
  - type: "SoftwareApplication"
  - type: "FAQPage"
  - type: "BreadcrumbList"
```

---

## Breadcrumb (BreadcrumbList schema)

```
Home > Models > {{categoryName}} > {{modelName}}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.llmtrust.com" },
    { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.llmtrust.com/models" },
    { "@type": "ListItem", "position": 3, "name": "{{categoryName}}", "item": "https://www.llmtrust.com/models/categories/{{categorySlug}}" },
    { "@type": "ListItem", "position": 4, "name": "{{modelName}}", "item": "https://www.llmtrust.com/models/{{slug}}" }
  ]
}
```

---

## H1

**{{modelName}}** — Features, Benchmarks, Pricing & How to Use

---

## Section 1: Introduction

> Goal: 2–3 sentences, dense with information. Must include: creator, release date, model size, one standout fact.

**Template:**

```
{{modelName}} is a {{paramCount}}-parameter large language model developed by {{creatorName}},
released in {{releaseDate | format("MMMM YYYY")}}. With a {{contextWindow}}-token context window
and {{#if multimodal}}multimodal capabilities{{else}}text-only processing{{/if}},
it ranks among the {{tierDescription}} models available today. {{standoutFact}}.
```

**Example output (GPT-4o):**

> GPT-4o is a large language model developed by OpenAI, released in May 2024. With a 128K-token context window and native multimodal capabilities across text, vision, and audio, it ranks among the most versatile general-purpose models available today. It processes inputs 2× faster than GPT-4 Turbo at half the cost.

---

## Section 2: What is {{modelName}}?

> Goal: 150–200 words. Explain what the model IS, its architecture, training approach, and intended use.

### H2: What is {{modelName}}?

**Template (paragraphs auto-generated from DB fields):**

```
{{modelName}} is a {{modelType}} language model built on a {{architecture}} architecture.
It was trained by {{creatorName}} using {{trainingApproachDescription}},
resulting in a system optimized for {{primaryCapabilities | join(", ")}}.

{{#if openSource}}
As an open-source model released under the {{license}} license,
{{modelName}} can be freely downloaded, fine-tuned, and deployed on your own infrastructure.
The model weights are available on {{weightSource}}.
{{else}}
{{modelName}} is a proprietary model accessible via {{creatorName}}'s API.
It is also available through {{apiProviders | join(", ")}} for integration into applications.
{{/if}}

The model supports {{supportedLanguages}} and handles a context window of
{{contextWindow}} tokens, making it suitable for {{contextWindowUseCase}}.
```

**Sub-fields from DB:**

| Field | Source | Example |
|---|---|---|
| `modelType` | DB enum | base / instruct / chat / code |
| `architecture` | DB | Transformer, Mixture-of-Experts |
| `trainingApproach` | DB | RLHF, DPO, Constitutional AI |
| `primaryCapabilities` | DB array | ["code generation", "reasoning", "chat"] |
| `license` | DB | MIT, Apache 2.0, Llama 2 Community |
| `weightSource` | DB | Hugging Face, GitHub |
| `apiProviders` | DB array | [OpenAI, Azure, AWS Bedrock] |
| `supportedLanguages` | DB | 95+ languages |
| `contextWindow` | DB | 128,000 tokens |

---

## Section 3: Key Features

> Goal: 4–6 bullet features, each with a short explanation. Pull from DB tags/attributes.

### H2: Key Features of {{modelName}}

**Template:**

```
{{#each features}}
### {{this.icon}} {{this.name}}

{{this.description}}

{{#if this.metric}}**Key metric:** {{this.metric}}{{/if}}
{{/each}}
```

**Default features to render (if present in DB):**

1. **🧠 Reasoning & Logic** — if `capabilities` includes "reasoning"
2. **💻 Code Generation** — if `capabilities` includes "code"
3. **🌐 Multilingual Support** — if `languageCount > 10`
4. **👁️ Vision / Multimodal** — if `modalities` includes "image" or "audio"
5. **📏 Long Context** — if `contextWindow >= 32000`
6. **⚡ Speed & Efficiency** — if `tokensPerSecond` is available
7. **🔧 Function Calling** — if `supportsFunctionCalling` is true
8. **🔒 Safety & Alignment** — if `safetyFeatures` exists

**Each feature block:**

```
### {{emoji}} {{featureName}}

{{featureDescription}}

**Performance highlight:** {{featureMetric}}
*Example: "Scores 92.3% on HumanEval for code generation tasks."*
```

---

## Section 4: How to Use {{modelName}}

> Goal: Practical, actionable. Show API call example + local deployment if open source.

### H2: How to Use {{modelName}}

#### Option A: Via API

```
### Via {{primaryProvider}} API

```python
import {{sdkName}}

client = {{sdkName}}.{{clientConstructor}}(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="{{apiModelId}}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "{{examplePrompt}}"}
    ],
    max_tokens={{defaultMaxTokens}},
    temperature=0.7
)

print(response.choices[0].message.content)
```

**Pricing:** {{pricingPerInputToken}} per 1M input tokens · {{pricingPerOutputToken}} per 1M output tokens
**Rate limits:** {{rateLimitRPM}} requests/min · {{rateLimitTPM}} tokens/min
```

#### Option B: Local / Self-Hosted (if open source)

```
### Run Locally with Ollama

```bash
ollama pull {{ollamaModelId}}
ollama run {{ollamaModelId}}
```

**Minimum hardware:** {{minRam}} RAM · {{recommendedGPU}}
**Quantization options:** {{quantOptions | join(", ")}}
```

#### Option C: Cloud Providers

```
### Available on Cloud Platforms

| Provider | Model ID | Pricing |
|---|---|---|
{{#each cloudProviders}}
| {{this.name}} | `{{this.modelId}}` | {{this.pricing}} |
{{/each}}
```

---

## Section 5: Benchmarks & Performance

> Goal: Show real benchmark numbers. Include methodology note.

### H2: {{modelName}} Benchmarks & Performance

**Template:**

```
| Benchmark | {{modelName}} Score | Category Average | Top Performer |
|---|---|---|---|
{{#each benchmarks}}
| {{this.name}} | **{{this.score}}** | {{this.avgScore}} | {{this.topScore}} ({{this.topModel}}) |
{{/each}}
```

**Standard benchmarks to display (if data available):**

| Benchmark | Measures | Typical Range |
|---|---|---|
| MMLU | General knowledge | 50–92% |
| HumanEval | Code generation | 30–95% |
| GSM8K | Math reasoning | 40–97% |
| HellaSwag | Common sense | 70–95% |
| ARC-Challenge | Reasoning | 50–97% |
| MT-Bench | Multi-turn chat | 1–10 |
| MATH | Mathematical reasoning | 15–80% |
| GPQA | Graduate-level QA | 25–60% |
| IFEval | Instruction following | 50–85% |
| BigBench-Hard | Hard reasoning tasks | 40–90% |

**Performance cards (visual):**

```
⚡ Speed:       {{tokensPerSecond}} tokens/sec
📏 Context:     {{contextWindow | formatNumber}} tokens
💰 Cost:        {{costPerMTokens}} per 1M tokens (input)
🏋️ Parameters:  {{paramCount | formatNumber("compact")}}
📅 Released:    {{releaseDate | format("MMM YYYY")}}
📦 Size:        {{modelSizeGB}} GB (FP16)
```

**Methodology note (always include):**

> *Benchmarks shown are sourced from {{benchmarkSource}} and the
> [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard).
> Scores may vary based on evaluation settings, prompt format, and quantization.
> Last updated: {{lastUpdated | format("MMMM YYYY")}}.*

---

## Section 6: {{modelName}} vs {{topAlternative}}

> Goal: Quick comparison against the most likely alternative. Auto-select from DB.

### H2: {{modelName}} vs {{topAlternative}}: Which Should You Choose?

**Template:**

```
| Feature | {{modelName}} | {{topAlternative}} |
|---|---|---|
| Creator | {{creatorName}} | {{altCreator}} |
| Parameters | {{paramCount}} | {{altParamCount}} |
| Context Window | {{contextWindow}} tokens | {{altContextWindow}} tokens |
| Open Source | {{#if openSource}}✅ Yes{{else}}❌ No{{/if}} | {{#if altOpenSource}}✅ Yes{{else}}❌ No{{/if}} |
| Multimodal | {{#if multimodal}}✅{{else}}❌{{/if}} | {{#if altMultimodal}}✅{{else}}❌{{/if}} |
| MMLU Score | {{mmlu}} | {{altMmlu}} |
| Pricing (input) | {{pricingPerInputToken}} | {{altPricingInput}} |
| Best For | {{bestFor}} | {{altBestFor}} |
```

**Verdict paragraph:**

```
**Choose {{modelName}} if:** {{chooseThisIf}}
**Choose {{topAlternative}} if:** {{chooseAltIf}}

Overall, {{modelName}} excels at {{strengths | join(" and ")}},
while {{topAlternative}} is stronger in {{altStrengths | join(" and ")}}.
```

**Auto-select comparison target logic:**
1. Same category, closest param count → primary
2. If none, same creator's previous model → secondary
3. If none, most-compared model in analytics → fallback

---

## Section 7: Frequently Asked Questions

> Goal: 5 FAQs with schema.org FAQPage structured data.

### H2: Frequently Asked Questions About {{modelName}}

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is {{modelName}} free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqFreeAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "What is the context window of {{modelName}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{modelName}} supports a context window of {{contextWindow}} tokens, which is roughly equivalent to {{approxWords}} words or {{approxPages}} pages of text."
      }
    },
    {
      "@type": "Question",
      "name": "How does {{modelName}} compare to {{topAlternative}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqComparisonAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "Can I fine-tune {{modelName}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqFinetuneAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "What are the best use cases for {{modelName}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faqUseCasesAnswer}}"
      }
    }
  ]
}
```

**FAQ Answer Templates:**

```
Q1: Is {{modelName}} free to use?
A1: {{#if openSource}}
    Yes, {{modelName}} is open-source under the {{license}} license. You can download
    and run it for free on your own hardware. API access through {{apiProviders | join(" or ")}}
    starts at {{pricingPerInputToken}} per 1M input tokens.
    {{else}}
    {{modelName}} is available through a paid API. Pricing starts at
    {{pricingPerInputToken}} per 1M input tokens and {{pricingPerOutputToken}} per 1M output tokens.
    {{creatorName}} {{#if freeTier}}also offers a free tier with {{freeTierLimit}}{{else}}does not offer a free tier{{/if}}.
    {{/if}}

Q2: What is the context window of {{modelName}}?
A2: {{modelName}} supports a context window of {{contextWindow}} tokens,
    approximately {{approxWords}} words or {{approxPages}} pages.

Q3: How does {{modelName}} compare to {{topAlternative}}?
A3: {{modelName}} {{comparisonSummary}}. For detailed comparison, see our
    [{{modelName}} vs {{topAlternative}}](https://www.llmtrust.com/compare/{{slug}}-vs-{{altSlug}}) page.

Q4: Can I fine-tune {{modelName}}?
A4: {{#if openSource}}
    Yes. {{modelName}} can be fine-tuned using {{finetuneTools | join(", ")}}.
    {{creatorName}} provides {{#if officialGuide}}[official fine-tuning guides]({{officialGuideUrl}}){{else}}community resources for fine-tuning{{/if}}.
    {{else}}
    Fine-tuning for {{modelName}} is available through {{creatorName}}'s
    {{#if finetuneAvailable}}fine-tuning API{{else}}custom model programs{{/if}}.
    {{/if}}

Q5: What are the best use cases for {{modelName}}?
A5: {{modelName}} excels at {{primaryCapabilities | join(", ")}}.
    It is commonly used for {{useCaseExamples | join(", ")}}.
```

---

## Section 8: CTA (Call to Action)

> Goal: Convert visitor to sign-up.

### H2: Find the Right LLM for Your Project

```
Not sure if {{modelName}} is the right fit? LLM Trust helps you compare
{{totalModelCount}}+ models across benchmarks, pricing, and capabilities.

**[Create Your Free Account →](https://www.llmtrust.com/signup)**

- ✅ Compare {{totalModelCount}}+ models side by side
- ✅ Filter by price, performance, and features
- ✅ Get personalized model recommendations
- ✅ Track new model releases
```

---

## Section 9: Related Models (Internal Links)

> Goal: 5 internal links to related models. Auto-generated.

### H2: Related Models You Might Like

```
{{#each relatedModels}}
- **[{{this.name}}]({{this.url}})** — {{this.tagline}} ({{this.paramCount}}, {{this.category}})
{{/each}}
```

**Selection logic:**
1. Same category, different creator (2 models)
2. Same creator, different category (1 model)
3. Similar benchmark scores ±10% (1 model)
4. Most viewed in last 30 days (1 model)

---

## Technical SEO Checklist (per page)

- [ ] Title tag ≤ 60 characters
- [ ] Meta description ≤ 155 characters
- [ ] H1 unique and includes model name
- [ ] Canonical URL set
- [ ] OG image generated (1200×630)
- [ ] Schema.org: SoftwareApplication
- [ ] Schema.org: FAQPage
- [ ] Schema.org: BreadcrumbList
- [ ] Internal links: 5+ to other models
- [ ] Internal links: 1 to category page
- [ ] Internal links: 1 to comparison page
- [ ] Image alt text includes model name
- [ ] Page load < 2.5s (LCP)
- [ ] Mobile responsive
- [ ] No orphan pages (linked from category + sitemap)
