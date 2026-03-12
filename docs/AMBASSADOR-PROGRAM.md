# LLM Trust — Ambassador Program

_Head of Customer Success: Aura_
_Last updated: 2026-03-12_

---

## 1. Program Overview

The **LLM Trust Ambassador Program** identifies and empowers our most passionate community members. Ambassadors are trusted voices who shape the platform, provide critical feedback, and help grow the ecosystem.

**Goal**: Recruit 25 ambassadors in the first 6 months, scaling to 100 by end of year one.

---

## 2. Ambassador Criteria

### Requirements (must meet ALL)

| Requirement | Threshold |
|-------------|-----------|
| Contributor Level | **Expert** or higher (500+ points) |
| Account age | 30+ days |
| Reviews written | 15+ |
| Models uploaded | 3+ (OR 500+ downloads on their models) |
| Community standing | No moderation strikes |
| Profile completeness | 100% (bio, avatar, links) |

### Qualities We Look For

- **Quality over quantity**: Well-written, helpful reviews
- **Constructive engagement**: Positive presence in comments/community
- **Domain expertise**: Deep knowledge in at least one model category
- **Communication skills**: Can articulate feedback clearly
- **Passion**: Genuine excitement about open-source AI models

### Application Process

1. **Self-nomination**: Button on profile when criteria are met → `/community/ambassador/apply`
2. **Application form**:
   - Why do you want to be an ambassador? (200-500 words)
   - What's your area of expertise?
   - Links to your best reviews/models
   - How would you help grow the community?
3. **Review**: Aura (CS team) reviews within 5 business days
4. **Decision**: Accept / Request more info / Decline with feedback
5. **Onboarding**: Welcome email + private channel invite + onboarding call (optional)

---

## 3. Ambassador Benefits

### Immediate Perks

| Benefit | Description |
|---------|-------------|
| 🏅 **Ambassador Badge** | Exclusive badge on profile — visible everywhere |
| ⭐ **Ambassador Flair** | Special name styling in reviews and comments |
| 🔓 **Early Access** | New features 2 weeks before public launch |
| 📊 **Analytics Dashboard** | Extended stats on their models and reviews |
| 🎯 **Priority Support** | Direct line to CS team (dedicated Discord channel or Slack) |

### Ongoing Perks

| Benefit | Description |
|---------|-------------|
| 🎙️ **Feedback Sessions** | Monthly 30-min call with product team |
| 🎁 **Swag** | LLM Trust merch (stickers, t-shirt, hoodie) after 3 months |
| 🏷️ **Profile Spotlight** | Featured on homepage "Ambassador Spotlight" rotation |
| 📝 **Blog Co-authoring** | Opportunity to co-write official blog posts |
| 🎓 **Beta Testing** | Access to beta features and tools |
| 💬 **Private Channel** | Exclusive Discord/Slack channel for ambassadors |

### Growth Perks

| Benefit | Description |
|---------|-------------|
| 🎤 **Conference Tickets** | Sponsorship for relevant AI/ML conferences (top ambassadors) |
| 💰 **Referral Bonus** | Commission on enterprise plans from their referrals |
| ✍️ **Guest Posts** | Published on LLM Trust blog with backlinks |
| 🤝 **Networking** | Introductions to industry contacts |

---

## 4. Ambassador Responsibilities

### Expected Activities

- **2+ reviews per month** (high quality, detailed)
- **Participate in monthly feedback session** (async or live)
- **Test new features** and provide structured feedback
- **Welcome new users** in community channels
- **Report bugs** with detailed reproduction steps

### Code of Conduct

- Represent LLM Trust positively in external communities
- Disclose ambassador status when promoting LLM Trust
- Maintain quality standards — no spam, no low-effort content
- Respect NDA on unreleased features
- 6-month commitment minimum

### Performance Review

- **Quarterly check-in**: Review activity and impact
- **Inactivity policy**: 60 days of inactivity → pause benefits, 90 days → step down
- **Voluntary exit**: No hard feelings, alumni status retained

---

## 5. Recruiting the First 25 Ambassadors

### Phase 1: Seed (Weeks 1-4)

1. **Identify top users** from current leaderboard — manual outreach via email
2. **Personal invitation** from Aura: "We've noticed your contributions..."
3. **Leverage existing power users**: Anyone with 10+ reviews or 5+ uploads gets a personal DM
4. **Goal**: 10 founding ambassadors

### Phase 2: Open Applications (Weeks 5-8)

1. **Announce program** on homepage banner + blog post + social media
2. **Application page** live at `/community/ambassador`
3. **Promote via email newsletter** to all users
4. **Goal**: 10 more ambassadors from applications

### Phase 3: Referral & Growth (Weeks 9-12)

1. **Ambassador referral program**: Each ambassador can nominate 1 candidate
2. **Community nominations**: Users can nominate others
3. **Targeted outreach** to power users in specific domains (code models, vision models, etc.)
4. **Goal**: 5 more ambassadors, total 25

### Outreach Templates

#### Personal Invitation (Email)

```
Subject: You're invited to join the LLM Trust Ambassador Program 🌟

Hi [Name],

I'm [Aura], Head of Customer Success at LLM Trust. I've been following your
contributions — your [specific review/model] really stood out.

We're launching an Ambassador Program to recognize and empower community
members like you. As an ambassador, you'd get:

• Early access to new features
• Direct line to our product team
• Exclusive ambassador badge
• LLM Trust swag

Would you be interested in learning more? I'd love to hop on a quick call
or answer any questions over email.

Best,
Aura
Head of Customer Success, LLM Trust
```

---

## 6. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Active ambassadors | 25 |
| Ambassador-generated reviews | 100+ |
| Ambassador model uploads | 20+ |
| Feedback session attendance | 80%+ |
| Ambassador NPS | 60+ |
| Referral signups from ambassadors | 50+ |
| Ambassador retention rate | 85%+ |

---

## 7. Technical Implementation

### Schema

The `user_stats` table already has `is_ambassador` and `ambassador_since` fields.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ambassador/apply` | POST | Submit application |
| `/api/ambassador/status` | GET | Check own ambassador status |
| `/api/ambassador/list` | GET | List all ambassadors (public) |

### Admin Panel

- `/admin/ambassadors` — Review applications, approve/revoke, view stats

---

## 8. Future Expansion

- **Regional Ambassadors**: Country/region-specific ambassadors for i18n
- **Domain Ambassadors**: Specialist ambassadors for code, vision, audio models
- **Ambassador Tiers**: Bronze/Silver/Gold ambassador levels with escalating perks
- **Ambassador Events**: Annual summit or virtual meetup
- **Ambassador Advisory Board**: Top ambassadors vote on product roadmap features

---

_"Our ambassadors are the bridge between our team and our community. They don't just use LLM Trust — they shape it." — Aura_
