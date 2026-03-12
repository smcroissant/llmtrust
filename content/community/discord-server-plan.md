# 🎮 Discord Server Plan — LLM Trust

## Vision
Un serveur Discord vivant où les développeurs découvrent, testent et partagent des LLMs. Pas un support channel — une communauté de passionnés.

---

## 🏗️ Structure des Channels

### 📢 Information
| Channel | Type | Description |
|---------|------|-------------|
| `#announcements` | 🔒 Read-only | Updates produit, nouveaux modèles, changelog |
| `#rules` | 🔒 Read-only | Règles du serveur |
| `#welcome` | 🔒 Read-only + system messages | Message de bienvenue auto |

### 💬 Discussion
| Channel | Type | Description |
|---------|------|-------------|
| `#general` | 💬 Texte | Discussion générale, hors-sujet bienvenu |
| `#introductions` | 💬 Texte | Nouveaux membres se présentent |

### 🔬 Modèles & Benchmarks
| Channel | Type | Description |
|---------|------|-------------|
| `#model-discoveries` | 💬 Texte | Découvertes de nouveaux modèles, sorties, veille |
| `#benchmarks` | 💬 Texte | Partage de résultats de benchmarks, comparaisons |
| `#model-requests` | 💬 Texte | Demandes d'ajout de modèles à la plateforme |

### 🛠️ Build & Support
| Channel | Type | Description |
|---------|------|-------------|
| `#showcase` | 💬 Texte | Ce que les gens build avec LLM Trust |
| `#help` | 💬 Texte | Questions d'utilisation de la plateforme |
| `#feedback` | 💬 Texte | Suggestions, retours, idées d'amélioration |

### 🎙️ Voice
| Channel | Type | Description |
|---------|------|-------------|
| `🔊 Office Hours` | Voice | Sessions hebdomadaires avec l'équipe |
| `🔊 Co-working` | Voice | Travail en commun, ambiance café |

**Total: 12 channels.** Pas plus. On agrandira quand la communauté le demande.

---

## 👥 Rôles & Permissions

### Rôles automatiques
| Rôle | Couleur | Obtention |
|------|---------|-----------|
| `@everyone` | Gris | Rejoindre le serveur |
| `@Verified` | Bleu clair | Lire les règles + réagir ✅ |

### Rôles par intérêt (self-assign via bot)
| Rôle | Description |
|------|-------------|
| `🔍 Model Explorer` | Intéressé par la découverte de modèles |
| `📊 Benchmark Nerd` | Fan de benchmarks et métriques |
| `🛠️ Builder` | Build des apps avec LLM Trust |
| `📝 Reviewer` | Contribue des reviews de qualité |
| `🎨 Fine-tuner` | Spécialiste fine-tuning |

### Rôles spéciaux
| Rôle | Couleur | Obtention |
|------|---------|-----------|
| `⚡ Power User` | Or | Programme Power User (voir doc dédiée) |
| `🏆 Ambassador` | Violet | Programme Ambassador |
| `🛠️ Team` | Rouge | Équipe LLM Trust |
| `🤖 Bot` | Gris foncé | Bots |

### Permissions
- `@everyone`: voir les channels info, pas envoyer de messages tant que pas `@Verified`
- `@Verified`: accès complet aux channels texte
- `⚡ Power User`: accès à `#power-user-lounge` (channel privé)
- `🛠️ Team`: modération + admin

---

## 🤖 Bots Recommandés

### Essentiels (Jour 1)
| Bot | Usage | Config |
|-----|-------|--------|
| **Carl-bot** | Auto-mod, rôles réactionnels, welcome messages, reaction roles | Setup les reaction roles pour les rôles d'intérêt |
| **Statbot** | Stats du serveur, tracking croissance | Baseline dès le départ |

### Ajouter après lancement
| Bot | Usage | Quand |
|-----|-------|-------|
| **MEE6** | Levels/XP, annonces automatiques | Quand on veut gamifier |
| **Tupperbox** | Webhooks pour updates produit | Pour poster les news LLM Trust |
| **Discohook** | Messages embed custom | Pour les annonces stylées |

---

## 📬 Messages de Bienvenue

### Auto-message dans #welcome (Carl-bot)
```
👋 Bienvenue sur **LLM Trust**, {user}!

LLM Trust, c'est la plateforme de découverte de LLMs pour développeurs.

**Pour commencer :**
1. 📜 Lis les règles dans #rules
2. ✅ Réagis avec ✅ pour accéder au serveur
3. 🎭 Choisis tes rôles dans ce channel
4. 💬 Présente-toi dans #introductions

On est ravis de t'avoir ici! 🚀
```

### DM automatique (Carl-bot)
```
Hey {user}! 👋

Bienvenue sur le Discord LLM Trust.

Conseil : choisis tes rôles d'intérêt dans #welcome pour voir les channels qui t'intéressent.

À bientôt! 🤖
```

### Message #introductions (pin)
```
📝 **Présente-toi !**

Qui es-tu ? Qu'est-ce que tu fais ? Quel LLM utilise-tu en ce moment ?

Pas de format imposé, sois toi-même. Exemple :
> "Je suis Marie, dev backend à Lyon. J'utilise principalement Claude et Mistral pour mes projets. Je viens de découvrir LLM Trust et je suis fan de l'interface de comparaison !"
```

---

## 📋 Règles du Serveur

À pin dans `#rules` :

```
📋 **Règles de la communauté LLM Trust**

**1. 🤝 Respect mutuel**
Pas de harcèlement, pas de discrimination, pas de troll. On est des adultes.

**2. 🎯 Rester dans le bon channel**
Chaque channel a un sujet. Utilise #help pour l'aide, #model-discoveries pour les news modèles.

**3. 🔗 Pas de spam**
Pas de self-promo non sollicitée. Pas de liens sans contexte. Un seul message, pas cinq.

**4. 🧠 Qualité > Quantité**
Un message utile vaut mieux que dix messages vides. Partage du concret : liens, résultats, code.

**5. 🚫 Pas de contenu illégal ou NSFW**
Évident.

**6. 💬 Anglais ou français**
On est bilingues. Utilise ce qui te semble naturel.

**7. 🐛 Bugs ? → #help ou GitHub Issues**
Pas de DM aux mods pour les bugs. Utilise les channels appropriés.

**Enfreindre les règles = mute temporaire puis ban.**
Le modérateur a toujours raison. En cas de désaccord, DM un modérateur.
```

---

## 🚀 Stratégie de Lancement — Premiers 100 Membres

### Phase 1 : Pre-Launch (Semaine -2 à 0)
| Action | Détail |
|--------|--------|
| Setup complet | Channels, rôles, bots, règles — tout est prêt AVANT le premier membre |
| Seed community | Inviter 10-15 personnes de confiance (amis devs, early testers) |
| Contenu initial | Poster 5-10 messages dans chaque channel pour éviter l'effet "désert" |
| Welcome message | Rédiger et tester tous les messages auto |

### Phase 2 : Launch (Semaine 1-2)
| Action | Détail | Cible |
|--------|--------|---|
| Lien Discord sur le site | Badge Discord en hero section | — |
| Tweet/Post lancement | "On ouvre notre Discord ! Rejoins la communauté" | +20 membres |
| Reddit posts | r/LocalLLaMA, r/MachineLearning, r/programming | +25 membres |
| Dev.to / Hashnode article | "Building an LLM Discovery Platform" + lien Discord | +15 membres |
| DMs personnels | Contacter 30-50 devs actifs dans l'écosystème LLM | +15 membres |

### Phase 3 : Traction (Semaine 3-4)
| Action | Détail | Cible |
|--------|--------|---|
| Première Office Hours | Session live avec l'équipe, Q&A | Rétention |
| Contest "Best Model Discovery" | Le meilleur partage de modèle gagne un rôle spécial | Engagement |
| Cross-post partnerships | Partenaires Discord (communautés dev adjacentes) | +25 membres |

### Métriques de succès (premiers 100)
- [ ] 100 membres
- [ ] 30% de membres vérifiés (ont réagi ✅)
- [ ] 50+ messages/jour dans #general
- [ ] 10+ contributions dans #model-discoveries
- [ ] 1 Office Hours réussie

### Principes clés
1. **Ne jamais laisser un message sans réponse** — chaque message dans #help et #feedback reçoit une réponse < 4h
2. **L'équipe est visible** — les 5 membres de l'équipe postent activement les 4 premières semaines
3. **On récompense la contribution** — premier à poster un modèle → shoutout dans #announcements
4. **On demande du feedback** — semaine 2, sondage "Comment améliorer le serveur ?"

---

## 📆 Routine Hebdomadaire

| Jour | Action |
|------|--------|
| Lundi | Post "Model of the Week" dans #model-discoveries |
| Mercredi | Office Hours (17h CET) dans 🔊 Office Hours |
| Vendredi | Récap de la semaine dans #announcements |
| Dimanche | Sondage communauté (quick poll sur un sujet chaud) |

---

*Document rédigé par Aura — Head of Customer Success, LLM Trust*
