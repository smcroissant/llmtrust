# LLM Trust — Gamification System

_Head of Customer Success: Aura_
_Last updated: 2026-03-12_

---

## 1. Badge System

### Overview

Badges reward contributors for milestones and encourage continued engagement. Each badge belongs to a **category** and a **tier** (Bronze → Silver → Gold → Platinum).

### Badge Catalog

#### 📝 Review Badges

| Badge | Icon | Tier | Points | Criteria |
|-------|------|------|--------|----------|
| First Impression | 💬 | Bronze | 10 | Write your first review |
| Thoughtful Reviewer | 📝 | Silver | 25 | Write 10 reviews |
| Critic Elite | 🏆 | Gold | 50 | Write 50 reviews |
| Review Master | ⭐ | Platinum | 100 | Write 200 reviews |

#### 📤 Upload Badges

| Badge | Icon | Tier | Points | Criteria |
|-------|------|------|--------|----------|
| Model Pioneer | 🚀 | Bronze | 20 | Upload your first model |
| Growing Library | 📚 | Silver | 40 | Upload 5 models |
| Model Architect | 🏗️ | Gold | 75 | Upload 25 models |
| Library Baron | 👑 | Platinum | 150 | Upload 100 models |

#### 📥 Download Badges (earned by the model uploader)

| Badge | Icon | Tier | Points | Criteria |
|-------|------|------|--------|----------|
| First Download | 📥 | Bronze | 5 | Your model gets its first download |
| Rising Star | 🌟 | Silver | 20 | 100 total downloads across your models |
| Community Favorite | ❤️ | Gold | 50 | 1,000 total downloads |
| Viral Hit | 🔥 | Platinum | 100 | 10,000 total downloads |

#### 🌟 Community Badges

| Badge | Icon | Tier | Points | Criteria |
|-------|------|------|--------|----------|
| Welcome Aboard | 👋 | Bronze | 5 | Complete profile setup |
| Conversation Starter | 💡 | Silver | 15 | Get 10 likes on your reviews |
| Trusted Voice | 🎯 | Gold | 40 | Get 100 likes across your content |
| Community Pillar | 🏛️ | Platinum | 100 | Get 500 likes across your content |

#### 🔥 Streak Badges

| Badge | Icon | Tier | Points | Criteria |
|-------|------|------|--------|----------|
| Consistent | 🔁 | Bronze | 10 | 7-day activity streak |
| Dedicated | ⚡ | Silver | 25 | 30-day activity streak |
| Relentless | 💪 | Gold | 50 | 90-day activity streak |
| Unstoppable | 🔥 | Platinum | 100 | 365-day activity streak |

### Display in Profile

- Badges shown in a grid on `/profile/[username]`
- Each badge shows icon, name, and hover tooltip with description
- Badges sorted by tier (Platinum first) then by date earned
- "New" badges highlighted with a glow animation for 48h
- Summary row: "🏆 12 Badges · ⭐ Gold Reviewer"

### Database Schema

Tables added to `src/server/db/schema.ts`:

- **`badge`** — Badge definitions (slug, name, icon, category, tier, points, criteria)
- **`user_badge`** — User ↔ Badge join table with award timestamp
- **`user_stats`** — Aggregated user stats (counts, points, level, streak, ambassador flag)
- **`points_ledger`** — Transaction log for point changes

---

## 2. Contributor Levels

### Level Tiers

| Level | Icon | Min Points | Requirements | Benefits |
|-------|------|-----------|--------------|----------|
| **Newcomer** | 🌱 | 0 | Sign up, complete profile | Basic access, browse & download |
| **Contributor** | 🌿 | 100 | 5+ reviews OR 2+ uploads | Verified badge on profile, priority in search results |
| **Expert** | 🌳 | 500 | 25+ reviews OR 10+ uploads, 500+ total downloads | "Expert" flair, early access to new features, ability to flag/report issues with priority |
| **Master** | 🏔️ | 2,000 | 100+ reviews OR 50+ uploads, 5,000+ total downloads, 30+ day streak | "Master" flair, featured contributor spotlight, direct line to product team, exclusive Discord/channel, voting power on feature requests |

### Level Display

- **Badge next to username** everywhere: reviews, comments, leaderboard
- **Level progress bar** on profile: "Expert — 680/2,000 pts to Master"
- **Level-up celebration**: In-app confetti animation + notification + optional email
- Levels are recalculated on every points transaction

### Points System

| Action | Points |
|--------|--------|
| Write a review | 10 |
| Publish a model | 25 |
| Model downloaded (to uploader) | 2 per download |
| Review gets a like | 2 |
| Complete daily streak (1 activity/day) | 5 |
| Earn a badge | Badge's `pointsReward` value |
| Referral signs up | 15 |
| Profile completed | 10 (one-time) |

Points are **never subtracted** (only added). The `points_ledger` table records every transaction for auditability.

---

## 3. Leaderboard — `/community/leaderboard`

### Tabs

| Tab | Description |
|-----|-------------|
| **All-Time** | Lifetime rankings |
| **Monthly** | Rolling 30-day window |
| **Weekly** | Rolling 7-day window |

### Ranking Categories

1. **🏅 Top Contributors** — By total points
2. **📝 Top Reviewers** — By review count
3. **📤 Top Uploaders** — By upload count
4. **🔥 Most Popular Models** — By total downloads

### UI Specs

- **Top 3 podium** with large avatars, badges, and points
- **Infinite scroll** list (#4–100+)
- **Current user highlight**: If logged-in user is in the list, their row is highlighted
- **Filter by time**: All-time / Monthly / Weekly toggle
- **Caching**: Cache leaderboard queries for 5 minutes (Redis/Upstash)
- **URL**: `/community/leaderboard?tab=reviews&period=monthly`

### Data Source

Queries aggregate from `user_stats` for all-time, and from `points_ledger` (grouped by user, filtered by date range) for weekly/monthly.

---

## 4. Gamification UX

### Notifications of Progress

| Trigger | Type | Message Example |
|---------|------|-----------------|
| Badge earned | In-app + email | "🎉 You earned the 'Thoughtful Reviewer' badge!" |
| Level-up | In-app + email + confetti | "🚀 You've reached Expert level! New perks unlocked." |
| Streak milestone | In-app | "🔥 7-day streak! Keep it up for the Consistent badge." |
| Points milestone | In-app | "⭐ You've hit 500 points! Almost at Expert." |
| New badge available | In-app (nudge) | "Write 3 more reviews to earn 'Critic Elite'" |

### Streaks

- **Definition**: At least 1 qualifying activity per calendar day (review, upload, or like)
- **Grace period**: 1 missed day allowed (streak doesn't break on day 1 of inactivity)
- **Display**: Fire emoji + day count on profile
- **Recovery**: No recovery mechanic — streak resets after grace period
- **Weekly streak bonus**: 5 bonus points for every 7 consecutive days

### Milestone Celebrations

- **In-app**: Confetti animation on level-up and major badge unlocks
- **Email**: Personalized milestone email with stats recap ("This month you wrote 12 reviews!")
- **Social share**: "Share your achievement" button → pre-filled tweet/toot
- **Profile showcase**: Recent milestones shown on profile sidebar

### Progress Nudges

- Progress bars for next badge (e.g., "7/10 reviews for Thoughtful Reviewer")
- "Almost there!" notifications when within 80% of a milestone
- Weekly digest email with progress summary (opt-in)

---

## Technical Notes

- **Recalculation**: `user_stats` is updated via a server action on every qualifying event (not a cron job)
- **Leaderboard caching**: Use Redis/Upstash with 5-min TTL for leaderboard queries
- **Badge checking**: After each points transaction, check if user qualifies for new badges (idempotent — unique constraint on `user_badge`)
- **Migration**: Run `npx drizzle-kit generate` then `npx drizzle-kit migrate` after schema changes
