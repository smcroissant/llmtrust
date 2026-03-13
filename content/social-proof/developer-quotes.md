# Social Proof — Developer Quotes

Usage guidelines:
- Select 3-5 quotes for homepage (above the fold section)
- Rotate quotes on landing pages based on audience (enterprise → quotes 1 & 4; indie → 2 & 3; teams → 3 & 5)
- Can be used as static cards or auto-rotating carousel
- All quotes are fictional — replace with real testimonials when available

---

## Quote 1 — The Pragmatic CTO

> "We were spending $12K/month on GPT-4 without questioning it. LLM Trust showed us that Claude 3.5 Sonnet outperforms it on our actual workloads — for one-third the cost. That single insight saved us $96K this year."

**— Marcus Chen**, CTO at FlowStack
🏢 Enterprise · 50+ engineers
🎯 Use case: Code generation, internal tools

*Placement: Homepage hero social proof strip, Enterprise landing page*

---

## Quote 2 — The Solo Developer

> "As an indie hacker, I don't have time to test every new model. LLM Trust is my shortcut. I check the rankings every Monday and ship by Friday. It's like having a research team in my browser."

**— Léa Moreau**, Solo Founder of DraftPal
🚀 Indie · 1-person team
🎯 Use case: Product development, prototyping

*Placement: Homepage, Creator/Indie landing page*

---

## Quote 3 — The Skeptic Turned Believer

> "I'll be honest — I thought LLM Trust was just another benchmark aggregator. Then I ran their tests against our internal eval suite and the results were within 2% accuracy. Now it's our team's single source of truth for model selection."

**— Priya Sharma**, Lead ML Engineer at NeuralPath
🏢 Mid-size startup · 12-person ML team
🎯 Use case: Model evaluation, production ML

*Placement: Homepage, Technical/ML landing page*

---

## Quote 4 — The Enterprise Buyer

> "Our procurement team needed data to justify switching from OpenAI to a multi-provider strategy. LLM Trust's comparison reports gave us exactly what we needed — cost projections, latency benchmarks, and quality metrics. We closed the vendor review in 2 weeks instead of 2 months."

**— James Wright**, VP Engineering at ScaleForce
🏢 Enterprise · 200+ engineers
🎯 Use case: Vendor evaluation, cost optimization

*Placement: Enterprise landing page, ROI-focused sections*

---

## Quote 5 — The Prompt Engineer

> "The 'Tip of the Week' in the newsletter alone is worth the subscription. Last week's tip about model-specific system prompt optimization improved our agent's task completion rate by 23%. LLM Trust doesn't just benchmark models — it makes you better at using them."

**— Tomoko Ishida**, Senior Prompt Engineer at AgentLabs
🏢 Mid-size · AI-first startup
🎯 Use case: Agent development, prompt optimization

*Placement: Newsletter signup incentive, Blog sidebar*

---

## Design Notes

### Card Format (Homepage)

```
┌──────────────────────────────────────────────┐
│  "Quote text here..."                        │
│                                              │
│  ┌─────┐                                     │
│  │photo│  Name, Title at Company             │
│  │     │  🏷️ tag · 🏷️ tag                    │
│  └─────┘                                     │
└──────────────────────────────────────────────┘
```

- Dark card (#1a1a1a) with subtle border (#2a2a2a)
- Quote text: 16px, #d0d0d0, italic
- Name: 14px, #ffffff, bold
- Tags: 12px, #888, small pill badges
- Optional: Company logo in grayscale next to name

### Carousel Behavior
- Auto-rotate every 6 seconds
- Pause on hover
- Dot indicators for navigation
- Swipe support on mobile
- Fade transition (300ms ease)

### Trust Indicators to Add
- Star rating visual (⭐⭐⭐⭐⭐)
- "Verified LLM Trust Pro User" badge
- Company logo strip (when real logos available)

---

## Headline Variations

For the social proof section on the homepage:

- **A:** "Trusted by developers who benchmark what matters"
- **B:** "12,000+ developers trust our data to make model decisions"
- **C:** "The benchmarks behind smart LLM choices"
- **D:** "Don't guess. Measure."
