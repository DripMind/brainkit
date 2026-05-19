# ============================================================
# ReviseAI — Script de setup automatique (Windows PowerShell)
# Double-clic ou : clic droit > "Exécuter avec PowerShell"
# ============================================================

Write-Host ""
Write-Host "╔══════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     ReviseAI — Setup Auto        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé." -ForegroundColor Red
    Write-Host "   Télécharge-le ici : https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Appuie sur Entrée pour quitter"
    exit 1
}

# 2. Vérifier Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé." -ForegroundColor Red
    Write-Host "   Télécharge-le ici : https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Appuie sur Entrée pour quitter"
    exit 1
}

Write-Host "✅ Git et Node détectés" -ForegroundColor Green

# 3. Clés API
Write-Host ""
Write-Host "🔑 Entre tes clés API (appuie Entrée pour passer)" -ForegroundColor Yellow
Write-Host "   Mistral  : https://console.mistral.ai  > API Keys" -ForegroundColor Gray
Write-Host "   Gemini   : https://aistudio.google.com > Get API Key" -ForegroundColor Gray
Write-Host ""

$mistralKey = Read-Host "Clé Mistral (MISTRAL_API_KEY)"
$geminiKey  = Read-Host "Clé Gemini  (GEMINI_API_KEY)"

# 4. Créer .env.local
$envContent = ""
if ($mistralKey) { $envContent += "MISTRAL_API_KEY=$mistralKey`n" }
if ($geminiKey)  { $envContent += "GEMINI_API_KEY=$geminiKey`n" }

if ($envContent) {
    Set-Content -Path ".env.local" -Value $envContent.TrimEnd()
    Write-Host "✅ Fichier .env.local créé" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aucune clé entrée — crée .env.local manuellement avant de lancer." -ForegroundColor Yellow
}

# 5. npm install
Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur npm install" -ForegroundColor Red
    Read-Host "Appuie sur Entrée pour quitter"
    exit 1
}
Write-Host "✅ Dépendances installées" -ForegroundColor Green

# 6. Git init + commit
Write-Host ""
Write-Host "🐙 Initialisation du repo Git..." -ForegroundColor Cyan
git init
git add .
git commit -m "feat: ReviseAI V0 — Mistral + Gemini fallback"
Write-Host "✅ Commit initial créé" -ForegroundColor Green

# 7. Instructions GitHub
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  PROCHAINE ÉTAPE : Créer ton repo GitHub" -ForegroundColor White
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Va sur : https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repo : revise-ai" -ForegroundColor White
Write-Host "3. Visibilité : Public ou Private (au choix)" -ForegroundColor White
Write-Host "4. NE coche PAS 'Add a README'" -ForegroundColor Yellow
Write-Host "5. Clique 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Ensuite, GitHub te donnera 2 commandes." -ForegroundColor Gray
Write-Host "Lance-les ici (remplace TON_USERNAME) :" -ForegroundColor Gray
Write-Host ""
Write-Host "  git remote add origin https://github.com/TON_USERNAME/revise-ai.git" -ForegroundColor Green
Write-Host "  git push -u origin main" -ForegroundColor Green
Write-Host ""

# 8. Lancer en local ?
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
$launch = Read-Host "Veux-tu lancer le serveur local maintenant ? (o/n)"
if ($launch -eq "o" -or $launch -eq "O") {
    Write-Host ""
    Write-Host "🚀 Lancement sur http://localhost:3000 ..." -ForegroundColor Green
    npm run dev
}
