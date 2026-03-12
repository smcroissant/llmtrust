# LLM Trust — Onboarding Strategy

> Last updated: 2026-03-12

## Table of Contents

- [Visitor Journey](#visitor-journey)
- [New User Journey (Post Sign-Up)](#new-user-journey-post-sign-up)
- [Welcome Email Template](#welcome-email-template)
- [First Dashboard Experience](#first-dashboard-experience)
- [Progressive Disclosure](#progressive-disclosure)
- [Key Metrics to Track](#key-metrics-to-track)

---

## Visitor Journey

**Goal:** Turn curious visitors into signed-up users by demonstrating value immediately.

### Stage 1: Landing (0-10s)

**Homepage elements that convert:**
- Hero section: clear value proposition — *"Discover & Run Open-Source LLMs Locally"*
- Stats bar: **200+ models, 500K+ downloads, 15+ architectures** — social proof
- Featured models: show 3-4 popular models immediately (Qwen, DeepSeek, etc.)
- CTA: **"Explore Models"** (primary) + **"Sign Up Free"** (secondary)

**Key principle:** Let them browse freely. No sign-up wall.

### Stage 2: Exploration (10s - 2min)

**Discovery touchpoints:**
- Browse by Category — quick access to use-case clusters
- Latest Additions — shows the platform is alive and growing
- Full catalog with filters — depth for power users

**Exit intent:** If they show interest (click a model, scroll deep), trigger a subtle prompt:
> "Sign up to save models, leave reviews, and get personalized recommendations."

### Stage 3: Value Demonstration (2-5min)

**Model Detail Page** is the conversion workhorse:
- Show complete specs, benchmarks, reviews
- Provide the download link immediately (no paywall)
- Show the one-command CLI run
- Prompt: *"Want to leave a review? Create a free account."*

### Stage 4: Sign-Up Trigger

**Low-friction triggers:**
- Click "Write a Review" → sign-up modal
- Click "Submit a Model" → sign-up modal
- Click "Save to Dashboard" → sign-up modal
- After 3+ model views → gentle banner: *"Create an account to save your favorites"*

**Sign-up form:** Email + password only (or OAuth). No credit card. No phone number.

### Conversion Funnel Targets

| Stage | Target Rate |
|---|---|
| Landing → Browse | 70%+ |
| Browse → Model Detail | 40%+ |
| Model Detail → Sign-Up Intent | 15%+ |
| Sign-Up Intent → Completed | 80%+ |

---

## New User Journey (Post Sign-Up)

**Goal:** Get the user to their "aha moment" within the first session (< 3 minutes).

### Immediate (0-30s)

1. **Redirect to dashboard** with a welcome banner
2. **Show onboarding checklist** (3 items max):
   - [ ] Browse a model you're interested in
   - [ ] Save a model to your dashboard
   - [ ] Leave your first review
3. **Pre-populate recommendations** based on sign-up intent (if captured)

### First Session (30s - 3min)

**Guide the user through core actions:**

1. **Prompt to explore:** "What are you looking for?" → quick filter selection
   - Chat / Code / Vision / Embedding / Other
2. **Show a curated list** based on their selection
3. **Encourage a save:** "Click the ⭐ to save models to your dashboard"
4. **Encourage a review:** "Used a model before? Share your experience and help the community"

### First Return Visit (Day 2-7)

- **Email nudge** if they haven't completed onboarding checklist
- **Dashboard** shows saved models + "Models you might like" section
- **Notification** when a saved model gets a new review or update

### Activation Definition

A user is **activated** when they complete ≥ 2 of:
- Saved at least 1 model
- Left at least 1 review
- Submitted a model
- Used the CLI to download a model

**Target:** 40% activation within 7 days of sign-up.

---

## Welcome Email Template

**Subject:** Welcome to LLM Trust — let's find your next model 🚀

---

**Body:**

> Hi {{first_name}},
>
> Welcome to LLM Trust! You've joined {{user_count}}+ developers discovering and running open-source AI models locally.
>
> **Here's what you can do right now:**
>
> 🔍 **Explore 200+ models** — Browse by category, architecture, or size
> ⭐ **Save your favorites** — Build your personal model library
> 📝 **Share your experience** — Leave reviews to help the community
> 🚀 **Run models locally** — One CLI command, zero cloud dependency
>
> **Get started:**
> 👉 [Browse Models](https://www.llmtrust.com/models)
> 👉 [View Your Dashboard](https://www.llmtrust.com/dashboard)
>
> **Popular this week:**
> - Qwen 2.5 72B — Top-rated for general tasks
> - DeepSeek Coder V2 — Best open-source code model
> - Llama 3.1 405B — Meta's flagship
>
> Questions? Just reply to this email — I read every one.
>
> Happy discovering,
> The LLM Trust Team
>
> ---
> [Unsubscribe](https://www.llmtrust.com/unsubscribe) · [Privacy Policy](https://www.llmtrust.com/privacy)

---

**Technical notes:**
- Send via Resend / SendGrid / Postmark
- Trigger: user.created event
- Delay: immediate (< 5 min after sign-up)
- Track: open rate, CTR to models page, CTR to dashboard

---

## First Dashboard Experience

### What to Show

**Welcome section (top, dismissible):**
- Greeting: "Welcome, {{name}} 👋"
- Onboarding checklist (3 items, see above)
- Quick links: Browse Models | Submit a Model | Install CLI

**Main content:**

1. **Saved Models** (empty state → prompt to browse)
   - Empty state message: "You haven't saved any models yet. [Browse models →]"
   - Once populated: show model cards with last-updated timestamps

2. **Recommended For You** (based on browsing history or stated interest)
   - "Based on your interest in {{category}}, you might like:"

3. **Community Activity** (social proof)
   - "3 new reviews this week on models you saved"
   - "New model added: {{model_name}}"

4. **Quick Stats** (gamification)
   - Models saved: 0
   - Reviews written: 0
   - Models submitted: 0

### What NOT to Show (Yet)

Don't overwhelm on first visit. Hide these until the user is activated:
- API access settings
- CLI configuration
- Advanced profile settings
- Team/org features

---

## Progressive Disclosure

### Disclosure Layers

**Layer 1 — Visitor (no account):**
- Browse models, search, filter
- View model details, specs, benchmarks
- Read reviews
- Download models (HuggingFace link)
- Install CLI

**Layer 2 — Signed-up user:**
- Save models to dashboard
- Write and edit reviews
- Submit models for listing
- Edit profile

**Layer 3 — Active user (3+ reviews or 1+ submission):**
- "Trusted Reviewer" badge
- Review helpfulness voting
- Suggest edits to model listings
- Priority support channel

**Layer 4 — Power user / Contributor:**
- Model curator role (moderate submissions)
- Access to beta features
- Direct line to team (Slack/Discord)
- Early access to new features

### Triggering Layer Transitions

| From → To | Trigger | Prompt |
|---|---|---|
| Visitor → User | Sign-up | Welcome email + dashboard |
| User → Active | 3 reviews OR 1 submission | Badge notification + email |
| Active → Power | Consistent contributions over 30+ days | Direct invitation |

---

## Key Metrics to Track

| Metric | Target | Tool |
|---|---|---|
| Visitor → Sign-Up rate | 8-12% | PostHog / Mixpanel |
| Sign-Up → Activation (7d) | 40% | PostHog |
| Welcome email open rate | 50%+ | Resend / SendGrid |
| Welcome email CTR | 20%+ | Resend / SendGrid |
| Time to first save | < 3 min | PostHog |
| Day 7 retention | 30%+ | PostHog |
| Day 30 retention | 15%+ | PostHog |
| Reviews per active user | 2+ / month | Database |
| NPS (30 days post-signup) | 50+ | Survey |

---

*See also: [USER-GUIDE.md](./USER-GUIDE.md) · [SUPPORT.md](./SUPPORT.md) · [FEEDBACK.md](./FEEDBACK.md)*
