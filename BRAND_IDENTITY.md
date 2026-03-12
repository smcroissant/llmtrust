# LLM Trust — Brand Identity Bible 🧠✨

> _"The pulse of open-source AI"_

---

## 1. Brand Essence

**LLM Trust** is not a generic SaaS dashboard. It's a **curated temple for open-source AI** — where developers discover, compare, and trust the models they run locally.

### Brand Personality
- **Intelligent** — speaks the language of engineers, not marketers
- **Luminous** — glows with the energy of neural networks processing
- **Trustworthy** — dark, grounded, reliable — like a terminal you trust
- **Precise** — every pixel intentional, like well-written code

### Brand Tagline Options
- "The pulse of open-source AI"
- "Discover. Compare. Trust."
- "Your trusted layer for open-source LLMs"

---

## 2. Art Direction: "Neural Glow"

### Direction Artistique

**"Neural Glow"** — un mélange de minimalisme technique et de luminiscence neuronale.

Imagine un laboratoire d'IA dans un film de science-fiction réaliste :
- Des écrans sombres avec des points de lumière violet qui pulsent
- Des interfaces nettes, spacieuses, avec beaucoup de respiration
- Des gradients subtils qui évoquent le flow de données dans un réseau de neurones
- Le contraste entre l'obscurité du fond et la luminosité des accents

**Ce que ce N'EST PAS :**
- ❌ Pas cyberpunk agressif (trop de néons, trop bruyant)
- ❌ Pas brutaliste (trop froid, pas assez accueillant)
- ❌ Pas glassmorphism générique (déjà vu partout)

**Ce que C'EST :**
- ✅ Sombre mais chaleureux
- ✅ Lumineux mais pas agressif
- ✅ Technique mais accessible
- ✅ Moderne mais intemporel

### Moodboard en Mots

```
Deep space observatory meets developer workstation.
A dark canvas where data points glow like stars.
Neural pathways traced in electric violet.
Every interaction feels like watching a thought form.
Clean geometry. Purposeful light. Quiet confidence.
The terminal at 2am when you're in the zone.
```

### Éléments Visuels Récurrents

1. **Glow Orbs** — Petites sphères lumineuses (gradients radiaux) en arrière-plan, évoquant des neurones
2. **Gradient Lines** — Lignes fines avec des gradients violet→transparent, comme des connexions synaptiques
3. **Subtle Grain** — Un très léger grain/noise texture sur les fonds pour ajouter de la profondeur
4. **Geometric Precision** — Bordures nettes, coins légèrement arrondis (pas trop), alignement parfait
5. **Amber Accents** — Points de chaleur amber/orange pour contraster avec le violet froid

---

## 3. Color Palette

### Palette Principale

| Role | Name | OKLCH | Hex (approx) | Usage |
|------|------|-------|---------------|-------|
| **Primary** | Electric Violet | `oklch(0.65 0.25 290)` | `#8B5CF6` | CTAs, links, active states, brand |
| **Primary Hover** | Bright Violet | `oklch(0.72 0.22 290)` | `#A78BFA` | Hover states |
| **Secondary** | Deep Slate | `oklch(0.25 0.01 270)` | `#1E1B2E` | Cards, panels, elevated surfaces |
| **Accent** | Warm Amber | `oklch(0.75 0.16 75)` | `#F59E0B` | Highlights, badges spéciaux, stats |
| **Accent Hover** | Bright Amber | `oklch(0.80 0.14 75)` | `#FBBF24` | Accent hover |

### Semantic Colors

| Role | Dark Mode | Light Mode |
|------|-----------|------------|
| **Background** | `oklch(0.12 0.01 280)` — near-black with violet undertone | `oklch(0.98 0.005 280)` — warm white |
| **Foreground** | `oklch(0.93 0.01 280)` — soft white | `oklch(0.15 0.02 280)` — deep violet-black |
| **Card** | `oklch(0.16 0.015 280)` — dark violet-gray | `oklch(1 0 0)` — pure white |
| **Card Foreground** | `oklch(0.93 0.01 280)` | `oklch(0.15 0.02 280)` |
| **Muted** | `oklch(0.22 0.01 280)` | `oklch(0.94 0.005 280)` |
| **Muted Foreground** | `oklch(0.60 0.02 280)` | `oklch(0.45 0.02 280)` |
| **Border** | `oklch(0.25 0.02 280)` | `oklch(0.90 0.01 280)` |
| **Ring** | `oklch(0.65 0.25 290)` (same as primary) | `oklch(0.60 0.22 290)` |
| **Destructive** | `oklch(0.65 0.22 25)` | `oklch(0.55 0.22 25)` |

### Chart Colors (pour les stats/graphiques)

| Index | OKLCH | Description |
|-------|-------|-------------|
| chart-1 | `oklch(0.65 0.25 290)` | Primary violet |
| chart-2 | `oklch(0.75 0.16 75)` | Accent amber |
| chart-3 | `oklch(0.70 0.15 180)` | Teal cyan |
| chart-4 | `oklch(0.60 0.20 330)` | Rose pink |
| chart-5 | `oklch(0.55 0.18 145)` | Emerald green |

---

## 4. Visual Style Details

### Gradient System

**Brand Gradient** (primary → accent):
```css
background: linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.75 0.16 75));
```

**Subtle Glow** (for hero backgrounds):
```css
background: radial-gradient(ellipse at 50% 0%, oklch(0.65 0.25 290 / 0.15), transparent 60%);
```

**Card Hover Glow**:
```css
box-shadow: 0 0 20px oklch(0.65 0.25 290 / 0.1), 0 0 60px oklch(0.65 0.25 290 / 0.05);
```

### Grain Texture

Appliqué via un pseudo-element `::before` sur le body :
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,...");
  background-repeat: repeat;
}
```

---

## 5. Typography

### Font: Inter (imposé)

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Display** | 3.5rem (56px) | 800 | 1.1 | Hero h1 |
| **Heading 1** | 2.25rem (36px) | 700 | 1.2 | Page titles |
| **Heading 2** | 1.5rem (24px) | 600 | 1.3 | Section titles |
| **Heading 3** | 1.125rem (18px) | 600 | 1.4 | Card titles |
| **Body** | 0.875rem (14px) | 400 | 1.6 | Default text |
| **Body Large** | 1rem (16px) | 400 | 1.6 | Lead paragraphs |
| **Small** | 0.75rem (12px) | 400 | 1.5 | Labels, metadata |
| **Mono** | 0.8125rem (13px) | 500 | 1.5 | Code, params, counts |

### Letter Spacing
- Headings: `-0.02em` (tighter for impact)
- Body: `0` (default)
- Labels/Small: `0.025em` (slightly wider for readability)

---

## 6. Spacing & Layout

### Spacing Scale (Tailwind-based)
- `1` = 4px — micro gaps
- `2` = 8px — tight gaps
- `3` = 12px — default gap
- `4` = 16px — comfortable gap
- `6` = 24px — section padding
- `8` = 32px — large section padding
- `12` = 48px — hero padding
- `16` = 64px — page margins
- `24` = 96px — hero vertical padding

### Border Radius
- `sm`: 6px — small elements (badges)
- `md`: 8px — buttons, inputs
- `lg`: 12px — cards
- `xl`: 16px — modals, large containers
- `2xl`: 20px — special elements

### Layout Grid
- Max content width: `1280px` (container)
- Sidebar width: `260px` (expanded), `56px` (collapsed)
- Content gap: `24px` default

---

## 7. Component Styles

### Cards (Model Cards)
- Background: `card` color (slightly lighter than bg)
- Border: subtle `border` color, 1px
- Border radius: `12px`
- Padding: `20px`
- Hover: border glows primary, slight lift (`translateY(-2px)`), shadow with primary glow
- Transition: `all 0.2s ease`

### Badges
- **Default** (architecture/tag): `secondary` bg, `muted-foreground` text, `6px` radius
- **Highlight** (param count): `primary/15` bg, `primary` text — stands out
- **Accent** (featured/popular): `accent/15` bg, `accent` text — warm glow

### Buttons
- Primary: solid `primary` bg, `primary-foreground` text, slight glow on hover
- Secondary: `secondary` bg, border with `border` color
- Ghost: transparent, hover shows `muted` bg
- All: `8px` radius, `0.15s` transition

### Stats Counter
- Number: `Display` weight, gradient text (primary → accent)
- Label: `small` size, `muted-foreground`
- Container: centered, generous padding

---

## 8. Micro-interactions

### Card Hover
```css
.card:hover {
  transform: translateY(-2px);
  border-color: oklch(0.65 0.25 290 / 0.5);
  box-shadow: 
    0 4px 12px oklch(0 0 0 / 0.1),
    0 0 20px oklch(0.65 0.25 290 / 0.08);
}
```

### Button Hover
```css
.btn-primary:hover {
  box-shadow: 0 0 16px oklch(0.65 0.25 290 / 0.3);
}
```

### Link Underline
```css
.link-underline {
  background: linear-gradient(to right, oklch(0.65 0.25 290), oklch(0.65 0.25 290));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.link-underline:hover {
  background-size: 100% 1px;
}
```

### Page Transitions
- Fade in + slight slide up: `opacity: 0 → 1, translateY(8px) → 0`
- Duration: `0.3s ease`

### Loading Skeleton
- Base: `muted` background
- Shimmer: gradient sweep from left to right
- Color: subtle primary-tinted shimmer

---

## 9. Implementation Code

See the following files:
- `src/app/globals.css` — Complete CSS with all custom properties
- `tailwind.config.ts` — Extended theme configuration
- Component examples in `src/components/`

---

## 10. Do's and Don'ts

### ✅ Do
- Use generous whitespace — let content breathe
- Keep the dark mode as the primary experience
- Use gradient text sparingly (hero, stats, brand name)
- Let the violet glow subtly — it should feel alive, not aggressive
- Use amber accents to draw attention to key metrics/CTAs
- Maintain consistent border-radius (12px for cards)
- Use `mono` style for technical data (param counts, download numbers)

### ❌ Don't
- Don't use pure black (`#000`) — always use the violet-tinted background
- Don't overuse gradients — they're accents, not backgrounds everywhere
- Don't use more than 2-3 glow effects visible at once
- Don't mix border-radius styles (keep it consistent)
- Don't use bright colors on dark backgrounds without considering contrast (WCAG AA minimum)
- Don't add animations that distract from content — they enhance, not compete

---

_Design is not just what it looks like. Design is how it works. — Steve Jobs_

_But also, it should look 🔥 — Pulse, 2026_
