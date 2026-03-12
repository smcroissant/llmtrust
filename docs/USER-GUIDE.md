# LLM Trust — User Guide

> Last updated: 2026-03-12

## Table of Contents

- [Quick Start](#quick-start)
- [Browsing Models](#browsing-models)
- [Using Filters](#using-filters)
- [Searching](#searching)
- [Comparing Models](#comparing-models)
- [Writing a Review](#writing-a-review)
- [Uploading / Submitting a Model](#uploading--submitting-a-model)
- [Downloading & Running Locally](#downloading--running-locally)
- [FAQ](#faq)

---

## Quick Start

1. Go to **[llmtrust.com](https://www.llmtrust.com)**
2. Browse featured models on the homepage or click **Browse Models** to see the full catalog
3. Use filters or search to narrow down by use case, architecture, or size
4. Click a model card to view specs, benchmarks, community reviews, and download options

No account needed to browse. Sign up (free) to leave reviews, submit models, and access personalized features.

---

## Browsing Models

**Homepage** shows:
- **Featured Models** — hand-picked by the community & team
- **Browse by Category** — quick links to use-case clusters (Code, Chat, Multimodal, etc.)
- **Latest Additions** — most recently added models

**Full catalog** (`/models`):
- Grid of model cards showing name, provider, parameter count, and category tags
- Sort by: newest, most downloaded, highest rated

Click any model card to open the **Model Detail Page** with:
- Full specs (architecture, context window, license, quantization options)
- Benchmark results
- Community reviews & ratings
- Direct HuggingFace download link
- CLI command for one-click local run

---

## Using Filters

On the `/models` page, use the filter sidebar or toolbar:

| Filter | Description | Examples |
|---|---|---|
| **Category** | Use-case grouping | Chat, Code, Vision, Embedding, Math, Multilingual |
| **Architecture** | Model family / type | Transformer, MoE, Mamba, Diffusion |
| **Size** | Parameter count range | <1B, 1-7B, 7-13B, 13-70B, 70B+ |
| **License** | Open-source license | Apache 2.0, MIT, Llama, CC-BY |
| **Context Window** | Max sequence length | 4K, 8K, 32K, 128K, 1M+ |

Filters are **combinable** — select multiple categories, a size range, and an architecture to drill down precisely. Active filters appear as removable chips above the results.

**Tips:**
- Start broad (one category), then narrow with size/architecture
- Use **Reset** to clear all filters at once
- Bookmark filtered URLs — they persist in the URL query string

---

## Searching

The **search bar** (top of every page) supports:

- **Model name** — e.g. `Llama 3`, `Mistral`, `DeepSeek`
- **Provider** — e.g. `Meta`, `Qwen`, `Cohere`
- **Free text** — e.g. `code generation`, `long context`, `multilingual`

Search results update in real-time and respect your active filters.

---

## Comparing Models

1. From the catalog, click the **compare** checkbox (or icon) on 2-4 model cards
2. Click **Compare** to open the side-by-side view
3. The comparison table shows:
   - Parameter count
   - Architecture type
   - Context window
   - License
   - Key benchmarks (MMLU, HumanEval, etc.)
   - Community rating
   - Download count

Use this to decide which model fits your use case before downloading.

---

## Writing a Review

> Requires a free account (sign up or sign in first).

1. Navigate to a **Model Detail Page**
2. Scroll to the **Reviews** section
3. Click **Write a Review**
4. Provide:
   - **Rating** (1-5 stars)
   - **Use case** — what you used the model for
   - **Pros** — what worked well
   - **Cons** — limitations you found
   - **Summary** — short headline for your review
5. Submit

Reviews are moderated. Be specific and constructive — it helps the whole community.

---

## Uploading / Submitting a Model

> Requires a free account.

1. Go to your **Dashboard** → **Submit a Model**
2. Fill in the form:
   - **Model name** and **HuggingFace URL**
   - **Category** (select one or more)
   - **Architecture** and **parameter count**
   - **License**
   - **Description** — what the model does, key strengths
   - **Benchmarks** (optional) — link or paste results
3. Submit for review

Our team reviews submissions within **48 hours**. You'll get an email when your model is published.

**Requirements:**
- Model must be publicly available on HuggingFace (or equivalent)
- Must include a valid license
- Description must be accurate and non-promotional

---

## Downloading & Running Locally

### Direct Download

Every model detail page has a **Download** button that links to the HuggingFace repository. No hosting fees, always the latest version.

### CLI (One-Command Run)

Install the LLM Trust CLI:

```bash
npm install -g @llmtrust/cli
# or
pip install llmtrust
```

Run any model with one command:

```bash
llmtrust run <model-slug>
```

The CLI handles downloading, quantization selection, and launching the model locally. Privacy-first — everything runs on your machine.

---

## FAQ

**Q: Is LLM Trust free?**
A: Yes. 100% free and open. No credit card required.

**Q: Do you host the models?**
A: No. We link directly to HuggingFace. Downloads go through their infrastructure. We don't store model weights.

**Q: How are models curated?**
A: Community submissions are reviewed by our team for accuracy, licensing, and quality. Featured models are hand-picked based on community adoption and benchmarks.

**Q: Can I submit a closed-source or API-only model?**
A: Not currently. LLM Trust focuses on open-source models that can be downloaded and run locally.

**Q: How do I report an inaccurate model listing?**
A: Use the **Report** button on the model detail page, or email support@llmtrust.com.

**Q: What quantization formats are supported?**
A: Most models support GGUF (for llama.cpp) and GPTQ/AWQ (for GPU inference). Check the model detail page for available formats.

**Q: Can I use LLM Trust models commercially?**
A: Each model has its own license. Check the license field on the model detail page. We display license info clearly but you're responsible for compliance.

**Q: How do I delete my account?**
A: Go to Settings → Account → Delete Account, or email support@llmtrust.com.

---

*Need help? Contact support@llmtrust.com or visit our [Support page](./SUPPORT.md).*
