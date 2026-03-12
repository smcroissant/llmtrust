# Category Page SEO Template — LLM Trust

> Used for: `/models/categories/[categorySlug]` — programmatic generation for every LLM category.
> All `{{variables}}` are replaced at build time from the database.

---

## SEO Meta

```yaml
title: "Best {{categoryName}} LLMs in 2026 — Ranked & Compared | LLM Trust"
meta_description: "Discover the top {{categoryName}} LLMs in 2026. Compare {{modelCount}} models by benchmarks, pricing, and features. Find the best {{categorySlug | humanize}} model for your project."
canonical: "https://www.llmtrust.com/models/categories/{{categorySlug}}"
og_title: "Best {{categoryName}} LLMs in 2026"
og_description: "Compare {{modelCount}} {{categoryName}} models. Benchmarks, pricing, and expert recommendations."
og_image: "https://www.llmtrust.com/og/categories/{{categorySlug}}.png"
og_type: "website"
robots: "index, follow"
structured_data:
  - type: "CollectionPage"
  - type: "ItemList"
  - type: "BreadcrumbList"
```

---

## Breadcrumb

```
Home > Models > {{categoryName}}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.llmtrust.com" },
    { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.llmtrust.com/models" },
    { "@type": "ListItem", "position": 3, "name": "{{categoryName}}", "item": "https://www.llmtrust.com/models/categories/{{categorySlug}}" }
  ]
}
```

---

## H1

**Best {{categoryName}} LLMs in 2026** — Ranked, Compared & Reviewed

---

## Section 1: Introduction

> Goal: 100–150 words. Define the category, explain why it matters, tease the ranking.

### H2: What Are {{categoryName}} LLMs?

**Template:**

```
{{categoryName}} LLMs are large language models specifically optimized for
{{categoryDescription}}. Unlike general-purpose models, these LLMs excel at
{{keyCapabilities | join(", ")}}.

In 2026, the landscape of {{categorySlug | humanize}} models has evolved dramatically.
{{trendStatement}}.

Below, we rank and compare {{modelCount}} {{categoryName}} models based on
benchmarks, real-world performance, pricing, and ease of use — updated for {{currentQuarter}}.
```

**Category descriptions (from DB or static):**

| Category Slug | Description |
|---|---|
| `chat` | conversational AI and interactive dialogue |
| `code-generation` | writing, completing, and debugging code |
| `reasoning` | complex logical reasoning and problem-solving |
| `text-generation` | producing long-form written content |
| `summarization` | condensing documents and articles |
| `translation` | multilingual translation and localization |
| `embedding` | generating vector embeddings for semantic search |
| `image-generation` | creating images from text descriptions |
| `multimodal` | processing text, images, audio, and video |
| `tool-use` | function calling and agent workflows |

---

## Section 2: Top {{categoryName}} LLMs — Ranked

> Goal: Ranked list of all models in the category.

### H2: Top {{topN | default(10)}} {{categoryName}} Models ({{currentYear}})

**ItemList schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best {{categoryName}} LLMs in {{currentYear}}",
  "numberOfItems": {{modelCount}},
  "itemListElement": [
    {{#each models}}
    {
      "@type": "ListItem",
      "position": {{@index_1}},
      "url": "https://www.llmtrust.com/models/{{this.slug}}",
      "name": "{{this.name}}"
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ]
}
```

**Ranked model card template:**

```
### {{rank}}. {{modelName}}

![{{modelName}} logo]({{logoUrl}})

**By {{creatorName}} · Released {{releaseDate | format("MMM YYYY")}}**

{{modelDescription | truncate(120)}}

| Metric | Value |
|---|---|
| Parameters | {{paramCount | formatNumber("compact")}} |
| Context Window | {{contextWindow | formatNumber}} tokens |
| Key Benchmark | {{topBenchmarkName}}: {{topBenchmarkScore}} |
| Pricing | {{pricingPerInputToken}} / 1M input tokens |
| License | {{license}} |

**[View Full Profile →](https://www.llmtrust.com/models/{{slug}})** ·
**[Compare →](https://www.llmtrust.com/compare/{{slug}}-vs-{{defaultComparisonSlug}})**
```

---

## Section 3: Comparison Table

> Goal: Full comparison table of all models in the category.

### H2: {{categoryName}} Models — Side-by-Side Comparison

```
| Rank | Model | Creator | Params | Context | {{primaryBenchmark}} | Pricing (input) | Open Source |
|---|---|---|---|---|---|---|---|
{{#each models}}
| {{@index_1}} | [{{this.name}}](/models/{{this.slug}}) | {{this.creatorName}} | {{this.paramCount | compact}} | {{this.contextWindow | compact}} | {{this.primaryBenchmarkScore}} | {{this.pricingInput}} | {{#if this.openSource}}✅{{else}}❌{{/if}} |
{{/each}}
```

**Dynamic benchmark column:**
- Code Generation → HumanEval
- Chat → MT-Bench
- Reasoning → MMLU or GPQA
- Text Generation → MMLU
- Summarization → ROUGE-L
- Translation → BLEU
- Embedding → MTEB
- Default → MMLU

---

## Section 4: How to Choose the Right {{categoryName}} LLM

> Goal: Decision framework. Help users pick based on their needs.

### H2: How to Choose the Right {{categoryName}} Model

**Template:**

```
Choosing the right {{categorySlug | humanize}} model depends on your specific needs.
Here's a decision framework:

### 🏢 For Enterprise / Production Use
**Recommended:** {{enterpriseRecommendation}}
- SLA-backed API availability
- SOC 2 / HIPAA compliance options
- Dedicated support and fine-tuning
- {{enterpriseReason}}

### 💰 For Budget-Conscious Projects
**Recommended:** {{budgetRecommendation}}
- Lowest cost per token at scale
- {{budgetReason}}
- Consider: {{budgetAlternative}}

### 🔬 For Research / Experimentation
**Recommended:** {{researchRecommendation}}
- Open-source with permissive license
- {{researchReason}}
- Active community and tooling

### ⚡ For Latency-Sensitive Applications
**Recommended:** {{latencyRecommendation}}
- Fastest time-to-first-token
- {{latencyMetric}} avg response time
- {{latencyReason}}

### 🎯 For Maximum Quality
**Recommended:** {{qualityRecommendation}}
- Highest benchmark scores in category
- {{qualityReason}}
- Trade-off: {{qualityTradeoff}}
```

---

## Section 5: Category Benchmarks Overview

> Goal: Aggregate benchmark view for the category.

### H2: {{categoryName}} Benchmarks — How We Evaluate

```
We evaluate {{categoryName}} models using the following benchmarks:

| Benchmark | What It Measures | Weight in Ranking |
|---|---|---|
{{#each categoryBenchmarks}}
| **{{this.name}}** | {{this.description}} | {{this.weight}}% |
{{/each}}
```

**Benchmark methodology note:**

> *Our rankings combine public benchmark scores with real-world performance testing.
> We evaluate models on {{benchmarkCount}} dimensions including quality, speed, cost,
> and ease of integration. Benchmark data sourced from {{sources | join(", ")}}.
> Last updated: {{lastUpdated | format("MMMM YYYY")}}.*

---

## Section 6: FAQ

### H2: Frequently Asked Questions

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best {{categorySlug | humanize}} LLM in {{currentYear}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Based on our benchmarks, {{topModel.name}} by {{topModel.creatorName}} is the best overall {{categorySlug | humanize}} LLM in {{currentYear}}, scoring {{topModel.topScore}} on {{topModel.topBenchmark}}. However, the best choice depends on your specific needs — see our comparison guide above."
      }
    },
    {
      "@type": "Question",
      "name": "Are there free {{categorySlug | humanize}} models?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{freeModelAnswer}}"
      }
    },
    {
      "@type": "Question",
      "name": "How many {{categorySlug | humanize}} models are there?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "As of {{currentDate | format('MMMM YYYY')}}, we track {{modelCount}} {{categorySlug | humanize}} LLMs on LLM Trust. New models are added regularly as they are released."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use these models commercially?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{commercialUseAnswer}}"
      }
    }
  ]
}
```

---

## Section 7: CTA

```
**[Explore All {{totalModelCount}}+ Models →](https://www.llmtrust.com/models)**

Create a free LLM Trust account to save your favorite models, compare them
side by side, and get notified when new {{categoryName}} models launch.

**[Create Free Account →](https://www.llmtrust.com/signup)**
```

---

## Section 8: Related Categories

### H2: Explore Other Model Categories

```
{{#each relatedCategories}}
- **[{{this.name}}](https://www.llmtrust.com/models/categories/{{this.slug}})** — {{this.modelCount}} models
{{/each}}
```

---

## Technical SEO Checklist (per category page)

- [ ] Title tag ≤ 60 characters, includes "Best" + category + year
- [ ] Meta description ≤ 155 characters
- [ ] H1 includes category name + current year
- [ ] Canonical URL set
- [ ] Schema.org: CollectionPage
- [ ] Schema.org: ItemList (ranked)
- [ ] Schema.org: BreadcrumbList
- [ ] Schema.org: FAQPage
- [ ] Internal links to ALL models in the category
- [ ] Internal links to related categories (3-5)
- [ ] Internal link to /models (hub page)
- [ ] Comparison table with proper `<thead>` / `<tbody>`
- [ ] Page updated date visible
- [ ] Mobile responsive table (horizontal scroll)
- [ ] No duplicate content across category pages
