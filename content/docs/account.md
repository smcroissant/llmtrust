# Account & API

Manage your LLM Trust account, configure API access, and understand Free vs Pro features.

---

## Managing Your Account

### Creating an Account

Creating an account on LLM Trust is quick and free. Click the **"Sign Up"** button in the top-right corner of any page, and choose your preferred registration method:

- **Email & password** — Enter your email, choose a password, and verify via the confirmation email we send you
- **Google** — One-click signup via Google OAuth
- **GitHub** — One-click signup via GitHub OAuth
- **Discord** — One-click signup via Discord OAuth

After registration (and email verification if using email/password), you can immediately start saving models to your watchlist, leaving reviews, and personalizing your experience. The entire process takes less than two minutes.

### Account Settings

Access your account settings by clicking your profile icon in the top-right corner → **Settings**. From here you can:

- **Profile** — Update your display name, bio, and avatar
- **Email preferences** — Control notification emails
- **Connected accounts** — Link or unlink OAuth providers
- **Password** — Change your password (email/password accounts only)
- **API Keys** — Generate and manage API keys (Pro)
- **Subscription** — View or upgrade your plan
- **Data export** — Download all your data (reviews, watchlist, activity)
- **Danger Zone** — Delete your account

### Resetting Your Password

If you've forgotten your password:

1. Go to the login page
2. Click **"Forgot Password?"**
3. Enter your email address
4. Check your inbox for a reset link (valid for 24 hours)
5. Click the link and set a new password

> For OAuth accounts (Google, GitHub, Discord), password management is handled through those providers. Resetting your LLM Trust password won't affect your third-party credentials.

### Data Export

You can export all your LLM Trust data at any time:

1. Go to Account Settings → **Data Export**
2. Click **"Request Export"**
3. We'll prepare a downloadable file containing your reviews, watchlist entries, and activity history
4. You'll receive an email with a download link when it's ready

### Deleting Your Account

We're sorry to see you go. To delete your account:

1. Go to Account Settings → **Danger Zone**
2. Click **"Delete Account"**
3. Confirm by entering your password

**What happens:**
- All your data (reviews, watchlist, API keys) is removed within 30 days
- Public reviews you've written may be retained in anonymized form
- This action is **permanent and irreversible**

> **Recommendation:** Export your data before deleting your account.

---

## API Keys

LLM Trust provides a REST API for integrating model data into your own applications, scripts, and workflows. API access requires a **Pro subscription**.

### Generating an API Key

1. Go to Account Settings → **API Keys** (or [/dashboard/api-keys](/dashboard/api-keys))
2. Click **"Generate New Key"**
3. Give the key a descriptive name (e.g., "CI Pipeline", "Research Script")
4. Select the permissions scope
5. Copy the key immediately — it won't be shown again

> ⚠️ **Security:** Store your API key securely. Never commit it to version control or share it publicly. If a key is compromised, revoke it immediately and generate a new one.

### Authentication

Include your API key in the `Authorization` header of every request:

```
Authorization: Bearer llmt_your_api_key_here
```

### Available Endpoints

#### List Models

```http
GET /api/v1/models
```

Query parameters:
- `search` — Search by name or keyword
- `category` — Filter by category (text-generation, code, vision, embedding)
- `architecture` — Filter by architecture (llama, mistral, qwen, etc.)
- `min_params` / `max_params` — Filter by parameter count
- `license` — Filter by license type
- `sort` — Sort field (popularity, newest, downloads, name)
- `order` — Sort order (asc, desc)
- `page` — Page number (default: 1)
- `limit` — Results per page (default: 20, max: 100)

**Example:**

```bash
curl -H "Authorization: Bearer llmt_your_key" \
  "https://llmtrust.com/api/v1/models?category=code&sort=popularity&limit=10"
```

**Response:**

```json
{
  "data": [
    {
      "id": "deepseek-coder-v2",
      "name": "DeepSeek Coder V2",
      "slug": "deepseek-coder-v2",
      "architecture": "deepseek",
      "parameters": "236B",
      "context_length": 128000,
      "license": "MIT",
      "category": "code",
      "downloads": 150000,
      "rating": 4.7
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

#### Get Model Details

```http
GET /api/v1/models/:slug
```

Returns complete model information including specs, benchmarks, and available quantizations.

#### Get Model Reviews

```http
GET /api/v1/models/:slug/reviews
```

Query parameters:
- `sort` — Sort by (newest, oldest, highest_rated, most_helpful)
- `page` / `limit` — Pagination

#### Submit a Review

```http
POST /api/v1/models/:slug/reviews
```

Request body:
```json
{
  "rating": 5,
  "title": "Excellent for code generation",
  "content": "Detailed review text...",
  "use_case": "code-generation",
  "hardware": "M2 Pro, 32GB RAM"
}
```

#### Search Models

```http
GET /api/v1/search?q=code+generation
```

Full-text search across model names, descriptions, and tags.

### Rate Limits

| Plan | Rate Limit | Daily Quota |
|------|-----------|-------------|
| Free | N/A (no API access) | N/A |
| Pro | 100 requests/minute | 10,000 requests/day |

Rate limit headers are included in every response:
- `X-RateLimit-Limit` — Your rate limit
- `X-RateLimit-Remaining` — Requests remaining in current window
- `X-RateLimit-Reset` — Unix timestamp when the window resets

If you exceed the rate limit, you'll receive a `429 Too Many Requests` response. Wait for the window to reset before retrying.

### Error Handling

The API uses standard HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (for POST requests) |
| 400 | Bad request — check your parameters |
| 401 | Unauthorized — invalid or missing API key |
| 403 | Forbidden — insufficient permissions |
| 404 | Not found — model or resource doesn't exist |
| 429 | Rate limited — slow down |
| 500 | Server error — contact support |

Error responses include a JSON body:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Model 'unknown-model' not found"
  }
}
```

### API Best Practices

- **Cache responses** — Model data doesn't change frequently. Cache results to reduce API calls
- **Use pagination** — Don't request all models at once; use `page` and `limit`
- **Handle errors gracefully** — Implement retry logic for 429 and 5xx errors
- **Rotate keys regularly** — Generate new keys periodically and revoke old ones
- **Use descriptive key names** — Helps you track which integration uses which key

---

## Free vs Pro Features

### Free Tier

The free tier on LLM Trust provides full access to our platform's core features:

- ✅ **Complete model directory** — Browse and search 200+ open-source LLMs
- ✅ **Detailed model pages** — Full specs, benchmarks, quantizations
- ✅ **Search & filters** — Find models by any criteria
- ✅ **Compare tool** — Side-by-side model comparison
- ✅ **Community reviews** — Read and write reviews
- ✅ **Watchlist** — Save favorite models
- ✅ **Educational content** — All documentation, guides, and blog posts
- ✅ **Community participation** — Discussions, voting, suggestions

The free experience is designed to be genuinely useful without any paywalls on essential information.

### Pro Subscription

Pro unlocks advanced features for teams and power users:

- 🚀 **API Access** — Programmatic access to all model data
- 🚀 **Advanced Analytics** — Historical benchmark trends, detailed comparisons
- 🚀 **Custom Alerts** — Get notified when new models matching your criteria are published
- 🚀 **Priority Verification** — Your model submissions get reviewed faster
- 🚀 **Early Access** — Beta features before they're public
- 🚀 **No Rate Limits** — Unlimited searches and API calls
- 🚀 **Priority Support** — Faster response times from our team

### Who Should Upgrade?

**Stay on Free if you:**
- Are an individual developer or hobbyist
- Browse models occasionally
- Don't need programmatic access
- Are exploring the LLM ecosystem

**Upgrade to Pro if you:**
- Build tooling around model selection
- Need API access for automation
- Want advanced benchmark analytics
- Work on a team evaluating models
- Want to integrate LLM Trust data into your CI/CD pipeline

→ [View pricing and upgrade](/pricing)

---

## Frequently Asked Questions

### General

<details>
<summary><strong>What is LLM Trust?</strong></summary>

LLM Trust is a centralized platform designed to help developers, researchers, and AI enthusiasts discover, compare, and evaluate large language models. We provide verified model information, performance benchmarks, detailed technical specifications, and community-driven reviews — all in one place. Our mission is to bring transparency and trust to the rapidly growing ecosystem of open-source and commercial LLMs.
</details>

<details>
<summary><strong>Is LLM Trust free to use?</strong></summary>

Yes! Browsing models, reading reviews, comparing models, and accessing educational content is completely free. Creating an account is also free and unlocks features like saving favorites and writing reviews. We also offer a Pro subscription for advanced features like API access and analytics.
</details>

<details>
<summary><strong>Do I need an account to browse models?</strong></summary>

No, you do not need an account to browse models, read reviews, or access most information on LLM Trust. However, creating a free account unlocks features like watchlists, reviews, and personalized recommendations.
</details>

<details>
<summary><strong>Do you host the models?</strong></summary>

No. LLM Trust is a discovery and comparison platform. We link to HuggingFace and other hosting providers for downloads. Models are run locally on your machine — we never see your data or prompts.
</details>

### Models

<details>
<summary><strong>How are models verified?</strong></summary>

Model verification on LLM Trust is a multi-step process. First, our automated systems cross-reference model metadata against official repositories, HuggingFace listings, and primary source documentation. Second, our community actively verifies by flagging discrepancies and suggesting corrections. Models with a high verification score have been reviewed by multiple community members and confirmed against primary sources. We display a verification badge and confidence score on each model page.
</details>

<details>
<summary><strong>Can I upload my own model?</strong></summary>

Yes! Any registered user can submit an open-source model. You'll need to provide comprehensive metadata including architecture, parameter count, training data description, license, intended use cases, and download links. All submissions go through a review process before being published. Head to [/models/upload](/models/upload) to submit.
</details>

<details>
<summary><strong>How are benchmarks calculated?</strong></summary>

We aggregate benchmark results from multiple widely recognized evaluation frameworks including MMLU (general knowledge), HumanEval and MBPP (coding), HellaSwag and ARC (reasoning), TruthfulQA (factual accuracy), and GSM8K (math). Each score is clearly attributed to its source, and we provide context on evaluation methodology. Benchmarks are directional indicators — always consider them alongside real-world usage and community feedback.
</details>

<details>
<summary><strong>What file formats are supported?</strong></summary>

We primarily recommend GGUF for local inference due to its broad compatibility with tools like llama.cpp, Ollama, and LM Studio. We also list models in SafeTensors, PyTorch, and ONNX formats. Each model page shows all available formats and quantizations with file sizes.
</details>

<details>
<summary><strong>What is quantization?</strong></summary>

Quantization reduces the precision of a model's weights to decrease file size and memory requirements, enabling powerful models to run on consumer hardware. For example, a 70B model that requires ~140 GB in FP16 can be reduced to ~35 GB with Q4_K_M quantization with minimal quality loss. See our [Models Guide](/docs/models-guide) for a detailed explanation.
</details>

### Account

<details>
<summary><strong>How do I reset my password?</strong></summary>

Go to the login page and click "Forgot Password?". Enter your email address, and we'll send you a reset link within a few minutes (valid for 24 hours). For OAuth accounts (Google, GitHub, Discord), password management is handled through those providers.
</details>

<details>
<summary><strong>What is the difference between Free and Pro?</strong></summary>

Free provides full access to browsing, comparing, reading reviews, and educational content. Pro adds API access, advanced benchmark analytics, custom watchlist alerts, priority model verification, early access to beta features, and no rate limits. Pro is designed for teams and power users; most individuals find Free sufficient.
</details>

<details>
<summary><strong>How do I delete my account?</strong></summary>

Go to Account Settings → Danger Zone → Delete Account. Confirm by entering your password. All your data is removed within 30 days. We recommend exporting your data first using the Data Export tool in Account Settings.
</details>

<details>
<summary><strong>What are API keys for?</strong></summary>

API keys allow Pro subscribers to access LLM Trust programmatically. You can query our model database, retrieve specifications, pull benchmark data, and integrate LLM Trust into your own applications and workflows. Generate keys from Account Settings → API Keys.
</details>

### Troubleshooting

<details>
<summary><strong>Model won't download</strong></summary>

Check your internet connection stability — large model files require a stable connection. The hosting platform (usually HuggingFace) may be experiencing high traffic; wait a few minutes and retry. If the download link appears broken, report it using the "Report Issue" button on the model page.
</details>

<details>
<summary><strong>Search not returning expected results</strong></summary>

Try simplifying your query — use single keywords instead of phrases. Remove filters to broaden results. Clear your browser cache if the interface behaves strangely. Some ad blockers can interfere with our search API; try disabling them temporarily.
</details>

<details>
<summary><strong>I found incorrect information</strong></summary>

We take accuracy seriously. Use the "Suggest Correction" button on the relevant model page and provide details about what's incorrect with a link to the authoritative source. Our team reviews corrections within 48 hours. You can also email us at support@llmtrust.com for urgent issues.
</details>

<details>
<summary><strong>How to report a bug</strong></summary>

Use the "Feedback" button in the site footer, or open an issue on our GitHub repository. Include your browser/OS version, screenshots, and steps to reproduce. Critical issues (security, data loss, accessibility) receive priority treatment.
</details>

---

## Getting Help

Still have questions? We're here to help.

- **Email:** [support@llmtrust.com](mailto:support@llmtrust.com)
- **Response time:** Within 24 hours (Pro: priority response)
- **Feedback:** Use the "Feedback" button in the site footer
- **Community:** Join discussions on model pages

---

## Resources

- [Getting Started](/docs/getting-started) — Platform overview and quick start
- [Models Guide](/docs/models-guide) — Specs, formats, and quantization
- [Browse Models](/models) — Explore 200+ open-source LLMs
- [Pricing](/pricing) — Free vs Pro details
- [Blog](/blog) — Latest news and technical guides

---

*Last updated: March 2026*
