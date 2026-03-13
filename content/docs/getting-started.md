# Getting Started

Welcome to LLM Trust — the trusted platform for discovering, comparing, and evaluating open-source large language models.

---

## What is LLM Trust?

LLM Trust is a centralized platform designed to help developers, researchers, and AI enthusiasts discover, compare, and evaluate large language models. We provide verified model information, performance benchmarks, detailed technical specifications, and community-driven reviews — all in one place.

Our mission is to bring transparency and trust to the rapidly growing ecosystem of open-source and commercial LLMs. Whether you're choosing your first model to run locally or evaluating options for a production deployment, LLM Trust gives you the data and context you need to make informed decisions.

**What makes us different:**

- **Verified data** — Every model listing is cross-checked against official sources and community feedback
- **Real benchmarks** — Aggregated from multiple evaluation frameworks with full attribution
- **Community reviews** — Honest, hands-on reviews from developers who actually use these models
- **No paywalls on essentials** — Browsing, comparing, and reading reviews is completely free

> LLM Trust is not a model hosting service. We link to HuggingFace and other providers for downloads. You run models locally on your own hardware.

---

## How to Browse Models

The [Models page](/models) is your starting point for discovering LLMs. Here's how to make the most of it.

### Search & Filters

- **Search bar** — Type a model name, architecture (e.g., "llama", "mistral"), or keyword
- **Category badges** — Filter by use case: Text Generation, Code, Vision, Embedding
- **Sort options** — Order by Popularity, Newest, Downloads, or Name
- **Parameter filter** — Narrow down by model size (1B–3B, 7B–13B, 70B+, etc.)
- **License filter** — Show only models with specific open-source licenses

### Reading Model Cards

Each model card on the browse page shows key information at a glance:

| Field | Description |
|-------|-------------|
| **Parameter count** | e.g., "7B", "70B", "8x7B" (Mixture of Experts) |
| **Architecture** | The base architecture: llama, mistral, qwen, phi, etc. |
| **Category** | Primary use case: text-generation, code, vision, embedding |
| **License** | Apache 2.0, MIT, Llama Community License, etc. |
| **Downloads** | Community adoption signal from HuggingFace |

### Model Detail Pages

Click any model card to see the full detail page with:

- Complete technical specifications (context length, training data, architecture details)
- Benchmark scores across multiple evaluation frameworks
- Community reviews and star ratings
- Available quantizations and file sizes
- One-command run instructions for popular tools (Ollama, llama.cpp, LM Studio)
- Direct HuggingFace download links
- Related models you might also consider

**Pro tip:** Bookmark your favorite models to your watchlist (requires a free account) so you can track updates and new quantizations.

---

## How to Compare Models

Side-by-side comparison is one of LLM Trust's most powerful features. It helps you choose between models for your specific needs.

### Using the Comparison Tool

1. Go to the [Compare page](/compare)
2. Select two models from the dropdown menus
3. View the full comparison table

You can also start a comparison directly from any model page by clicking the **"Compare"** button.

### What Gets Compared

- **Architecture & parameters** — Model size, type, and design
- **Context length** — Maximum input/output tokens
- **Training data** — What the model was trained on
- **License** — Legal terms of use
- **Benchmark scores** — MMLU, HumanEval, HellaSwag, GSM8K, and more
- **Community ratings** — Aggregated user reviews
- **Download statistics** — Real-world adoption numbers
- **Hardware requirements** — Minimum RAM, VRAM, and recommended setup

### Direct Comparison URLs

You can link directly to a comparison using this URL format:

```
/compare/[model-a]/vs/[model-b]
```

Example: `/compare/llama-3-70b/vs/mixtral-8x7b`

This is useful for sharing recommendations with teammates or embedding in documentation.

---

## How to Create an Account

Creating an account is quick, free, and unlocks the full LLM Trust experience.

### Sign Up

1. Click **"Sign Up"** in the top-right corner of any page
2. Choose your registration method:
   - **Email & password** — Traditional signup with email verification
   - **Google** — One-click OAuth signup
   - **GitHub** — One-click OAuth signup
   - **Discord** — One-click OAuth signup
3. If using email, check your inbox for a verification link and click it to activate

The entire process takes less than two minutes.

### What You Get With a Free Account

- **Watchlist** — Save models you're interested in and track updates
- **Reviews** — Write and publish reviews of models you've used
- **Community participation** — Join discussions, vote on reviews, suggest corrections
- **Personalized recommendations** — Get model suggestions based on your interests
- **Profile** — Build your reputation as a trusted reviewer

### Free vs Pro

| Feature | Free | Pro |
|---------|------|-----|
| Browse & search models | ✅ | ✅ |
| Read reviews & benchmarks | ✅ | ✅ |
| Save to watchlist | ✅ | ✅ |
| Write reviews | ✅ | ✅ |
| Compare models | ✅ | ✅ |
| API access | ❌ | ✅ |
| Advanced benchmark analytics | ❌ | ✅ |
| Custom watchlist alerts | ❌ | ✅ |
| Priority model verification | ❌ | ✅ |
| Early access to beta features | ❌ | ✅ |
| Rate limits | Standard | Unlimited |

For most individual developers and hobbyists, the free tier is more than sufficient. Pro is designed for teams and professionals who need deeper analytics and programmatic access.

→ [View Pro pricing](/pricing)

---

## Next Steps

Now that you're set up, here's what to explore next:

- **[Models Guide](/docs/models-guide)** — Deep dive into model specs, formats, and quantization
- **[Account & API](/docs/account)** — Managing your account, API keys, and Pro features
- **[Browse Models](/models)** — Start exploring 200+ open-source LLMs
- **[Blog](/blog)** — Latest news, model releases, and technical guides

---

*Last updated: March 2026*
