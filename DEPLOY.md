# 🚀 ReviseAI — Guide de déploiement rapide

## Étape 1 — Lancer le script de setup (Windows)

1. Ouvre le dossier `revise-ai`
2. Clic droit sur `setup.ps1` → **"Exécuter avec PowerShell"**
3. Le script installe tout, crée `.env.local` et fait le premier commit Git

> Si Windows bloque l'exécution, lance d'abord dans PowerShell :
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## Étape 2 — Créer le repo GitHub (2 min)

1. Va sur **https://github.com/new**
2. Nom : `revise-ai`
3. **NE coche PAS** "Add a README file"
4. Clique **Create repository**
5. GitHub affiche 2 commandes — copie-les dans PowerShell

---

## Étape 3 — Déployer sur Netlify (2 min)

1. Va sur **https://app.netlify.com/start**
2. Clique **"Deploy with GitHub"**
3. Autorise Netlify à accéder à GitHub
4. Sélectionne le repo `revise-ai`
5. Les paramètres de build sont déjà configurés dans `netlify.toml`
6. Clique **"Show advanced"** → **"New variable"** et ajoute :
   - `MISTRAL_API_KEY` = ta clé Mistral
   - `GEMINI_API_KEY` = ta clé Gemini
7. Clique **Deploy site** → en ligne en ~2 minutes ✅

---

## Clés API gratuites

| Service | Lien | Limite gratuite |
|---------|------|----------------|
| Mistral | https://console.mistral.ai | Généreux en free tier |
| Gemini  | https://aistudio.google.com | 1500 req/jour gratuit |

---

## Structure du projet

```
revise-ai/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── result/page.tsx       ← Page résultats
│   └── api/generate/route.ts ← API unique
├── components/
│   ├── SummarySection.tsx
│   ├── FlashcardDeck.tsx
│   ├── QCMSection.tsx
│   └── FeedbackBar.tsx       ← Système de feedback 👍👎
├── lib/
│   ├── aiClient.ts           ← Mistral + Gemini fallback
│   ├── prompts.ts            ← Prompts optimisés
│   └── parsePDF.ts           ← Extraction PDF
├── next.config.js
├── netlify.toml
└── setup.ps1                 ← Script setup Windows
```
