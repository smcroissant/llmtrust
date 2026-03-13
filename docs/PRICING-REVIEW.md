# Pricing Page Review — Atlas Quality Gate

**Date:** 2026-03-13  
**Reviewer:** Atlas (Product)  
**File:** `src/app/pricing/page.tsx`

---

## Résumé Exécutif

Le pricing actuel contient **des incohérences majeures** avec le business model corrigé. Les prix, les features, et le positionnement sont tous à revoir.

---

## 1. ❌ Prix Incorrects

| Plan   | Actuel     | Attendu   | Écart     |
|--------|-----------|-----------|-----------|
| Free   | $0 ✅     | $0        | OK        |
| Pro    | **$9.99** | **$19**   | -47% 🔴  |
| Team   | **$29.99**| **$49**   | -38% 🔴  |

De plus, les prix annuels dans le FAQ sont calculés sur les anciens prix :
- Pro annual: $182/yr (basé sur $9.99) → devrait être ~$182-228/yr (basé sur $19)
- Team annual: $470/yr (basé sur $29.99) → devrait être ~$470-588/yr (basé sur $49)

---

## 2. ❌ Free Tier — Limite de Downloads Incorrecte

**Actuel :** "Download up to 5 models/month"

**Problème :** Le business model dit clairement que le téléchargement de modèles est **GRATUIT et illimité** (open source). On ne facture pas les modèles. Cette limite contredit le positionnement open-source.

**Correction :** Remplacer par "Download unlimited models" ou retirer complètement la mention de limite.

---

## 3. ❌ Pro Tier — Features Manquantes/Mauvaises

**Actuel :**
- Everything in Free
- Unlimited downloads
- Advanced model comparisons
- Benchmark deep-dives
- Priority API access
- Custom watchlists
- Early access to new features
- Email support

**Attendu (business model) :**
- Cloud inference (run models sans GPU) — **MANQUANT** 🔴
- API illimitée — **Partiellement présent** (priority ≠ unlimited) 🟡
- Advanced benchmarks & analytics — Partiellement présent 🟡
- Priority support — Partiellement présent (email support ≠ priority) 🟡

**Problèmes :**
1. **Cloud inference est la feature clé du Pro** et n'est même pas mentionnée. C'est ce qui justifie le prix.
2. "Unlimited downloads" n'est plus un selling point si downloads sont gratuits.
3. "Priority API access" devrait être "Unlimited API access" ou "API illimitée".
4. "Custom watchlists" et "Early access" ne sont pas dans le business model (à décider si on garde).

---

## 4. ❌ Team Tier — Features Manquantes/Mauvaises

**Actuel :**
- Everything in Pro
- Up to 10 team members
- Shared model collections
- Team analytics dashboard
- SSO authentication
- Custom integrations
- Dedicated account manager
- SLA guarantee

**Attendu (business model) :**
- Workspaces partagés — Partiellement ("Shared model collections" ≠ "Shared workspaces") 🟡
- Admin dashboard — "Team analytics dashboard" partiellement couvre 🟡
- Usage analytics — **MANQUANT** 🔴
- SSO — ✅ OK
- API management — **MANQUANT** 🔴

**Problèmes :**
1. "Up to 10 team members" n'est pas dans le business model (à décider).
2. "Custom integrations", "Dedicated account manager", "SLA guarantee" ne sont pas dans le business model.
3. Usage analytics et API management comme features distinctes sont manquantes.
4. "Workspaces partagés" vs "Shared model collections" — sémantique différente.

---

## 5. 🔍 Comparaison Table — Incohérences

La table de comparaison utilise les anciennes métriques :
- "Downloads per month: Free 5 / Pro Unlimited / Team Unlimited" — **faux si downloads gratuits**
- Rate limits: "100/day / 10K/day / 100K/day" — ne correspond pas à "100 calls/jour" pour Free et "illimitée" pour Pro
- Pas de mention de **Cloud inference** nulle part
- Pas de mention d'**API management** pour Team

---

## 6. 🔍 FAQ — Informations Obsolètes

1. **"What happens when Pro launches?"** — FAQ parle de "unlimited downloads" comme feature Pro, alors que downloads devraient être gratuits.
2. **"Do you host the models?"** — La réponse est correcte mais devrait aussi mentionner la cloud inference (Pro) comme alternative.
3. Les prix annuels dans le FAQ sont basés sur les anciens tarifs.

---

## Checklist des Changements Nécessaires

### Critical (bloquant)
- [ ] Corriger prix Pro: $9.99 → $19
- [ ] Corriger prix Team: $29.99 → $49
- [ ] Supprimer limite "5 models/month" du Free (downloads gratuits)
- [ ] Ajouter **Cloud inference** comme feature clé du Pro
- [ ] Corriger "Priority API" → "Unlimited API" pour Pro
- [ ] Ajouter **Usage analytics** et **API management** au Team

### Important
- [ ] Reviser features du Pro selon le business model
- [ ] Reviser features du Team selon le business model
- [ ] Mettre à jour la comparison table
- [ ] Mettre à jour les prix annuels dans le FAQ
- [ ] Reviser le FAQ pour refléter le nouveau model

### Nice-to-have
- [ ] Décider si "Custom watchlists", "Early access" restent dans Pro
- [ ] Décider si "Up to 10 team members", "Custom integrations", "Dedicated account manager", "SLA guarantee" restent dans Team
- [ ] Renommer "Shared model collections" → "Shared workspaces"

---

## Verdict

**🔴 NEEDS MAJOR REVISION**

Le pricing page reflète un ancien business model où les modèles/downloads étaient monétisés. Le nouveau model (downloads gratuits, cloud inference comme valeur Pro) n'est pas du tout représenté. Les prix sont incorrects, les features clés sont manquantes, et le positionnement général est incohérent.
