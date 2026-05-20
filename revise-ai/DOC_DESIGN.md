# ReviseAI — Documentation Design UI/UX
> Pour ChatGPT : Utilise ce document pour corriger, améliorer ou refactoriser le design visuel de ReviseAI. Chaque section décrit précisément ce qui existe, avec les valeurs Tailwind exactes et les problèmes identifiés.

---

## 1. Système de design global

### Palette de couleurs
- **Fond principal** : dégradé `from-violet-950 via-indigo-900 to-blue-900` (direction `bg-gradient-to-br`) — très sombre, presque noir-violet
- **Accent primaire** : `violet-400` (#a78bfa), `violet-500` (#8b5cf6)
- **Texte principal** : `white`
- **Texte secondaire** : `indigo-200` (#c7d2fe), `indigo-300` (#a5b4fc)
- **Texte tertiaire/discret** : `indigo-400` (#818cf8), `indigo-500` (#6366f1)
- **Cartes/surfaces** : `bg-white/10` avec `border border-white/20` — effet glassmorphism
- **Erreur** : `red-400`
- **Succès** : `green-400`
- **Warning** : `yellow-400`

### Typographie
- **Font** : police système Next.js par défaut (pas de font Google importée)
- **Titre principal** : `text-4xl md:text-5xl font-black tracking-tight`
- **Sous-titres** : `text-lg md:text-xl font-medium`
- **Body** : `text-sm`
- **Labels** : `text-xs font-semibold uppercase tracking-widest`
- **Problème identifié** : Aucune font personnalisée — le design manque de caractère typographique fort

### Bordures & Rayons
- **Cards principales** : `rounded-2xl`
- **Boutons** : `rounded-xl`
- **Inputs** : `rounded-xl`
- **Badges/pills** : `rounded-full`
- **Séparateurs** : `h-px bg-white/20`

### Ombres
- **Card principale** : `shadow-2xl`
- **Bouton primaire** : `shadow-lg shadow-violet-500/30`
- **Pas d'ombre sur les autres éléments** — manque de profondeur

### Animations
- **Spinner loading** : `animate-spin` (border-4, border-t-transparent, w-16 h-16)
- **Progress bar loading** : `animate-pulse` à 70% de largeur fixe (pas animé progressivement)
- **Transition page résultats** : `transition-all duration-500` opacity + translateY
- **Hover boutons** : `transition-all`
- **Problème identifié** : La progress bar de loading est statique (70% fixe), pas de vrai progrès visuel

---

## 2. Page `/` — Page principale

### Structure layout
```
<main> (min-h-screen, centré flex col)
  ├── Header (text-center, mb-8)
  │   ├── H1 : "ReviseAI" (AI en violet-400)
  │   ├── Sous-titre avec "10 secondes" en violet-300 bold
  │   └── Ligne quota : "X générations gratuites aujourd'hui" ou "⚡ Pro — illimité"
  ├── Badge Pro CTA (si non-Pro)
  └── Card (max-w-2xl, glassmorphism)
      ├── Textarea cours
      ├── Séparateur "OU"
      ├── Zone drop PDF
      ├── [optionnel] Message erreur
      ├── [optionnel] Alerte quota presque épuisé
      └── Bouton CTA principal
```

### Composants détaillés

**H1 — Logo textuel**
- Taille : `text-4xl md:text-5xl font-black tracking-tight`
- "Revise" en blanc, "AI" en `text-violet-400`
- Problème : Pas de logo/icône, identité visuelle faible

**Badge Pro (pill)**
- Style : `bg-violet-500/20 border border-violet-400/50 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full`
- Hover : `hover:bg-violet-500/30`
- Texte : "⚡ Passer au Pro — illimité à 4,99€/mois →"
- Problème : Trop discret, pourrait être plus accrocheur

**Textarea**
- Dimensions : `w-full h-48` (192px de haut)
- Style : `bg-white/5 text-white placeholder-indigo-300 rounded-xl p-4 text-sm resize-none`
- Focus : `focus:ring-2 focus:ring-violet-400`
- Border : `border border-white/10`
- Placeholder : "Colle ton cours ici... (texte, notes, paragraphes)"
- Problème : Pas de compteur de caractères, pas d'indication de longueur idéale

**Zone upload PDF**
- Style : `border-2 border-dashed border-violet-400/50 rounded-xl p-5 text-center cursor-pointer`
- Hover : `hover:border-violet-400 hover:bg-white/5`
- Icône : emoji 📎
- Après sélection : affiche le nom du fichier en `text-violet-300 font-medium`
- Problème : Pas de drag & drop réel (juste un click), zone trop petite (p-5)

**Bouton CTA principal**
- Style normal : `bg-violet-500 hover:bg-violet-400 text-white font-bold py-4 rounded-xl text-lg`
- Active : `active:scale-95`
- Ombre : `shadow-lg shadow-violet-500/30`
- Largeur : `w-full`
- Texte : "✨ Générer mon kit de révision"
- Désactivé (quota) : `disabled:opacity-50 disabled:cursor-not-allowed`
- Problème : Pas d'animation de hover élaborée, manque de punch visuel

**États de chargement**
- Spinner : `w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin`
- Message rotatif : texte animé `animate-pulse` changeant toutes les 1800ms
- Progress bar : `w-full bg-white/10 rounded-full h-2` avec inner `bg-violet-400 animate-pulse` à 70% fixe
- Problème majeur : La progress bar indique toujours 70% — elle devrait progresser

---

## 3. Page `/result` — Résultats

### Structure layout
```
<main> (min-h-screen, px-4 py-8)
  └── <div> (max-w-2xl mx-auto, fade-in animation)
      ├── Header (titre + bouton "Nouveau cours")
      ├── Stats bar (3 cols : Résumé / Flashcards / QCM count)
      ├── Tabs (Résumé / Flashcards / QCM)
      ├── Contenu du tab actif
      ├── Barre d'export (Copier tout + Imprimer)
      └── FeedbackBar
```

### Stats bar
- 3 cartes `bg-white/10 rounded-xl p-3 text-center border border-white/10`
- Valeur : `text-2xl font-black text-white` avec emoji
- Label : `text-indigo-300 text-xs mt-1`
- Problème : "Résumé" affiche toujours "1" — manque d'info utile (ex: nombre de mots)

### Système de tabs
- Tab actif : `bg-violet-500 text-white shadow-lg shadow-violet-500/30`
- Tab inactif : `bg-white/10 text-indigo-300 hover:bg-white/20`
- Style : `flex-1 py-2.5 rounded-xl text-sm font-semibold`
- Problème : Pas d'animation de transition entre tabs (contenu change brusquement)

### Composant SummarySection
- Titre : `text-lg font-bold text-white mb-3`
- Corps résumé : `text-indigo-100 text-sm leading-relaxed`
- Section concepts-clés : liste de pills `bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-400/20`
- Bouton copie résumé : `bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm`

### Composant FlashcardDeck
- **Card flip** : CSS transform 3D avec `perspective`, `rotateY(180deg)` — animation flip
- Dimensions card : `w-full aspect-[3/2]` (ratio 3:2)
- Face avant : `bg-gradient-to-br from-violet-600/30 to-indigo-600/30`
- Face arrière : `bg-gradient-to-br from-emerald-600/20 to-teal-600/20`
- Border : `border border-white/20 rounded-2xl`
- Question : `text-white font-bold text-lg` centré
- Réponse : `text-emerald-300 font-bold text-lg` centré
- Navigation : boutons ← / → + "Je connais ✓"
- Progress : `text-xs text-indigo-400` + barre `bg-violet-400 h-1`
- Bouton "Je connais" : `bg-emerald-500/20 border-emerald-400/30 text-emerald-300`
- Problème : Le flip 3D peut glitcher sur mobile, pas de swipe gesture

### Composant QCMSection
- Question : `text-white font-semibold text-sm mb-4`
- Choix A/B/C/D : boutons `w-full text-left px-4 py-3 rounded-xl text-sm border`
- État neutre : `bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10`
- État correct (après réponse) : `bg-green-500/20 border-green-400/30 text-green-300`
- État incorrect : `bg-red-500/20 border-red-400/30 text-red-300`
- Navigation : bouton "Question suivante →" en violet-500
- Score final : affiché en grand avec emoji 🎯
- Problème : Pas d'animation sur la révélation de la bonne réponse

### Barre d'export
- Deux boutons côte à côte (`flex gap-3`)
- "Copier tout" : `bg-white/10 hover:bg-white/20 border border-white/20`
- "Imprimer/PDF" : `bg-violet-500 hover:bg-violet-400`
- Problème : `window.print()` ne génère pas un beau PDF — manque de styles d'impression @media print

### FeedbackBar
- Container : `bg-white/5 rounded-2xl p-4 border border-white/10`
- Boutons 👍/👎 avec états actifs colorés (green/red)
- Textarea commentaire si 👎 (h-20, même style que textarea principale)
- Stockage : localStorage uniquement (pas d'envoi serveur)
- Problème majeur : Les feedbacks ne sont jamais envoyés à un backend — données perdues si l'user efface son localStorage

---

## 4. Page `/pricing`

### Structure layout
- Grid `grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl`
- Fond identique (dégradé violet)

### Plan Gratuit (carte gauche)
- Style : `bg-white/10 border border-white/20 rounded-2xl p-6`
- Prix : `text-4xl font-black text-white` ("0€")
- Liste features avec ✅/❌ emojis
- Bouton : `border border-white/30 text-white hover:bg-white/10`
- Problème : Le ❌ rouge à côté de "Générations illimitées" n'est pas très vendeur pour un plan gratuit

### Plan Pro (carte droite)
- Style : `bg-violet-500/20 border-2 border-violet-400 rounded-2xl p-6`
- Badge "POPULAIRE" : `absolute top-3 right-3 bg-violet-400 text-white text-xs font-bold px-2 py-1 rounded-full`
- Prix : `text-4xl font-black text-white` ("4,99€")
- Input email : `bg-white/10 text-white placeholder-indigo-400 rounded-xl px-4 py-3 text-sm`
- Bouton CTA : `bg-violet-500 hover:bg-violet-400 text-white font-bold`
- Mention sécurité : `text-indigo-400 text-xs text-center` ("Paiement sécurisé par Stripe")
- Problème : L'email est requis AVANT le paiement — crée une friction inutile (Stripe peut le demander lui-même)

---

## 5. Page `/success`

### États
1. **Loading** : spinner + "Activation de ton accès Pro..."
2. **Succès** : emoji 🎉 + "Tu es Pro !" + email confirmé + bouton retour
3. **Erreur** : emoji ❌ + message + lien retour

### Style succès
- Emoji : `text-6xl mb-4` (centré)
- Titre : `text-3xl font-black text-white`
- Email : `text-violet-300` dans phrase indigo-300
- Bouton : `bg-violet-500 hover:bg-violet-400 font-bold px-8 py-3 rounded-xl`

---

## 6. Problèmes visuels prioritaires à corriger

### CRITIQUE
1. **Pas de font custom** — ajouter Inter ou Geist via next/font pour un rendu premium
2. **Progress bar loading statique** — animer de 0% à 90% sur ~10 secondes
3. **Export PDF** — `window.print()` sans styles d'impression = rendu horrible. Ajouter `@media print` CSS
4. **Feedbacks perdus** — données localStorage jamais envoyées au serveur

### IMPORTANT
5. **Drag & drop PDF** — ajouter onDrop/onDragOver sur la zone d'upload
6. **Compteur caractères textarea** — afficher "XXX / 5000 caractères" sous le textarea
7. **Transitions entre tabs** — ajouter fade ou slide sur le contenu
8. **Mobile flashcard** — ajouter swipe left/right avec touch events

### NICE TO HAVE
9. **Favicon** — aucun favicon défini
10. **Meta OG tags** — pas de tags Open Graph pour le partage social
11. **Logo** — juste du texte actuellement, une icône SVG simple renforcerait la marque
12. **Dark/light mode** — non supporté, tout est dark forcé
13. **Animation de hover** sur les cards (léger scale ou glow)

---

## 7. Stack CSS utilisée

- **Tailwind CSS 3.3** — utility-first, pas de CSS modules
- **Glassmorphism** : `bg-white/10 backdrop-blur-md border border-white/20`
- **CSS custom** : uniquement `globals.css` (reset Tailwind standard, pas de custom classes)
- **Animations custom** : uniquement les animations Tailwind standard (spin, pulse, bounce)
- Pas de Framer Motion, pas d'Anime.js

---

## 8. Responsive

- **Breakpoint unique utilisé** : `md:` (768px+)
- Page principale : 1 colonne toujours (card max-w-2xl centrée)
- Pricing : `grid-cols-1 md:grid-cols-2`
- Stats bar résultats : toujours 3 colonnes (`grid-cols-3`) — peut déborder sur très petit écran
- Problème : Pas de breakpoint `sm:` utilisé, les stats bar peuvent être trop serrées sur iPhone SE (375px)
