# ReviseAI — Documentation Technique Backend
> Pour ChatGPT : Utilise ce document pour comprendre, corriger ou étendre la partie technique de ReviseAI. Architecture, flux de données, variables d'environnement, APIs, et problèmes identifiés.

---

## 1. Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 15.3.9 |
| Runtime | Node.js | 20+ |
| Langage | TypeScript | 5.x |
| CSS | Tailwind CSS | 3.3.0 |
| IA primaire | Mistral AI (mistral-small-latest) | API REST |
| IA fallback | Google Gemini (gemini-1.5-flash) | API REST |
| Paiements | Stripe | 17.7.0 (SDK) |
| PDF parsing | pdf-parse | 1.1.1 |
| Hosting | Netlify (cible) | — |
| State management | React useState + sessionStorage + localStorage | — |

---

## 2. Variables d'environnement requises

### Fichier `.env.local` (développement local)

```env
# ── IA ────────────────────────────────────────────────
MISTRAL_API_KEY=        # console.mistral.ai → API Keys
GEMINI_API_KEY=         # aistudio.google.com → Get API key

# ── Stripe ────────────────────────────────────────────
STRIPE_SECRET_KEY=      # dashboard.stripe.com/apikeys → Secret key (sk_live_ ou sk_test_)
STRIPE_WEBHOOK_SECRET=  # dashboard.stripe.com/webhooks → Signing secret (whsec_...)
STRIPE_PRICE_ID=        # dashboard.stripe.com/products → Créer produit → Copier Price ID (price_...)

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL=   # URL publique sans slash final (ex: https://reviseai.netlify.app)
```

### Comment obtenir chaque clé

**MISTRAL_API_KEY**
1. Aller sur https://console.mistral.ai
2. Menu gauche → "API Keys" → "Create new key"
3. Copier la clé (visible une seule fois)

**GEMINI_API_KEY**
1. Aller sur https://aistudio.google.com/app/apikey
2. "Create API key" → sélectionner un projet Google Cloud
3. Copier la clé

**STRIPE_SECRET_KEY**
1. Aller sur https://dashboard.stripe.com/apikeys
2. Copier la "Secret key" (commence par `sk_test_` en mode test, `sk_live_` en prod)
3. ⚠️ Ne jamais exposer côté client (pas de préfixe `NEXT_PUBLIC_`)

**STRIPE_PRICE_ID**
1. Dashboard Stripe → "Product catalog" → "Add product"
2. Nom : "ReviseAI Pro", Prix : 4,99€, Récurrent : Mensuel
3. Après création → copier le "Price ID" (commence par `price_`)

**STRIPE_WEBHOOK_SECRET**
1. Dashboard Stripe → "Developers" → "Webhooks" → "Add endpoint"
2. URL : `https://ton-site.netlify.app/api/stripe/webhook`
3. Événements à écouter : `checkout.session.completed`, `customer.subscription.deleted`
4. Après création → "Signing secret" → "Reveal" → copier (`whsec_...`)
5. En local pour tester : installer Stripe CLI → `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Variables sur Netlify
Dashboard Netlify → Site → "Site configuration" → "Environment variables" → Ajouter les mêmes 6 variables.

---

## 3. Architecture des routes API

```
app/
├── api/
│   ├── generate/
│   │   └── route.ts          ← POST : génération IA principale
│   └── stripe/
│       ├── checkout/
│       │   └── route.ts      ← POST : crée une Stripe Checkout Session
│       ├── verify/
│       │   └── route.ts      ← GET  : vérifie qu'un paiement est bien passé
│       └── webhook/
│           └── route.ts      ← POST : reçoit les événements Stripe
```

---

## 4. Flux complet — Génération IA

### Endpoint : `POST /api/generate`

**Input accepté :**
- `Content-Type: application/json` → `{ text: string }`
- `Content-Type: multipart/form-data` → `file: File (PDF)` ou `text: string`

**Pipeline :**
```
Input (texte ou PDF)
  ↓
extractTextFromPDF() si PDF   [lib/parsePDF.ts]
  ↓
truncateToTokenLimit(text)    [lib/parsePDF.ts — limite ~12000 tokens]
  ↓
Promise.all([                 // 3 appels en parallèle
  callAI(getSummaryPrompt()),
  callAI(getFlashcardsPrompt()),
  callAI(getQCMPrompt()),
])                            [lib/aiClient.ts + lib/prompts.ts]
  ↓
safeParseJSON() × 3           // Parse JSON, fallback si malformé
  ↓
Response JSON : {
  summary: string,
  key_concepts: string[],
  flashcards: { question, answer }[],
  qcm: { question, choices: {A,B,C,D}, correct, explanation }[]
}
```

**Validation :**
- Texte < 50 caractères → erreur 400
- Erreur IA → erreur 500 avec message

---

## 5. Détail : lib/aiClient.ts — Système double IA avec fallback

```typescript
// Logique de la fonction callAI()
1. Tenter appel Mistral (mistral-small-latest)
   - Endpoint : https://api.mistral.ai/v1/chat/completions
   - Headers : Authorization: Bearer $MISTRAL_API_KEY
   - Si succès → retourner la réponse

2. Si erreur Mistral (réseau, quota, 5xx)
   - Logger "Mistral failed, falling back to Gemini"
   - Tenter appel Gemini (gemini-1.5-flash)
   - Endpoint : https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
   - Query param : key=$GEMINI_API_KEY
   - Si succès → retourner la réponse

3. Si les deux échouent → throw Error
```

**Problème identifié :** Pas de timeout configuré sur les appels fetch — si Mistral met 30s à répondre, l'utilisateur attend sans feedback.

**Fix recommandé :**
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
const res = await fetch(url, { signal: controller.signal, ... });
clearTimeout(timeout);
```

---

## 6. Détail : lib/prompts.ts — Prompts IA

### getSummaryPrompt(text)
```
Rôle système : Assistant pédagogique expert en résumés
Output attendu : JSON { summary: string, key_concepts: string[] }
Consigne : résumé structuré en 3-5 paragraphes + 5-8 concepts-clés
```

### getFlashcardsPrompt(text)
```
Rôle système : Créateur de flashcards pédagogiques
Output attendu : JSON { flashcards: [{ question: string, answer: string }] }
Consigne : 8-12 flashcards question/réponse courte
```

### getQCMPrompt(text)
```
Rôle système : Créateur de QCM pédagogiques
Output attendu : JSON { qcm: [{ question, choices: {A,B,C,D}, correct: "A"|"B"|"C"|"D", explanation }] }
Consigne : 5-8 questions avec 4 choix, une seule bonne réponse
```

**Problème identifié :** Les prompts demandent du JSON mais n'utilisent pas le mode `response_format: { type: "json_object" }` de Mistral → risque de JSON malformé géré par `safeParseJSON()`.

**Fix recommandé :** Activer le JSON mode dans l'appel Mistral pour garantir un output valide.

---

## 7. Détail : lib/parsePDF.ts

```typescript
// extractTextFromPDF(buffer: Buffer): Promise<string>
- Utilise pdf-parse
- Extrait le texte brut de toutes les pages
- Retourne le texte concaténé

// truncateToTokenLimit(text: string, maxTokens = 12000): string
- Estimation approximative : 1 token ≈ 4 caractères
- Tronque à maxTokens * 4 = ~48000 caractères
- Problème : L'estimation est grossière, peut dépasser les limites API réelles
```

---

## 8. Flux complet — Paiement Stripe

### Étape 1 : Utilisateur clique "Passer au Pro"
```
Page /pricing
  → Saisit son email
  → POST /api/stripe/checkout { email }
  → Stripe crée une Checkout Session (mode: subscription)
  → Retourne { url: "https://checkout.stripe.com/..." }
  → Redirection window.location.href vers Stripe
```

### Étape 2 : Paiement sur Stripe
```
Stripe Checkout (hébergé par Stripe)
  → Saisit CB
  → Succès → redirect vers /success?session_id=cs_...
  → Annulation → redirect vers /pricing
```

### Étape 3 : Activation Pro
```
Page /success
  → Lit session_id depuis URL params
  → GET /api/stripe/verify?session_id=cs_...
  → Vérifie session.payment_status === 'paid'
  → Retourne { success: true, email, token }
  → localStorage.setItem('revise_pro_token', token)
  → Affiche confirmation "Tu es Pro !"
```

### Étape 4 : Webhook Stripe (côté serveur)
```
Stripe → POST /api/stripe/webhook
  → Vérifie signature avec STRIPE_WEBHOOK_SECRET
  → checkout.session.completed → log email
  → customer.subscription.deleted → log annulation
```

**⚠️ Problème critique :** Le webhook ne fait que logguer — il n'y a pas de base de données pour stocker les abonnements actifs. Le statut Pro est uniquement dans le localStorage de l'utilisateur.

**Conséquence :** Si l'utilisateur efface son localStorage ou change de navigateur, il perd son accès Pro même s'il est abonné.

**Fix recommandé :** Stocker les emails Pro dans une base de données (Supabase free tier, PlanetScale, ou Upstash Redis) et vérifier côté API avant chaque génération.

---

## 9. Système de quota (lib/quota.ts)

```typescript
FREE_LIMIT = 3  // générations gratuites par jour

// Clé localStorage : "revise_quota_YYYY-MM-DD"
// Remet à zéro automatiquement chaque nouveau jour

getQuotaUsed()       → lit le compteur du jour
incrementQuota()     → incrémente de 1
hasReachedLimit()    → true si >= 3
getRemainingGenerations() → max(0, 3 - used)

// Vérification Pro
isProUser()
  → lit localStorage['revise_pro_token']
  → décode le payload base64 (format: "pro.{base64}.ok")
  → vérifie que expires > Date.now()
```

**⚠️ Problème de sécurité :** Le quota est uniquement côté client (localStorage). N'importe qui peut l'effacer ou le manipuler via les DevTools pour contourner la limite.

**Fix recommandé :** Vérifier le quota côté serveur via un token IP ou un cookie signé (ex: `iron-session`).

---

## 10. Stockage des données utilisateur

| Donnée | Stockage | Durée |
|--------|----------|-------|
| Résultat IA généré | `sessionStorage['revise_result']` | Session browser |
| Quota quotidien | `localStorage['revise_quota_YYYY-MM-DD']` | Permanent (par jour) |
| Token Pro | `localStorage['revise_pro_token']` | 1 an (si non effacé) |
| Feedback utilisateur | `localStorage['revise_feedback_history']` | Permanent (100 entrées max) |
| Stats globales | `localStorage['revise_stats']` | Permanent |
| Compteur d'usages | `localStorage['revise_count']` | Permanent |

**⚠️ Problème :** Toutes les données sont locales — aucune remontée analytics côté serveur.

---

## 11. Configuration Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Note :** Le plugin `@netlify/plugin-nextjs` est nécessaire pour les routes API (Server Functions). Sans lui, seules les pages statiques fonctionnent.

---

## 12. Problèmes techniques prioritaires à corriger

### CRITIQUE
1. **Pas de DB pour les abonnements** — le statut Pro est perdu si localStorage effacé
2. **Quota contournable** — tout est côté client, aucune vérification serveur
3. **Webhook Stripe vide** — ne fait que logguer, ne persiste rien
4. **Pas de timeout sur fetch IA** — risque de requests qui pendent indéfiniment

### IMPORTANT
5. **JSON mode Mistral non activé** — risque de réponses mal formatées
6. **Pas de rate limiting sur `/api/generate`** — peut être abusé (coûts IA illimités)
7. **Estimation tokens grossière** — peut envoyer trop de texte à l'API
8. **`window.print()` pour PDF** — ne génère pas un vrai PDF formaté

### NICE TO HAVE
9. **Logs structurés** — uniquement des `console.log`, pas de système de logging
10. **Tests** — aucun test unitaire ou e2e
11. **Error boundary React** — pas de gestion des erreurs de rendu
12. **Compression réponses API** — pas de gzip/brotli configuré explicitement

---

## 13. Roadmap technique recommandée (post-V0)

### V1 — Stabilisation (semaine 2-3)
- [ ] Ajouter Supabase (free) pour stocker les abonnements Stripe
- [ ] Vérification Pro côté serveur avant chaque génération
- [ ] Rate limiting avec Upstash Redis (100 req/minute/IP)
- [ ] Timeout 15s sur les appels IA

### V2 — Amélioration qualité (semaine 4-6)
- [ ] Activer JSON mode Mistral
- [ ] Google Analytics 4 pour tracker les usages
- [ ] Export PDF propre (react-pdf ou jsPDF)
- [ ] Envoi des feedbacks à une DB

### V3 — Auth légère (mois 2)
- [ ] NextAuth.js avec Google OAuth
- [ ] Historique des révisions par user
- [ ] Import Google Drive natif
