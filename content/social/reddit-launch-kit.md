# Reddit Launch Kit — LLM Trust

> Prepared by Aura, Head of Marketing — CroissantLabs 🥐
> Date: March 2026

---

## 📅 Posting Schedule Overview

| Subreddit | Optimal Time (ET) | Day | Why |
|---|---|---|---|
| r/LocalLLaMA | 9:00–10:00 AM | Tuesday/Wednesday | Peak US morning, EU afternoon catch-up |
| r/MachineLearning | 8:00–9:00 AM | Tuesday/Wednesday | Academic/industry crowd, early engagement spike |
| r/programming | 8:00–10:00 AM | Tuesday/Wednesday | Largest dev sub, morning US = max visibility |
| r/SideProject | 10:00 AM–12:00 PM | Thursday/Friday | Casual browsing, end-of-week "show what I built" energy |

> ⚠️ **Don't post all 4 on the same day.** Spread across 1–2 weeks to avoid looking like a campaign.

---

## 1. r/LocalLLaMA

### Rules Check
- ✅ Open-source focused — LLM Trust indexes OSS models
- ✅ Tool/platform posts allowed if genuinely useful
- ⚠️ No direct marketing or product pitches — lead with value
- ❌ Don't post duplicate content from other subs

### Post

**Title:** I built a free platform to discover and compare open-source LLMs

**Body:**

Hey r/LocalLLaMA 👋

I got tired of digging through Hugging Face, leaderboards, and scattered blog posts every time I needed to pick an LLM for a project. So I built **LLM Trust** — a free platform to discover, compare, and evaluate open-source language models.

**What it does:**

- **30+ models cataloged** — from Llama 3 to Mistral, Gemma, Qwen, and more
- **Side-by-side comparisons** — pick two models, see specs, benchmarks, and licensing next to each other
- **Multi-criteria benchmark view** — MMLU, HumanEval, GSM8K, latency, VRAM requirements
- **Filter by use case** — code generation, chat, summarization, multilingual, etc.
- **100% free, no account required**

**Tech stack:** Next.js 14, tRPC, TypeScript, Tailwind — deployed on Vercel.

I built this because I genuinely needed it and figured others do too. The data comes from publicly available benchmarks and model cards. Happy to add models or benchmarks you'd like to see.

👉 **Try it:** https://llmtrust.com

Would love feedback from this community — what would make this actually useful for your workflow?

**Optimal posting time:** Tuesday or Wednesday, 9:00–10:00 AM ET

---

## 2. r/MachineLearning

### Rules Check
- ✅ `[P]` tag required for project posts
- ✅ Must describe technical contribution or methodology
- ⚠️ No pure product promotion — frame as research/engineering project
- ❌ No memes, low-effort content

### Post

**Title:** [P] LLM Trust — Open-source LLM discovery & comparison platform

**Body:**

Hi r/MachineLearning,

Sharing a project I've been building: **LLM Trust** (https://llmtrust.com), a free platform for discovering and comparing open-source large language models.

**Motivation:**
The open-source LLM ecosystem has exploded — new models drop weekly, benchmarks are scattered across papers, leaderboards, and model cards. There's no single place to get a structured, comparable view of what's available.

**What LLM Trust offers:**

- Curated catalog of 30+ open-source models (Llama 3, Mistral, Gemma, Qwen, Phi, DeepSeek, etc.)
- Structured comparison engine: pick any two models, get a unified view of architecture (parameters, context length, quantization support), performance benchmarks (MMLU, HumanEval, GSM8K, HellaSwag), and licensing
- Benchmark aggregation from multiple sources (HF Open LLM Leaderboard, papers, official evals)
- Filtering by task type, parameter count, and deployment target (cloud, edge, mobile)

**Technical details:**

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS
- **API:** tRPC for type-safe client-server communication
- **Data pipeline:** Scripts to normalize and ingest benchmark data from heterogeneous sources
- **Architecture:** Server-rendered pages with static generation for model detail pages

**Current limitations:**
- Benchmark data is manually curated and may lag behind latest releases
- Community contributions / corrections not yet supported (planned)
- No user accounts or personalization yet

Feedback and contributions welcome. Particularly interested in thoughts on benchmark methodology and what data points matter most when choosing a model.

**Link:** https://llmtrust.com

**Optimal posting time:** Tuesday or Wednesday, 8:00–9:00 AM ET

---

## 3. r/programming

### Rules Check
- ✅ Technical build stories welcome
- ✅ Must include substantive technical content
- ⚠️ No "check out my product" — must be a real engineering narrative
- ❌ No blog spam or low-effort link drops

### Post

**Title:** How 6 AI agents built and shipped a web platform

**Body:**

I just shipped **LLM Trust** (https://llmtrust.com) — an open-source LLM comparison platform. The twist: most of the codebase was built by an orchestrated team of 6 AI agents, each with a specific role.

**The agent team:**

- **Product Manager** — scoped features, prioritized the roadmap, wrote user stories
- **Frontend Engineer** — built the Next.js UI, components, and pages
- **Backend Engineer** — set up tRPC API routes, data models, and business logic
- **DevOps** — configured Vercel deployments, CI/CD, and environment management
- **QA** — ran browser-based E2E tests, caught regressions, validated flows
- **Marketing** — wrote copy, social posts, and launch materials

Each agent runs in an isolated context with a defined role prompt (SOUL.md) and operates on the shared codebase through file tools and terminal access. The "CEO" agent orchestrates — receiving requests, delegating to the right department agent, and reviewing output.

**What I actually did as a human:**
- Defined the product vision and core features
- Reviewed and approved architecture decisions
- Manually tested critical flows
- Handled deployment credentials and domain setup

**What the agents handled:**
- ~90% of the code (Next.js, tRPC, TypeScript, Tailwind)
- All component design and implementation
- Data pipeline for benchmark ingestion
- Test suite and QA
- Marketing copy, social posts, Reddit launch kit (yes, this post was drafted by an agent)

**Tech stack:**
- Next.js 14 (App Router)
- tRPC for type-safe APIs
- TypeScript throughout
- Tailwind CSS
- Vercel deployment

**Lessons learned:**
1. Agents are great at execution, bad at taste — you need a human in the loop for product decisions
2. Multi-agent orchestration works best when roles are narrowly scoped
3. Code review is still essential — agents can produce working code that's architecturally questionable
4. The biggest bottleneck isn't code generation, it's context management and handoff between agents

Happy to answer questions about the agent setup, architecture, or the project itself.

**Optimal posting time:** Tuesday or Wednesday, 8:00–10:00 AM ET

---

## 4. r/SideProject

### Rules Check
- ✅ "Show your side project" posts encouraged
- ✅ Personal story and learnings valued
- ⚠️ Must be genuine, not disguised ads
- ❌ No repeated posts or spam

### Post

**Title:** Shipped my side project: LLM Trust — open-source LLM marketplace

**Body:**

Hey r/SideProject 👋

Just shipped my latest side project and wanted to share the journey.

**What is it?**
**LLM Trust** (https://llmtrust.com) — a free platform to discover and compare open-source language models. Think "product comparison tool" but for LLMs.

**The problem I was solving:**
Every time I wanted to pick an LLM for a project, I'd spend 30+ minutes jumping between Hugging Face, blog posts, leaderboards, and Twitter threads. There was no single place to see models side by side with their benchmarks and licensing info.

**Key metrics (first week):**
- 🕐 Built in ~2 weeks (with heavy AI agent assistance)
- 📦 30+ models cataloged
- 🎨 15+ pages/screens
- 💻 Full-stack: Next.js + tRPC + TypeScript
- 💰 Cost: $0 (Vercel free tier, no paid APIs)

**The build process:**
I used a multi-agent workflow — basically 6 AI agents with different roles (product, frontend, backend, DevOps, QA, marketing) orchestrated by a CEO agent. I handled vision, review, and deployment. The agents wrote ~90% of the code.

**Biggest learnings:**
1. **Scope ruthlessly.** The first version had half the features I planned. Shipping > perfection.
2. **Agents are fast but need guardrails.** They'll build what you ask, not what you mean.
3. **Free tier is your friend.** Vercel + no auth + static generation = $0 infra cost.
4. **Launch before you're ready.** I almost added user accounts, dark mode, and a blog. Glad I didn't.

**What's next:**
- Community contributions (submit corrections, suggest models)
- More benchmarks and comparison criteria
- Maybe an API if there's demand

**Try it:** https://llmtrust.com

Would love your feedback — what would make you actually bookmark and come back to a tool like this?

**Optimal posting time:** Thursday or Friday, 10:00 AM–12:00 PM ET

---

## 🛡️ General Reddit Posting Tips

1. **Engage in comments** — Reply to every question within the first 2 hours. Reddit's algorithm rewards engagement.
2. **Don't be salesy** — Lead with value and story, not features and CTAs.
3. **Cross-post carefully** — Wait 3–5 days between posts in different subs. Don't copy-paste the same content.
4. **Karma matters** — Make sure the posting account has genuine history in these subs before launching.
5. **Expect skepticism** — Reddit is brutal. Be honest about limitations. Authenticity wins.
6. **Have a backup link** — If the main URL gets filtered, have a backup (GitHub repo, alternative domain).
