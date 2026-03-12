# LLM Trust — Feedback Strategy

> Last updated: 2026-03-12

## Table of Contents

- [In-App Feedback Strategy](#in-app-feedback-strategy)
- [NPS Survey](#nps-survey)
- [User Interview Script](#user-interview-script)
- [Analytics Events](#analytics-events)
- [Feedback Loop Cadence](#feedback-loop-cadence)

---

## In-App Feedback Strategy

### Feedback Widget

**Placement:** Bottom-right corner, persistent across all pages (except auth pages).

**Trigger:** Always visible but non-intrusive (small icon, expands on click).

**Form fields:**
- Feedback type (dropdown): 🐛 Bug, 💡 Feature Request, 💬 General Feedback, 😕 Confused
- Message (text area, required)
- Screenshot (optional, auto-capture current page)
- Email (pre-filled if logged in, optional if anonymous)

**Implementation notes:**
- Use a lightweight component (e.g., Userback, or custom with PostHog)
- Submit event fires to both analytics and support queue
- Thank-you message after submission: "Thanks! We read every message."

### Contextual Feedback Prompts

Show targeted micro-surveys at specific moments:

| Moment | Prompt | Trigger |
|---|---|---|
| After first model save | "How easy was it to find what you were looking for?" (1-5) | User saves first model |
| After first review | "Was writing this review straightforward?" (👍/👎) | User submits first review |
| After first download | "Did you successfully run the model locally?" (Yes / Need help) | User clicks download link |
| After model submission | "How was the submission process?" (1-5) | User submits a model |
| After 5 model views (no save) | "Having trouble finding the right model? [Tell us why]" | 5 detail page views, 0 saves |

### Passive Feedback Signals

Track behavioral signals without explicit user input:
- **Rage clicks** — rapid repeated clicks (indicates frustration)
- **Dead clicks** — clicks on non-interactive elements (UI confusion)
- **Scroll depth** on model pages (engagement indicator)
- **Search refinements** — multiple searches in short succession (can't find what they need)
- **Filter reset frequency** — resetting filters often (poor initial results)
- **Time on page** — abnormally short on detail pages (didn't find what they expected)

Route these signals to PostHog as events for aggregate analysis.

---

## NPS Survey

### When to Send

| Trigger | Timing | Channel |
|---|---|---|
| 14 days after sign-up | First NPS | In-app modal |
| 90 days after last NPS | Recurring | In-app modal |
| After 10th model view | Power user | In-app modal |
| Post major feature launch | Targeted | In-app modal |

### Survey Design

**Question:** "How likely are you to recommend LLM Trust to a fellow developer?"

**Scale:** 0-10 (standard NPS)

- **0-6 (Detractors):** Follow-up → "What could we do better?" (open text)
- **7-8 (Passive):** Follow-up → "What would make LLM Trust a 9 or 10?" (open text)
- **9-10 (Promoters):** Follow-up → "What do you love most about LLM Trust?" (open text) + CTA to share on Twitter/HN

**Dismiss:** Easy to close. Don't show again for 30 days if dismissed.

### NPS Calculation

```
NPS = % Promoters (9-10) - % Detractors (0-6)
```

**Targets:**
- Baseline: establish in Month 1
- Month 3: 40+
- Month 6: 50+
- Month 12: 60+

### Closing the Loop with Detractors

Every detractor (0-6) gets a personal follow-up within 48 hours:

> Hi {{name}},
>
> Thanks for taking the time to share your feedback. I saw you scored us {{score}}/10, and I'd love to understand what we can improve.
>
> Would you be open to a 15-minute call this week? Your input directly shapes our roadmap.
>
> Either way, I've shared your feedback with the team.
>
> — {{agent_name}}, Head of Customer Success

---

## User Interview Script

### Recruitment

**Who to interview:**
- Activated users (saved models, left reviews, or submitted)
- Recently churned users (signed up but inactive for 30+ days)
- Detractors from NPS surveys
- Power users (10+ model views, multiple reviews)

**Outreach template:**

> Subject: Quick chat about LLM Trust? (15 min, $25 gift card)
>
> Hi {{name}},
>
> I'm {{agent_name}} from LLM Trust. I'm talking to users to understand how we can make the platform better.
>
> Would you be open to a 15-minute video call this week? As a thank-you, I'll send you a $25 gift card (or donate $25 to an open-source project of your choice).
>
> No prep needed — just your honest feedback.
>
> [Pick a time → {{calendly_link}}]
>
> Thanks!
> {{agent_name}}

**Goal:** 5-8 interviews per month.

### Interview Script (15 min)

**Intro (1 min)**
> Thanks for taking the time! I'm {{name}} from LLM Trust. This isn't a sales call — I genuinely want to understand your experience so we can make the platform better.
>
> Mind if I record this? It's just for internal reference, won't be shared publicly.

**Background (2 min)**
1. What's your role? (developer, ML engineer, researcher, etc.)
2. How did you first hear about LLM Trust?
3. What were you looking for when you found us?

**Discovery & Usage (5 min)**
4. Walk me through the last time you used LLM Trust. What were you trying to do?
5. How did you find the model you were looking for? (search, browse, filter, external link)
6. What information on the model page was most useful? What was missing?
7. Did you download or run a model? How did that go?

**Pain Points (4 min)**
8. What's the most frustrating part of using LLM Trust?
9. Is there anything you expected to find but couldn't?
10. Have you used similar platforms? (HuggingFace, Ollama library, etc.) How do we compare?
11. If you could change one thing, what would it be?

**Closing (3 min)**
12. On a scale of 1-10, how likely are you to recommend LLM Trust to a colleague?
13. Anything else you'd like to share?
14. Would you be open to trying a new feature we're working on? (beta access)

**End:**
> This was incredibly helpful. I'll send that gift card within 24 hours. If you ever have feedback, you can reach me directly at {{email}}.

### Post-Interview Process

1. **Within 1 hour:** Write up key quotes and insights in Notion
2. **Tag themes:** Discovery, Model Info, Downloads, Reviews, Performance, Missing Feature, etc.
3. **Weekly:** Synthesize interviews into a summary for the product team
4. **Monthly:** Identify top 3 recurring themes → add to roadmap discussion

---

## Analytics Events

### Core Events to Track

#### Discovery Events

| Event Name | Properties | When |
|---|---|---|
| `page_view` | `path`, `referrer` | Every page load |
| `model_card_clicked` | `model_slug`, `position`, `source` (catalog, search, recommendation) | Click on model card |
| `search_performed` | `query`, `results_count` | Search submitted |
| `filter_applied` | `filter_type`, `filter_value`, `results_count` | Filter chip added |
| `filter_removed` | `filter_type`, `filter_value` | Filter chip removed |
| `filter_reset` | `filters_active_count` | All filters cleared |
| `category_clicked` | `category_name` | Homepage category card |

#### Engagement Events

| Event Name | Properties | When |
|---|---|---|
| `model_detail_viewed` | `model_slug`, `source` | Model detail page open |
| `model_saved` | `model_slug` | Star/save clicked |
| `model_unsaved` | `model_slug` | Star/save removed |
| `review_started` | `model_slug` | Review form opened |
| `review_submitted` | `model_slug`, `rating` | Review submitted |
| `model_submitted` | `model_name`, `category` | New model submission |
| `download_clicked` | `model_slug`, `source` | HuggingFace link clicked |
| `cli_install_clicked` | `source` | CLI install CTA clicked |
| `compare_started` | `model_slugs` | Compare mode activated |
| `compare_viewed` | `model_slugs` | Comparison page viewed |

#### Auth Events

| Event Name | Properties | When |
|---|---|---|
| `sign_up_started` | `method` (email, oauth) | Sign-up form opened |
| `sign_up_completed` | `method` | Account created |
| `sign_in_completed` | `method` | Successful sign-in |
| `sign_out` | — | User signed out |

#### Feedback Events

| Event Name | Properties | When |
|---|---|---|
| `feedback_widget_opened` | `page` | Feedback icon clicked |
| `feedback_submitted` | `type`, `has_screenshot` | Feedback form sent |
| `nps_survey_shown` | `trigger` | NPS modal displayed |
| `nps_submitted` | `score`, `segment` (promoter/passive/detractor) | NPS score given |
| `contextual_survey_responded` | `prompt_id`, `response` | Micro-survey answered |

#### Retention Events

| Event Name | Properties | When |
|---|---|---|
| `dashboard_viewed` | `saved_count`, `days_since_signup` | Dashboard page open |
| `return_visit` | `days_since_last_visit` | User returns after >24h |
| `onboarding_checklist_item_completed` | `item`, `items_remaining` | Checklist checkbox checked |

### Key Metrics Derived from Events

| Metric | Calculation |
|---|---|
| **Activation rate** | % of sign-ups who save a model OR leave a review within 7 days |
| **Discovery rate** | Avg models viewed per session |
| **Search success rate** | % of searches followed by a model detail view |
| **Review conversion** | % of model detail viewers who submit a review |
| **Download rate** | % of model detail viewers who click download |
| **Return rate** | % of users who return within 7 days |
| **Time to activation** | Median time from sign-up to first save/review |

### Tooling

- **PostHog** — primary analytics (events, funnels, cohorts, session replay)
- **Resend / SendGrid** — email delivery and open/click tracking
- **Vercel Analytics** — web vitals and page performance

---

## Feedback Loop Cadence

| Activity | Frequency | Owner |
|---|---|---|
| Review support tickets for patterns | Daily | Support |
| Check NPS responses | Daily | Customer Success |
| Synthesize in-app feedback | Weekly | Customer Success |
| Review analytics dashboards | Weekly | Product + CS |
| Conduct user interviews | 2-4/month | Customer Success |
| Product sync on feedback themes | Weekly | Product + CS + Eng |
| NPS report + trends | Monthly | Customer Success |
| Public roadmap update | Monthly | Product |
| Quarterly feedback retrospective | Quarterly | All teams |

### Feedback → Action Loop

```
Collect (support, NPS, interviews, analytics)
    ↓
Synthesize (weekly themes, monthly trends)
    ↓
Prioritize (product sync, impact vs. effort)
    ↓
Act (build, fix, communicate)
    ↓
Close the loop (notify users, update changelog)
    ↓
Measure (did the change move the metric?)
```

---

*See also: [USER-GUIDE.md](./USER-GUIDE.md) · [ONBOARDING.md](./ONBOARDING.md) · [SUPPORT.md](./SUPPORT.md)*
