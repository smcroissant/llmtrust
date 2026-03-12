# Meta Descriptions Templates — LLM Trust

> 50+ programmatic meta description templates for all page types.
> All `{{variables}}` are replaced at build time. Templates rotate to avoid duplication across similar pages.
> Max length: 155 characters (Google truncates beyond ~160).

---

## Model Pages — 20 Variations
> Used for: `/models/[slug]`

| # | Template | Char Count |
|---|---|---|
| 1 | `{{modelName}} by {{creatorName}}: {{paramCount}} params, {{contextWindow}} context. Benchmarks, pricing & features. Compare on LLM Trust.` | ~140 |
| 2 | `Explore {{modelName}} — {{keyFeature1}}, {{keyFeature2}}, and {{keyFeature3}}. Full benchmarks and API pricing on LLM Trust.` | ~130 |
| 3 | `Everything about {{modelName}}: performance benchmarks, pricing, use cases, and how it compares to other LLMs. Updated {{currentYear}}.` | ~140 |
| 4 | `{{modelName}} review: {{mmluScore}}% MMLU, {{pricingInput}}/1M tokens. See benchmarks, features & real-world performance on LLM Trust.` | ~135 |
| 5 | `Is {{modelName}} right for your project? Compare benchmarks, pricing, and features. Detailed guide on LLM Trust.` | ~115 |
| 6 | `{{modelName}} guide: what it is, how to use it, benchmarks, and pricing. {{#if openSource}}Open-source{{else}}API-based{{/if}} model by {{creatorName}}.` | ~140 |
| 7 | `Discover {{modelName}} — {{creatorName}}'s {{modelType}} model with {{contextWindow}} context. Full specs, benchmarks & comparison.` | ~130 |
| 8 | `{{modelName}} vs top LLMs: benchmarks, pricing, speed. Find out if this {{paramCount}} model is right for you on LLM Trust.` | ~125 |
| 9 | `Learn about {{modelName}}: features, performance benchmarks (MMLU: {{mmluScore}}%), and how to get started. Complete guide.` | ~125 |
| 10 | `{{modelName}} by {{creatorName}} — {{releaseDate | format("YYYY")}} release. Compare benchmarks, pricing & use cases on LLM Trust.` | ~120 |
| 11 | `Compare {{modelName}} with other LLMs. See real benchmark scores, API pricing, context limits & best use cases.` | ~115 |
| 12 | `{{modelName}}: {{standoutFact | truncate(80)}}. Full model profile, benchmarks & comparison on LLM Trust.` | ~130 |
| 13 | `Thinking about using {{modelName}}? Get benchmarks, pricing, pros & cons, and alternatives on LLM Trust.` | ~110 |
| 14 | `{{modelName}} profile: {{paramCount}} parameters, {{contextWindow}} tokens, {{#if multimodal}}multimodal{{else}}text-only{{/if}}. See how it stacks up.` | ~135 |
| 15 | `How does {{modelName}} perform? Compare MMLU, HumanEval, GSM8K scores with competitors. Full analysis on LLM Trust.` | ~120 |
| 16 | `{{modelName}} — {{bestFor | truncate(50)}}. Benchmark scores, API pricing & integration guide. Updated {{currentQuarter}}.` | ~130 |
| 17 | `Get the full picture on {{modelName}}: architecture, training data, benchmarks, pricing, and real-world applications.` | ~120 |
| 18 | `{{modelName}} by {{creatorName}} explained. Context window, capabilities, benchmarks & cost. See if it fits your stack.` | ~120 |
| 19 | `Looking for a {{categoryName}} model? {{modelName}} delivers {{keyFeature1}}. Compare benchmarks & pricing on LLM Trust.` | ~120 |
| 20 | `{{modelName}} in-depth: strengths, weaknesses, benchmarks ({{primaryBenchmark}}: {{primaryScore}}), and alternatives.` | ~120 |

---

## Category Pages — 10 Variations
> Used for: `/models/categories/[categorySlug]`

| # | Template | Char Count |
|---|---|---|
| 1 | `Best {{categoryName}} LLMs in {{currentYear}}. Compare {{modelCount}} models by benchmarks, pricing & features. Expert rankings on LLM Trust.` | ~135 |
| 2 | `Top {{categoryName}} models ranked: {{topModel1}}, {{topModel2}}, {{topModel3}} & more. Compare benchmarks and pricing.` | ~125 |
| 3 | `Find the best {{categorySlug | humanize}} LLM for your project. Compare {{modelCount}} models with real benchmark data. Updated {{currentYear}}.` | ~140 |
| 4 | `{{modelCount}} {{categoryName}} LLMs compared: benchmarks, pricing, context windows. Our top picks for {{currentYear}}.` | ~120 |
| 5 | `Which {{categorySlug | humanize}} model should you use? We rank and compare {{modelCount}} options with real data.` | ~115 |
| 6 | `{{categoryName}} models guide: what they are, how to choose, and our top picks. Compare {{modelCount}} LLMs on LLM Trust.` | ~125 |
| 7 | `Compare the best {{categorySlug | humanize}} LLMs side by side. Benchmarks, pricing, and recommendations for {{currentYear}}.` | ~125 |
| 8 | `Looking for {{categorySlug | humanize}}? We tested {{modelCount}} models. See which ones rank highest on benchmarks.` | ~115 |
| 9 | `{{categoryName}} LLMs: from {{topModel}} to open-source alternatives. Full comparison with benchmarks & pricing.` | ~120 |
| 10 | `Need a {{categorySlug | humanize}} model? Compare {{modelCount}} LLMs by performance, cost, and ease of use on LLM Trust.` | ~120 |

---

## Compare Pages — 10 Variations
> Used for: `/compare/[modelA]-vs-[modelB]`

| # | Template | Char Count |
|---|---|---|
| 1 | `{{modelA.name}} vs {{modelB.name}}: benchmarks, pricing, features. Which LLM is better? Full comparison on LLM Trust.` | ~120 |
| 2 | `Compare {{modelA.name}} and {{modelB.name}} side by side. Performance benchmarks, cost analysis & our verdict.` | ~115 |
| 3 | `{{modelA.name}} vs {{modelB.name}} — which should you choose? See benchmarks, pricing & use cases compared.` | ~115 |
| 4 | `Head-to-head: {{modelA.name}} vs {{modelB.name}}. MMLU, HumanEval, pricing, speed. Our recommendation inside.` | ~115 |
| 5 | `{{modelA.name}} or {{modelB.name}}? Compare {{modelA.winCount}} vs {{modelB.winCount}} benchmark wins. Detailed analysis.` | ~120 |
| 6 | `Choosing between {{modelA.name}} and {{modelB.name}}? See the real performance difference with benchmarks & pricing.` | ~125 |
| 7 | `{{modelA.name}} vs {{modelB.name}} comparison: specs, benchmarks, pricing, and verdict. Make the right choice.` | ~115 |
| 8 | `Side-by-side LLM comparison: {{modelA.name}} vs {{modelB.name}}. Performance, cost, features & recommendations.` | ~120 |
| 9 | `{{modelA.name}} vs {{modelB.name}}: {{modelA.paramCount}} vs {{modelB.paramCount}} parameters compared. Benchmarks & pricing.` | ~125 |
| 10 | `Is {{modelA.name}} better than {{modelB.name}}? We compare benchmarks, pricing, speed & use cases to help you decide.` | ~125 |

---

## Blog Posts — 10 Variations
> Used for: `/blog/[slug]`

| # | Template | Char Count |
|---|---|---|
| 1 | `{{articleTitle}}. Expert analysis from LLM Trust — your source for LLM benchmarks, comparisons & industry insights.` | ~120 |
| 2 | `{{articleTitle}}. Deep dive into the latest LLM developments. Data-driven analysis on LLM Trust.` | ~110 |
| 3 | `Read: {{articleTitle}}. {{articleSubtitle | truncate(60)}} Full article on LLM Trust.` | ~120 |
| 4 | `{{articleTitle}} — what you need to know. Comprehensive analysis with real benchmark data from LLM Trust.` | ~115 |
| 5 | `New on LLM Trust: {{articleTitle}}. {{articleExcerpt | truncate(60)}}` | ~120 |
| 6 | `{{articleTitle}}. We analyzed the data so you don't have to. Expert insights from LLM Trust.` | ~110 |
| 7 | `LLM industry update: {{articleTitle}}. Benchmarks, trends & implications. Full analysis on LLM Trust.` | ~115 |
| 8 | `{{articleTitle}}. Stay ahead of the curve with data-driven LLM insights from LLM Trust.` | ~105 |
| 9 | `Understanding {{articleTopic}}: {{articleTitle}}. Complete guide with benchmarks & recommendations.` | ~115 |
| 10 | `{{articleTitle}}. Compare models, see benchmarks, and make informed decisions. LLM Trust blog.` | ~110 |

---

## Homepage — 5 Variations

| # | Template | Char Count |
|---|---|---|
| 1 | `Compare {{totalModelCount}}+ LLMs with real benchmarks. GPT-4, Claude, Llama, Gemini — all models ranked and compared. Free on LLM Trust.` | ~140 |
| 2 | `LLM Trust: compare benchmarks, pricing & features across {{totalModelCount}}+ large language models. Find the best LLM for your project.` | ~135 |
| 3 | `The definitive LLM comparison platform. Real benchmarks, pricing data & expert reviews for {{totalModelCount}}+ models. Free to use.` | ~130 |
| 4 | `Find the right LLM. Compare {{totalModelCount}}+ models by performance, cost & capabilities. Data-driven rankings on LLM Trust.` | ~130 |
| 5 | `LLM Trust helps you choose the right AI model. Compare benchmarks, pricing & features across all major LLMs. Start free.` | ~125 |

---

## Guidelines

### Length
- **Target:** 120–155 characters
- **Hard max:** 160 characters (Google truncates)
- **Minimum:** 70 characters (too short looks spammy)

### Format Rules
1. **No trailing periods** — wastes a character, Google adds ellipsis anyway
2. **Include the brand** — "LLM Trust" at the end when possible
3. **Use numbers** — they attract clicks (benchmark scores, param counts, prices)
4. **Include action words** — "Compare", "Explore", "Discover", "Find", "See"
5. **Avoid duplication** — rotate templates; never use the same template for two similar pages
6. **No keyword stuffing** — natural language, read it aloud

### Dynamic Rotation Logic

```python
def get_meta_description(page_type: str, page_data: dict) -> str:
    """Select a meta description template and fill variables."""
    templates = META_TEMPLATES[page_type]
    
    # Deterministic selection based on page slug hash
    index = hash(page_data["slug"]) % len(templates)
    template = templates[index]
    
    # Fill variables
    return template.render(**page_data)
```

### Character Count Validation

```python
def validate_meta(desc: str) -> bool:
    """Validate meta description length and content."""
    if len(desc) < 70:
        return False  # Too short
    if len(desc) > 160:
        return False  # Will be truncated
    if desc.count("{{") > 0:
        return False  # Unfilled variable
    return True
```
