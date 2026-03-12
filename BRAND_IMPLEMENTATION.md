# LLM Trust — Brand Implementation Summary

> **Art Direction:** Neural Glow
> **Mood:** Deep space observatory meets developer workstation
> **Primary Experience:** Dark mode

---

## What Was Created

### 1. Brand Identity Document
📄 `BRAND_IDENTITY.md` — Complete brand bible with:
- Brand personality & positioning
- Art direction rationale ("Neural Glow")
- Full color palette with OKLCH values
- Typography system (Inter)
- Spacing & layout rules
- Component style specifications
- Micro-interaction definitions
- Do's and Don'ts

### 2. Core Theme (`src/app/globals.css`)
Completely rewired shadcn/ui's CSS variables with:
- **Violet-tinted dark backgrounds** (not pure black — `oklch(0.12 0.01 280)`)
- **Electric Violet primary** (`oklch(0.68 0.24 290)` in dark)
- **Warm Amber accent** (`oklch(0.75 0.16 75)`)
- Custom `--glow`, `--surface`, `--surface-elevated` tokens
- Custom animations: `glow-pulse`, `shimmer`, `fade-up`, `scale-in`
- Grain texture overlay via `body::after`
- Custom scrollbar styling
- Selection color with violet tint
- Utility classes: `.text-gradient-brand`, `.glow-hover`, `.card-glow`, `.link-underline`, `.skeleton-shimmer`, `.stat-number`, `.badge-model`, `.badge-accent`

### 3. New Components

| Component | File | Purpose |
|-----------|------|---------|
| `GlowCard` | `src/components/ui/glow-card.tsx` | Card with glow border on hover |
| `ModelCardEnhanced` | `src/components/models/model-card-enhanced.tsx` | Stylized model card with stagger animation |
| `HeroSection` | `src/components/hero-section.tsx` | Hero with glow orbs, gradient text, animated entrance |
| `StatsBar` | `src/components/stats-bar.tsx` | Stats with gradient numbers |
| `SkeletonGlow` | `src/components/ui/skeleton-glow.tsx` | Loading skeleton with violet shimmer |
| `EmptyState` | `src/components/ui/empty-state.tsx` | Empty states with glow icon |

### 4. Updated Files
- `src/components/providers.tsx` — Added `ThemeProvider` with `defaultTheme="dark"`
- `src/app/page.tsx` — Rewired to use new brand components

### 5. Build Status
✅ TypeScript compiles clean
✅ Next.js build succeeds

---

## Color Palette Quick Reference

### Dark Mode (Primary)

```
Background:    #0D0B14  (oklch(0.12 0.01 280))
Card:          #161224  (oklch(0.16 0.015 280))
Primary:       #8B5CF6  (oklch(0.68 0.24 290))  ← Electric Violet
Accent:        #F59E0B  (oklch(0.75 0.16 75))   ← Warm Amber
Foreground:    #E8E4F0  (oklch(0.93 0.01 280))
Muted:         #6B6580  (oklch(0.55 0.02 280))
Border:        #2D2740  (oklch(0.24 0.02 280))
```

### Brand Gradient
```
Primary → Accent:  #8B5CF6 → #F59E0B  (135deg)
```

---

## Key Design Principles

1. **Violet-tinted darkness** — Never pure black, always with a hint of violet warmth
2. **Selective glow** — Light effects are precise, not overwhelming. Used on interactive elements
3. **Amber contrast** — Warm amber pops against cool violet, drawing attention to key metrics
4. **Generous whitespace** — Let content breathe, don't crowd
5. **Tabular numbers** — Use `tabular-nums` for download counts and stats
6. **Monospace for data** — Technical values use a subtle mono treatment
7. **Staggered animations** — Elements fade up with slight delays for a cascading effect
8. **Grain texture** — Ultra-subtle noise overlay adds depth without distraction

---

## Usage Examples

### Gradient Text
```tsx
<h1 className="text-gradient-brand">Open-Source LLMs</h1>
```

### Glowing Card
```tsx
<GlowCard className="p-5">
  <GlowCardTitle>My Model</GlowCardTitle>
  <GlowCardContent>...</GlowCardContent>
</GlowCard>
```

### Stat Number
```tsx
<p className="stat-number">500K+</p>
<p className="text-sm text-muted-foreground">Downloads</p>
```

### Loading Skeleton
```tsx
<ModelGridSkeleton count={8} />
```

### Empty State
```tsx
<EmptyState variant="no-results" />
```

### Animated Link
```tsx
<a href="#" className="link-underline text-primary">Learn more</a>
```

---

## Dark Mode Is Default

The app launches in dark mode by default via:
- `ThemeProvider` with `defaultTheme="dark"` in `providers.tsx`
- All CSS custom properties defined in `:root` (light) and `.dark` (dark)

Users can toggle to light mode, but the brand identity is optimized for dark.

---

_Crafted by Pulse · Head of Marketing · LLM Trust · 2026_
