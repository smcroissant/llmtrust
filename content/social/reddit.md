# Reddit Strategy — LLM Trust

## Règles générales (CRITIQUE — Reddit ban sans pitié)

1. **NE JAMAIS poster le même contenu** sur plusieurs subreddits le même jour
2. **Ratio 9:1** — 9 commentaires/posts de valeur pour 1 promo
3. **Pas de liens dans le titre** — lien dans le body ou en commentaire
4. **Lire les règles** de chaque subreddit AVANT de poster
5. **Compte minimum 30 jours** + karma positif avant de promo
6. **Ne pas demander d'upvotes** — jamais
7. **Répondre à TOUS les commentaires** de ton post
8. **Ton humble et authentique** — Reddit déteste le marketing corporate

## Timing optimal

- **Mardi-Jeudi**, 8-10 AM EST (14h-16h CET)
- Éviter le weekend (moins d'engagement tech)
- Éviter les US holidays

---

## r/MachineLearning

**Membres:** 3M+ | **Règles strictes** | **Tonalité:** Academic/professional

### Rules à respecter

- Posts doivent être substantiels (pas juste un lien)
- Pas de self-promo sans valeur ajoutée
- Flair obligatoire [R], [P], [D], [N]
- Commentaires constructifs uniquement

### Template — Project post [P]

**Titre:**
```
[P] LLM Trust — An open platform to discover, compare and evaluate 100+ LLMs
```

**Body:**
```
Hi r/MachineLearning,

I've been working on a project that I think this community might find useful. 

LLM Trust (https://www.llmtrust.com) is a platform for discovering and comparing large language models. Think of it as a centralized, searchable database of LLMs with:

- Side-by-side benchmark comparisons (MMLU, HumanEval, MT-Bench, GSM8K, etc.)
- Pricing comparisons across providers (OpenAI, Anthropic, Together, Groq, etc.)
- Context window, modality, and license information
- Real-world use case recommendations

**Why I built this:**
Every week there's a new model release. Keeping track of which model is best for which task, what the pricing looks like, and whether it's actually any good has become a full-time job. I wanted a single source of truth.

**What I'd love feedback on:**
- Which benchmarks matter most to you in practice?
- What comparison features would be most useful?
- Any models we're missing?

The platform is free and I'm planning to keep the core features free. Happy to answer any questions about the technical implementation as well.

Thanks!
```

### Comment post strategy

Répondre aux posts existants avec:
- Des analyses de modèles
- Des comparaisons de benchmarks
- Des insights sur pricing
- Des recommandations contextuelles

Puis, quand pertinent: "I actually built a tool for this exact problem — llmtrust.com"

---

## r/LocalLLaMA

**Membres:** 800K+ | **Tonalité:** Enthusiastic, open source focused, practical

### Template — Sharing post

**Titre:**
```
I built a free tool to compare 100+ LLMs side by side — benchmarks, pricing, context windows
```

**Body:**
```
Hey everyone,

After spending way too much time bouncing between blog posts, leaderboards, and provider docs to figure out which LLM to use for different projects, I built something to solve my own problem.

LLM Trust (https://www.llmtrust.com) lets you:

- Browse 100+ models (open source + API)
- Compare benchmarks side by side
- See real pricing across providers
- Filter by context length, license, modality
- Get "which model should I use" recommendations

Some things I found interesting while building this:
- The gap between open source and proprietary is smaller than most people think
- For many tasks, a 7B-13B model is totally sufficient
- Pricing varies 100x between providers for the same model

The site is free, no account needed. I'd love to hear what features would make this more useful for your local/self-hosted workflows.

Already planning to add:
- Quantization info (GGUF, GPTQ, AWQ)
- VRAM requirements per model
- Ollama/LM Studio compatibility flags

What else should I add?
```

### Engagement strategy

- Participer aux discussions "which model should I use"
- Aider les gens avec des recommandations de modèles
- Partager des insights de benchmarks
- Cross-reference llmtrust quand pertinent (pas à chaque commentaire)

---

## r/artificial

**Membres:** 200K+ | **Tonalité:** Mixed (pros + curious public)

### Template — News/discussion post

**Titre:**
```
There are now 100+ LLMs available to developers. Here's how to navigate the landscape.
```

**Body:**
```
The LLM ecosystem has exploded. Between open source releases (Llama, Mistral, DeepSeek) and API providers (OpenAI, Anthropic, Google, Cohere), developers face an overwhelming number of choices.

I've been cataloging and comparing these models, and here are some patterns:

1. **Open source is catching up fast** — Llama 3 70B matches or beats GPT-3.5 on many benchmarks
2. **Specialization matters** — Code-specific models (DeepSeek Coder, CodeLlama) outperform general models on coding tasks
3. **Price varies wildly** — Same model can cost 10x more on one provider vs another
4. **Context length isn't everything** — A 32K model with good retrieval beats a 200K model without

I built a free tool to help navigate this: https://www.llmtrust.com — it's basically a searchable, comparable database of LLMs.

Curious what the community thinks: What's your biggest challenge when choosing between LLMs?
```

---

## r/programming

**Membres:** 5M+ | **Tonalité:** General dev, practical, skeptical of marketing

### Template — Practical post

**Titre:**
```
How to pick the right LLM for your project (and stop defaulting to GPT-4)
```

**Body:**
```
I've been building LLM-powered apps for the past year and made almost every mistake possible when it comes to model selection. Here's what I've learned:

**Stop defaulting to GPT-4 for everything.**

For most production workloads, you can get 90%+ of the quality at 10-50% of the cost by choosing the right model:

- **Simple classification/extraction** → Small models (Llama 3 8B, Mistral 7B) are often sufficient
- **Code generation** → DeepSeek Coder, CodeLlama, or even StarCoder2
- **Summarization** → Claude Haiku or Mixtral for the best speed/quality ratio
- **Complex reasoning** → GPT-4o, Claude Sonnet/Opus, Llama 3 70B
- **RAG pipelines** → The retrieval matters more than the model size

The key is matching the model to the task, not always picking the "best" model.

I actually built a free tool to help with this decision: https://www.llmtrust.com — lets you compare models by benchmark, price, and use case.

What's your experience? Have you found good model/task matches that surprised you?
```

---

## r/SideProject

**Membres:** 300K+ | **Tonalité:** Supportive, indie makers, show-and-tell

### Template — Launch post

**Titre:**
```
Launched LLM Trust — like npm but for language models 🧠
```

**Body:**
```
Hey r/SideProject! 👋

Just shipped my latest project: LLM Trust (https://www.llmtrust.com)

**The problem:** There are 100+ LLMs out there. Which one should you use? Nobody has time to research them all.

**The solution:** A searchable database where you can compare models side by side. Benchmarks, pricing, context windows, use case recommendations — all in one place.

**Stack:** [Your stack here]

**Stats after [X] days:**
- [X] models cataloged
- [X] unique visitors
- [X] comparisons made

**What I learned:**
- [One genuine learning]
- [Another genuine learning]

Would love your feedback! What would make this more useful for you?

Happy to answer any questions about the build process.
```

---

## Engagement Calendar

| Jour | Subreddit | Type | Post |
|------|-----------|------|------|
| Mardi S1 | r/LocalLLaMA | Sharing | Tool launch post |
| Mercredi S1 | r/programming | Value | Model selection guide |
| Jeudi S1 | r/MachineLearning | Project | [P] tag post |
| Mardi S2 | r/artificial | Discussion | LLM landscape |
| Mercredi S2 | r/SideProject | Launch | Show & tell |
| Jeudi S2 | r/LocalLLaMA | Engagement | Comment on "which model" posts |

**Entre les posts:** 5-10 comments/jour sur des posts existants dans ces subreddits. Apporter de la valeur, mentionner LLM Trust seulement quand c'est directement pertinent.

## Flairs à utiliser

- r/MachineLearning: [P] (Project)
- r/LocalLLaMA: [Resource] ou [Project]
- r/artificial: [Discussion]
- r/programming: pas de flair promo, utiliser [Discussion]
- r/SideProject: [I made this]
