# Hacker News Launch – LLM Trust

## Title (max 80 chars)

```
Show HN: LLM Trust – Compare and discover open-source LLMs
```

---

## Body du post

**URL à soumettre :** https://llmtrust.com

**Texte du post :**

We built LLM Trust — an open-source platform to compare and benchmark open-source LLMs across standardized criteria (performance, license, hardware requirements, quantization support, community health).

The interesting part: we built it with a team of 6 AI agents orchestrated like a real engineering org.

**Stack**

- Next.js 16 (App Router, React 19, Server Components)
- tRPC 11 for end-to-end type-safe APIs
- Drizzle ORM + Neon Serverless Postgres
- Better Auth for authentication (email/password + OAuth)
- Tailwind CSS v4 + shadcn/ui
- Sentry for error tracking
- Deployed on Vercel

**How the agent team works**

We have 6 specialized agents, each with a defined role:

1. **CEO (Solomon)** — Receives requirements, decomposes tasks, delegates to the right specialist. The orchestrator.
2. **Product (Atlas)** — Roadmap, user stories, prioritization. Decides what gets built and why.
3. **Engineering (Forge)** — Writes code, reviews architecture, handles implementation. The builder.
4. **DevOps (Sentry)** — Infrastructure, CI/CD, monitoring, security. Keeps things running.
5. **Customer Success (Aura)** — User feedback, docs, support, community. The voice of the user.
6. **Marketing (Pulse)** — Content, positioning, growth channels. External communications.

Each agent has its own `SOUL.md` (personality, decision-making framework) and `IDENTITY.md` (role boundaries). They communicate through a shared workspace with structured memory files (`memory/YYYY-MM-DD.md` for daily logs, `MEMORY.md` for long-term context).

**What we learned building with agents**

1. **Clear role boundaries prevent chaos.** When each agent knows exactly what it owns and what it doesn't, you avoid duplicate work and conflicting decisions. The CEO agent acts as a router — same pattern as a real org chart.

2. **Memory files are critical infrastructure.** Agents are stateless between sessions. The workspace filesystem is their shared brain. Daily markdown files + a curated long-term memory file = continuity. Without this, every session starts from zero.

3. **Structured task delegation beats free-form prompting.** Instead of "build me a thing," the workflow is: CEO receives request → decomposes into subtasks → routes each to the specialist with full context → specialist executes and reports back → CEO integrates results.

4. **Type-safe APIs matter even more in multi-agent setups.** tRPC + Zod schemas mean agents can't hallucinate API contracts. The type system is the guardrail. When an agent generates a procedure call, TypeScript validates it at build time.

5. **Drizzle > Prisma for this use case.** Drizzle's query builder is closer to SQL, which makes it easier for agents to generate correct queries. The schema-as-TypeScript approach also plays well with automated code generation.

6. **Better Auth simplified the auth layer significantly.** Email/password + OAuth (GitHub, Google) with session management out of the box. The plugin architecture means we could extend it without forking the core.

**Architecture highlights**

- `/src/server/api/routers/` — tRPC routers organized by domain (models, benchmarks, comparisons)
- `/src/server/db/schema.ts` — Drizzle schema, single source of truth for the database
- `/src/app/` — Next.js App Router with streaming SSR and React Server Components
- `/src/lib/` — Shared utilities, auth helpers, type definitions
- Agents operate on the workspace filesystem, not through API calls — they read/write files directly

**What's next**

- Expanding the benchmark dataset beyond the current 200+ models
- Community-submitted evaluations with a review workflow
- API access for programmatic comparison queries

Happy to answer questions about the agent architecture, the tech stack, or what we'd do differently.

---

## Stratégie commentaires

### Règles générales

- **Répondre à CHAQUE commentaire** (même les critiques)
- **Tonalité : humble, technique, curieuse**
- **Pas de marketing-speak** — rester dans le concret
- **Partager du code / détails d'archi** quand on demande
- **Reconnaître les limites** — si on critique quelque chose de juste, l'admettre

### Templates de réponse par type de commentaire

#### Question technique sur l'archi agent

> Great question. Each agent runs as a separate session with its own system prompt loaded from `SOUL.md` + `IDENTITY.md`. The CEO agent receives the user message, determines which specialist should handle it, then either delegates by spawning a sub-agent or routes the task directly. Communication happens through the shared workspace filesystem — agents write markdown reports that the CEO reads and synthesizes.
>
> The key insight was treating agent boundaries like microservice boundaries: well-defined interfaces (file formats, task templates), loose coupling (agents don't call each other directly), and a single orchestrator.

#### Question sur le choix technique (Drizzle, tRPC, etc.)

> We chose [X] because [raison technique concrète]. For Drizzle specifically: the schema definition being plain TypeScript objects made it much easier for code-generating agents to produce correct migrations vs Prisma's schema language. tRPC gave us end-to-end type safety without maintaining a separate OpenAPI spec — the types flow from procedure definition to client call automatically.
>
> Trade-off: tRPC couples client and server tightly. For a public API we'd add a REST layer, but for the internal app it's been a net win.

#### Critique sur le concept d'agents

> Fair point. The "AI agents" framing can sound like hype. What we actually have is: structured system prompts + file-based memory + a task routing layer. It's more like a workflow engine with LLM-powered steps than autonomous agents.
>
> The value isn't in the agents being "smart" — it's in the role separation enforcing discipline. A single model with a mega-prompt would technically work, but the boundaries prevent context pollution and make the system easier to debug.

#### "Why not just use [alternative]?"

> We evaluated [alternative] and it's a solid choice. Our reasons for [X] were specific to our constraints: [raison concrète]. If we were starting today / with different requirements, we might choose differently. No stack is universally optimal.

#### Commentaire positif / encouragement

> Thanks! The biggest lesson was that the boring stuff (clear role definitions, structured memory, type safety) matters more than the exciting stuff (which model, which framework). Happy to share more details if useful.

### Timing de publication

- **Jour optimal :** Mardi ou Mercredi
- **Heure :** 8h00 – 9h00 AM EST (14h00 – 15h00 CET)
- **Raison :** Le traffic HN est max entre 8-10 AM EST en milieu de semaine

### Règles HN à respecter

1. **PAS de vote manipulation** — ne jamais demander d'upvotes
2. **PAS de clickbait** — le titre doit décrire exactement le contenu
3. **Être informatif** — HN valorise le contenu technique substantiel
4. **Répondre vite aux premiers commentaires** — les 30 premières minutes sont cruciales
5. **Éviter le marketing langage** — "revolutionary", "game-changing", "best" = instant downvote
6. **Partager des détails concrets** — code snippets, architecture diagrams, métriques réelles
7. **Ne pas mass-poster** — un seul post, pas de cross-posting visible

### Checklist pré-publication

- [ ] URL publique fonctionnelle (llmtrust.com)
- [ ] Post testé sur desktop + mobile
- [ ] Pas de liens trackés (UTM, etc.) — HN les downvote
- [ ] Email de contact vérifié sur le compte HN
- [ ] Disponible pour répondre aux commentaires pendant 4h+ après publication
- [ ] Pas de liens vers des landing pages marketing dans les commentaires
