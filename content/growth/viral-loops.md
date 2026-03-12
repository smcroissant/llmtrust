# Viral Loops — LLM Trust

**Objectif :** Chaque utilisateur introduit 0.3+ nouveaux utilisateurs (k-factor > 0.3)

---

## 1. Share Model Comparisons

### Feature : "Share This Comparison"
Sur chaque page `/compare/[a]-vs-[b]` :

```
┌─────────────────────────────────────────┐
│  📊 Llama 3 70B vs GPT-4o             │
│                                         │
│  [Tableau de comparaison visuel]        │
│                                         │
│  🔗 Share this comparison               │
│  [Twitter] [LinkedIn] [Copy Link]       │
│                                         │
│  Full comparison → llmtrust.com/compare │
└─────────────────────────────────────────┘
```

### Share Formats
1. **Twitter Card** : Infographic auto-générée avec scores
2. **OG Image** : Dynamic comparison image (generée server-side)
3. **Text snippet** : "Llama 3 70B scores 85% on HumanEval vs GPT-4o at 90%. Full comparison →"
4. **Markdown table** : Copy-paste pour Reddit/Discord

### Implementation
- Share buttons sur chaque page (Twitter, LinkedIn, Copy)
- Pre-filled text avec data clé
- UTM tracking sur chaque lien partagé
- Counter : "Shared 1,247 times" (social proof)

---

## 2. Embeddable Benchmark Widget

### Widget Types

#### Mini Widget (inline)
```html
<script src="https://llmtrust.com/embed/mini.js" 
        data-models="llama-3-70b,gpt-4o,mistral-7b"
        data-benchmark="humaneval"></script>
```

Renders :
```
┌────────────────────────────────┐
│ 🏆 LLM Trust Benchmarks       │
│                                │
│ Llama 3 70B  ████████░░ 85%   │
│ GPT-4o       █████████░ 90%   │
│ Mistral 7B   ██████░░░░ 62%   │
│                                │
│ More → llmtrust.com            │
└────────────────────────────────┘
```

#### Comparison Widget
```html
<script src="https://llmtrust.com/embed/compare.js"
        data-model-a="llama-3-70b"
        data-model-b="gpt-4o"></script>
```

#### Full Leaderboard Widget
```html
<script src="https://llmtrust.com/embed/leaderboard.js"
        data-category="coding"
        data-top="10"></script>
```

### Distribution Strategy
1. **Blog posts** — encourage bloggers to embed
2. **Documentation** — model docs could use widgets
3. **Forums** — share embed code in ML forums
4. **GitHub READMEs** — markdown badge format

### Viral Mechanics
- Every embed shows "Powered by LLM Trust"
- Links back to full comparison page
- Free to use, no signup required
- Creates backlinks (SEO boost)
- Brand awareness through ubiquitous presence

---

## 3. API for Developers

### Public API (Free Tier)
```
GET /api/v1/models                    → List all models
GET /api/v1/models/:id                → Model details
GET /api/v1/compare/:modelA/:modelB   → Comparison data
GET /api/v1/benchmarks/:category      → Benchmark results
GET /api/v1/leaderboard/:category     → Ranked models
```

### Viral Mechanics
1. **API key signup** → email capture
2. **Rate limit** → "Get higher limits, share LLM Trust"
3. **Code examples** → include LLM Trust attribution
4. **Developer dashboard** → engagement surface
5. **Webhooks** → new benchmark notifications → retention

### Attribution in Code Examples
```python
import requests

# Get benchmark data from LLM Trust
response = requests.get(
    "https://llmtrust.com/api/v1/compare/llama-3/gpt-4o",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
# Free API key → llmtrust.com/api
```

### Growth Loop
```
Developer needs LLM data →
Finds LLM Trust API →
Signs up for API key →
Builds integration →
Code includes attribution →
Other devs see attribution →
More signups
```

---

## 4. CLI Tool

### `llmtrust` CLI
```bash
# Install
npm install -g llmtrust

# Commands
llmtrust top                           # Top models overall
llmtrust top --category coding         # Top coding models
llmtrust compare llama-3 gpt-4o        # Side-by-side
llmtrust search "vision"               # Search models
llmtrust benchmark mistral-7b          # Run local benchmark
llmtrust suggest --ram 16gb --gpu rtx4090  # Model suggestion
```

### Viral Mechanics
1. **Branded output** : ASCII art header in every command
2. **"Powered by LLM Trust"** in output footer
3. **Share command** : `llmtrust share llama-3 gpt-4o` → generates shareable link
4. **Shell integration** : `llmtrust` in PS1 prompt
5. **Auto-update message** : "LLM Trust v2.1 — 12 new models added"

### Example Output
```
╔══════════════════════════════════════════╗
║         🔍 LLM Trust Compare            ║
║     llama-3-70b vs gpt-4o               ║
╠══════════════════════════════════════════╣
║ Benchmark      │ Llama 3  │ GPT-4o      ║
║────────────────┼──────────┼─────────────║
║ HumanEval      │   85.2%  │   90.2%     ║
║ MMLU           │   82.1%  │   88.7%     ║
║ GSM8K          │   93.0%  │   95.3%     ║
║ Speed (tok/s)  │   45     │   80        ║
║ Cost ($/1M)    │   $0.00  │   $5.00     ║
╚══════════════════════════════════════════╝

📊 Full comparison → https://llmtrust.com/compare/llama-3-70b-vs-gpt-4o
```

---

## 5. Model Release Alerts

### Feature : "Alert Me"
Sur chaque page de modèle :
- "Get notified when [Model] gets updated"
- Email signup → retention loop
- Notification : "New benchmark results for [Model]"

### Viral Mechanic
- Alert email includes "Share with a friend" link
- Social sharing in notification
- "X people are tracking this model" (social proof)

---

## 6. Comparison Infographics

### Auto-Generated Shareable Images
When a user shares a comparison, auto-generate :
- Side-by-side comparison graphic
- Scores with visual bars
- LLM Trust branding
- QR code to full comparison

### Tool
- Next.js API route generates OG images
- Uses `@vercel/og` or `satori` (free)
- Cached aggressively

### Distribution
- Twitter cards (auto-rendered)
- LinkedIn previews
- Reddit thumbnails
- Embed in blog posts

---

## 7. "LLM Trust Verified" Badge

### For Model Pages
```html
<!-- Badge for model creators to add to their docs -->
<a href="https://llmtrust.com/model/llama-3-70b">
  <img src="https://llmtrust.com/badge/llama-3-70b.svg" 
       alt="LLM Trust Verified — Llama 3 70B" />
</a>
```

### Variants
- **Verified** : "Verified on LLM Trust" (for tested models)
- **Top Rated** : "Top 10 Coding LLM" (for ranked models)
- **Community Pick** : "Community Favorite" (user-voted)

### Viral Loop
Model creators add badge → Their audience sees it → Clicks through → New LLM Trust user

---

## 8. Social Proof Mechanisms

### On-Site
- "12,487 comparisons made this week"
- "2,341 developers use LLM Trust"
- "487 models tracked"
- "Featured in [Publication]"

### Email Signature Generator
```
[Name]
[Title]

📊 Compare LLMs at llmtrust.com
```
Free tool to generate email signatures with LLM Trust link.

---

## 9. Viral Coefficients Target

| Loop | Expected k-factor | Time to conversion |
|------|-------------------|--------------------|
| Share comparison | 0.15 | Same session |
| Embed widget | 0.10 | 1-7 days |
| CLI tool | 0.05 | 1-14 days |
| API attribution | 0.05 | 7-30 days |
| Badge | 0.03 | 1-30 days |
| **Total** | **0.38** | |

**Target k-factor : 0.3** → Each user brings 0.3 new users
**Combined with SEO** → Sustainable organic growth

---

## 10. Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | Share buttons + OG images | Low | HIGH |
| P0 | Dynamic meta tags per page | Low | HIGH |
| P1 | Mini embed widget | Medium | HIGH |
| P1 | Public API (basic) | Medium | HIGH |
| P2 | CLI tool | High | MEDIUM |
| P2 | Comparison infographic | Medium | MEDIUM |
| P3 | Full widget suite | High | MEDIUM |
| P3 | Model badges | Low | LOW |
