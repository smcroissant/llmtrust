# LLM Trust — Support Playbook

> Last updated: 2026-03-12

## Table of Contents

- [Support Channels](#support-channels)
- [Support Process](#support-process)
- [Response SLAs](#response-slas)
- [Common Issues & Response Templates](#common-issues--response-templates)
- [Escalation Path](#escalation-path)
- [Feature Request Process](#feature-request-process)
- [Bug Report Process](#bug-report-process)
- [Internal Tools](#internal-tools)

---

## Support Channels

| Channel | Use Case | Audience |
|---|---|---|
| **Email** (support@llmtrust.com) | All inquiries | Everyone |
| **In-app feedback widget** | Quick feedback, bug reports | Logged-in users |
| **GitHub Issues** | Bug reports, feature requests | Developers |
| **Discord** (when live) | Community support, discussions | Power users |

**Primary channel:** Email. All support flows through support@llmtrust.com for tracking.

---

## Support Process

### Ticket Lifecycle

```
New → Triaged → In Progress → Resolved → Closed
```

1. **New** — Ticket arrives (email, in-app, GitHub)
2. **Triaged** — Categorized and prioritized (within SLA)
3. **In Progress** — Assigned, work started
4. **Resolved** — Solution provided, awaiting user confirmation
5. **Closed** — User confirmed or auto-closed after 7 days

### Triage Categories

| Category | Priority | Response Time |
|---|---|---|
| 🔴 **Critical** — Site down, data issue, security | P0 | < 1 hour |
| 🟠 **High** — Feature broken, can't download, can't sign in | P1 | < 4 hours |
| 🟡 **Medium** — Model listing wrong, review issue, minor bug | P2 | < 24 hours |
| 🟢 **Low** — Feature request, general question, feedback | P3 | < 48 hours |

### First Response Checklist

- [ ] Acknowledge the issue
- [ ] Confirm category and priority
- [ ] Ask for missing info if needed (see templates below)
- [ ] Set expectations on timeline
- [ ] Log in tracking system (Linear / Notion)

---

## Response SLAs

| Priority | First Response | Resolution Target |
|---|---|---|
| P0 | 1 hour | 4 hours |
| P1 | 4 hours | 24 hours |
| P2 | 24 hours | 72 hours |
| P3 | 48 hours | Backlog |

**Business hours:** Mon-Fri 9:00-18:00 CET. P0 handled 24/7.

---

## Common Issues & Response Templates

### 1. "I can't sign in"

**Triage:** P1 (if widespread), P2 (single user)

**Template:**

> Hi {{name}},
>
> Sorry you're having trouble signing in. Let's get this sorted.
>
> A few things to try:
> 1. Make sure you're using the email you signed up with
> 2. Try the "Forgot Password" link on the sign-in page
> 3. Clear your browser cache and cookies for llmtrust.com
> 4. Try a different browser or incognito mode
>
> If none of that works, can you tell me:
> - The email address you're trying to use
> - Any error messages you're seeing
> - Which browser and OS you're on
>
> I'll look into it right away.
>
> Best,
> {{agent_name}}

---

### 2. "The model download link doesn't work"

**Triage:** P1

**Template:**

> Hi {{name}},
>
> Thanks for flagging this. The download links point to HuggingFace, so there are a few possibilities:
>
> 1. The HuggingFace repo may have been moved or made private
> 2. The model might require accepting a license agreement on HuggingFace first
> 3. HuggingFace could be experiencing downtime
>
> Could you share:
> - The model you're trying to download
> - The page URL on LLM Trust
> - Any error message you see when clicking the link
>
> I'll investigate and update the listing if needed.
>
> Cheers,
> {{agent_name}}

---

### 3. "I want to submit a model"

**Triage:** P3 → Redirect to process

**Template:**

> Hi {{name}},
>
> Great — we love community submissions! Here's how:
>
> 1. Sign in to your LLM Trust account (or create one — it's free)
> 2. Go to your Dashboard → "Submit a Model"
> 3. Fill in the model details (name, HuggingFace URL, category, etc.)
> 4. Submit — our team reviews within 48 hours
>
> Make sure the model is publicly available on HuggingFace and includes a valid license.
>
> Let me know if you run into any issues.
>
> Best,
> {{agent_name}}

---

### 4. "I found incorrect info on a model page"

**Triage:** P2

**Template:**

> Hi {{name}},
>
> Thanks for letting us know — accuracy is important to us.
>
> Could you share:
> - The model page URL
> - Which information is incorrect
> - The correct info (with a source if possible)
>
> I'll review and update the listing asap.
>
> Appreciate you helping keep LLM Trust accurate!
>
> {{agent_name}}

---

### 5. "Can you add [feature]?"

**Triage:** P3 → Redirect to feature request process

**Template:**

> Hi {{name}},
>
> Love the suggestion! We're always looking to improve.
>
> I've logged this as a feature request for our product team. Here's what happens next:
>
> 1. We review all requests during our weekly product sync
> 2. Popular requests get prioritized on our roadmap
> 3. We'll let you know if/when it ships
>
> If you want to track it publicly, you can also open an issue on our GitHub: [link]
>
> Thanks for helping us build a better platform!
>
> {{agent_name}}

---

### 6. "I want to delete my account"

**Triage:** P2 — handle with care

**Template:**

> Hi {{name}},
>
> I'm sorry to see you go. Before I proceed, can I ask if there's anything we could have done better? Your feedback helps us improve.
>
> If you'd still like to proceed, I'll delete your account and all associated data within 48 hours. This will:
> - Remove your profile and saved models
> - Anonymize your reviews (they'll stay but won't be linked to your name)
> - Remove your email from our systems
>
> Please confirm you'd like me to proceed.
>
> Best,
> {{agent_name}}

---

## Escalation Path

```
Level 1: Support Agent (email triage)
    ↓ Cannot resolve / P0-P1
Level 2: Team Lead (technical issue, policy decision)
    ↓ Requires engineering / security
Level 3: Engineering / Founders (code fix, security incident, legal)
```

### Escalation Triggers

| Situation | Escalate To | How |
|---|---|---|
| Security vulnerability reported | Founders + Engineering | Slack DM immediately |
| Site outage / data loss | Engineering | PagerDuty / Slack #incidents |
| Legal / DMCA / license dispute | Founders | Email + Slack DM |
| Abusive user / content moderation | Team Lead | Slack #support |
| User threatening to leave (high-value) | Team Lead | Slack #support |
| Bug confirmed in production | Engineering | Linear ticket + Slack #engineering |

### Escalation Template (Internal)

> **Escalation from L1 Support**
> - Ticket: {{ticket_id}}
> - User: {{email}}
> - Issue: {{summary}}
> - Priority: {{P0-P3}}
> - Why escalating: {{reason}}
> - What I've tried: {{actions_taken}}

---

## Feature Request Process

### Collection

Feature requests come from:
- Support emails
- In-app feedback widget
- GitHub Issues (tag: `enhancement`)
- Discord (tagged in #feature-requests)
- User interviews

### Triage

1. **Log** in feature request tracker (Notion board or Linear)
2. **Tag** with category: Discovery, Reviews, CLI, Dashboard, API, Other
3. **Deduplicate** — check if similar request exists, merge if so
4. **Add vote count** — increment if recurring

### Review Cadence

- **Weekly:** Review new requests, update vote counts
- **Monthly:** Product sync — decide what moves to roadmap
- **Quarterly:** Share public roadmap update with community

### Status Labels

| Status | Meaning |
|---|---|
| `logged` | Received, not yet reviewed |
| `under-review` | Being evaluated by product team |
| `planned` | Accepted, added to roadmap |
| `in-progress` | Engineering is working on it |
| `shipped` | Released! Notify requesters |
| `declined` | Not aligned with vision — explain why |

### Closing the Loop

When a feature ships:
1. Update the feature request status to `shipped`
2. Email all users who requested it
3. Post in Discord / changelog
4. Tag on GitHub if applicable

---

## Bug Report Process

### What to Collect

- **Description:** What happened vs. what was expected
- **Steps to reproduce:** Exact steps to trigger the bug
- **Environment:** Browser, OS, device
- **Screenshots / recordings:** If applicable
- **User email:** For follow-up

### Severity Levels

| Level | Description | Example |
|---|---|---|
| S1 — Critical | Data loss, security, full outage | Site down, auth bypass |
| S2 — Major | Major feature broken | Can't download, search broken |
| S3 — Minor | Cosmetic, edge case | Misaligned button, typo |
| S4 — Enhancement | Works but could be better | Slow page load |

### Internal Bug Report Template

> **Bug Report**
> - Title: {{short_description}}
> - Severity: {{S1-S4}}
> - Reported by: {{user_email or "internal"}}
> - Environment: {{browser/OS}}
> - Steps to reproduce:
>   1. {{step_1}}
>   2. {{step_2}}
> - Expected: {{expected_behavior}}
> - Actual: {{actual_behavior}}
> - Screenshot: {{url_or_attached}}

---

## Internal Tools

| Tool | Purpose |
|---|---|
| **Email** (support@llmtrust.com) | Incoming support queue |
| **Linear** | Bug tracking, feature requests, sprint planning |
| **Notion** | Knowledge base, runbooks, escalation docs |
| **PostHog** | User analytics, session replay for debugging |
| **Slack** | Internal communication, #support #engineering #incidents |
| **GitHub** | Public bug reports, feature requests |

---

*See also: [USER-GUIDE.md](./USER-GUIDE.md) · [ONBOARDING.md](./ONBOARDING.md) · [FEEDBACK.md](./FEEDBACK.md)*
