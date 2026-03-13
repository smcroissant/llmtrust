# LLM Trust — 404 Page Design

## Concept

A playful, developer-friendly 404 page that turns a dead end into a discovery moment. Theme: "This model doesn't exist... yet." — plays on the AI/LLM domain while being genuinely helpful.

---

## Visual Design

### Layout
- Full viewport height (100vh)
- Centered content with generous whitespace
- Dark theme (#0f0f0f background) matching the main site
- Subtle animated gradient orb in the background for visual interest

### Typography
- Large display number: `404` in an oversized monospace font (e.g., JetBrains Mono, 160px)
- The zeros are replaced with CSS-animated "loading" spinners that never resolve — a fun Easter egg
- Body text in the standard site font stack

### Color Palette
| Element | Color |
|---------|-------|
| Background | `#0f0f0f` |
| Card background | `#1a1a1a` |
| Accent (primary) | `#6366f1` (Indigo) |
| Accent (secondary) | `#10b981` (Green) |
| Text (primary) | `#ffffff` |
| Text (secondary) | `#b0b0b0` |
| Text (muted) | `#666666` |

---

## Content Structure

### Hero Section

```
[pulsing animation]

404

This page doesn't exist...
...kind of like how "GPT-5" doesn't exist yet. 👀

[Search bar — prominent, centered]
[placeholder: "Search models, benchmarks, providers..."]
```

### Suggested Actions

```
Lost? Here are some popular destinations:

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  📊 Compare Models  │  │  🏆 View Rankings   │  │  📈 Latest Benchmarks│
│                     │  │                     │  │                     │
│  Side-by-side       │  │  Who's winning in   │  │  Fresh data from    │
│  performance data   │  │  2026?              │  │  this week          │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### Fun Facts Section (rotates randomly)

```
🔬 Fun fact while you're here:

[Random fact each page load, e.g.:]
• "Claude 3.5 Sonnet writes better haikus than GPT-4o (we tested it)"
• "The average developer switches between 3 LLM providers per week"
• "Gemini 2.0 Flash can process your entire codebase in one context window"
• "We've run 2.4M benchmark evaluations this year"
```

### Footer Links

```
Popular pages: Rankings · Compare · Providers · API Pricing · Blog · About
```

---

## Interactive Elements

### 1. Search Bar
- **Primary CTA** — largest interactive element on the page
- Auto-focused on page load
- Dropdown with instant suggestions as user types
- Filters: Models, Benchmarks, Providers, Blog Posts
- Keyboard shortcut hint: `⌘K` to focus

### 2. Animated 404 Number
- The two `0`s have a subtle "thinking" animation (rotating dots, like LLM token generation)
- On hover, they stop and show: `Hmm...` and `Still thinking...`
- Easter egg: clicking both zeros triggers a confetti animation

### 3. "I'm Feeling Lucky" Button
- Random button that takes the user to a random model page
- Label: `🎰 Surprise me with a random model`
- Great for discovery

### 4. Report a Broken Link
- Subtle link: `Think this page should exist? Let us know →`
- Opens a modal or mailto: link pre-filled with the broken URL

---

## Accessibility

- All images have alt text
- Color contrast meets WCAG AA (4.5:1 minimum)
- Search bar has proper `<label>` and `aria-label`
- Animated elements respect `prefers-reduced-motion`
- Page is fully keyboard navigable
- Skip-to-content link for screen readers

---

## Technical Notes

### Route Configuration

```typescript
// next.config.ts or app router
// Catch-all 404 with custom page

// app/not-found.tsx
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f]">
      {/* Component tree */}
    </main>
  );
}
```

### SEO
- Return proper 404 HTTP status code
- `noindex, nofollow` meta tag
- Canonical URL should not be set (it's a 404)
- Log 404s to analytics for tracking broken links

### Performance
- Page should load in <500ms
- Use CSS animations (not JS) for the loading spinners
- Lazy load the fun facts (non-critical)
- Pre-fetch popular destination pages on hover

---

## Copy Options

### Option A — Playful & Self-Aware
```
404

This page got lost in the context window.
Even the best models hallucinate sometimes.

[Search bar]
```

### Option B — Benchmark Metaphor
```
404

Error 404: Page not found
Confidence score: 0.00
This URL failed the benchmark.

[Search bar]
```

### Option C — Friendly & Direct
```
404

Oops! This page doesn't exist.
But 847 models do — want to explore them?

[Search bar]
```

**Recommendation:** Option A — it's the most on-brand and gets a smile without trying too hard.

---

## Mobile Considerations

- Stack the 3 action cards vertically
- Reduce 404 font size to ~100px
- Search bar takes full width with 16px margins
- Fun facts section hidden on smallest screens (<375px)
- Touch targets minimum 44×44px
