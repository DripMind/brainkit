# ============================================================
# ReviseAI — Script de setup (Windows PowerShell)
# Si le script se ferme trop vite, lance-le ainsi :
#   1. Ouvre PowerShell (Win+R > powershell > Entrée)
#   2. Tape : Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#   3. Puis : cd "C:\chemin\vers\revise-ai"
#   4. Puis : .\setup.ps1
# ============================================================

# Forcer la fenêtre à rester ouverte même en cas d'erreur
$ErrorActionPreference = "Continue"

# Changer le dossier courant vers là où se trouve le script
Set-Location -Path $PSScriptRoot

Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     ReviseAI - Setup automatique       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Vérifier Git ──────────────────────────────────────────
Write-Host "[1/5] Verification de Git..." -ForegroundColor Yellow
$gitOk = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitOk) {
    Write-Host "  ERREUR : Git n'est pas installe." -ForegroundColor Red
    Write-Host "  Telecharge-le : https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuie sur Entree pour fermer"
    exit 1
}
Write-Host "  OK : $(git --version)" -ForegroundColor Green

# ── 2. Vérifier Node ─────────────────────────────────────────
Write-Host "[2/5] Verification de Node.js..." -ForegroundColor Yellow
$nodeOk = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeOk) {
    Write-Host "  ERREUR : Node.js n'est pas installe." -ForegroundColor Red
    Write-Host "  Telecharge-le : https://nodejs.org" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuie sur Entree pour fermer"
    exit 1
}
Write-Host "  OK : $(node --version)" -ForegroundColor Green

# ── 3. Clés API ──────────────────────────────────────────────
Write-Host ""
Write-Host "[3/5] Configuration des cles API" -ForegroundColor Yellow
Write-Host "  Mistral  (gratuit) : https://console.mistral.ai  > API Keys" -ForegroundColor Gray
Write-Host "  Gemini   (gratuit) : https://aistudio.google.com > Get API Key" -ForegroundColor Gray
Write-Host "  (Appuie Entree pour passer si tu n'as pas encore les cles)" -ForegroundColor Gray
Write-Host ""

$mistralKey = Read-Host "  Cle Mistral (MISTRAL_API_KEY)"
$geminiKey  = Read-Host "  Cle Gemini  (GEMINI_API_KEY)"

$envContent = ""
if ($mistralKey.Trim() -ne "") { $envContent += "MISTRAL_API_KEY=$($mistralKey.Trim())`n" }
if ($geminiKey.Trim() -ne "")  { $envContent += "GEMINI_API_KEY=$($geminiKey.Trim())`n" }

if ($envContent -ne "") {
    Set-Content -Path ".env.local" -Value $envContent.TrimEnd() -Encoding UTF8
    Write-Host "  OK : .env.local cree" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION : Aucune cle entree. Cree .env.local manuellement." -ForegroundColor Yellow
}

# ── 4. npm install ───────────────────────────────────────────
Write-Host ""
Write-Host "[4/5] Installation des dependances npm..." -ForegroundColor Yellow
Write-Host "  (Cela peut prendre 1-2 minutes)" -ForegroundColor Gray

npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERREUR lors de npm install (code $LASTEXITCODE)" -ForegroundColor Red
    Read-Host "Appuie sur Entree pour fermer"
    exit 1
}
Write-Host "  OK : dependances installees" -ForegroundColor Green

# ── 5. Git init + commit ─────────────────────────────────────
Write-Host ""
Write-Host "[5/5] Initialisation du repo Git..." -ForegroundColor Yellow

git init 2>&1 | Out-Null
git add . 2>&1 | Out-Null
git commit -m "feat: ReviseAI V0 - Mistral + Gemini fallback" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK : Commit initial cree" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION : Probleme avec git commit (peut-etre deja initialise)" -ForegroundColor Yellow
}

# ── Résumé final ─────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP TERMINE avec succes !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROCHAINE ETAPE - Repo GitHub :" -ForegroundColor White
Write-Host "  1. Va sur : https://github.com/new" -ForegroundColor Gray
Write-Host "  2. Nom : revise-ai  |  NE coche PAS 'Add README'" -ForegroundColor Gray
Write-Host "  3. Cree le repo, puis copie les 2 commandes git affichees" -ForegroundColor Gray
Write-Host ""
Write-Host "PROCHAINE ETAPE - Netlify (gratuit) :" -ForegroundColor White
Write-Host "  1. Va sur : https://app.netlify.com/start" -ForegroundColor Gray
Write-Host "  2. Deploy with GitHub > selectionne revise-ai" -ForegroundColor Gray
Write-Host "  3. Ajoute MISTRAL_API_KEY et GEMINI_API_KEY dans les variables" -ForegroundColor Gray
Write-Host "  4. Clique Deploy > en ligne en 2 minutes" -ForegroundColor Gray
Write-Host ""

$launch = Read-Host "Lancer le serveur local maintenant ? (o/n)"
if ($launch -eq "o" -or $launch -eq "O") {
    Write-Host ""
    Write-Host "Lancement sur http://localhost:3000 ..." -ForegroundColor Green
    Write-Host "(Ctrl+C pour arreter)" -ForegroundColor Gray
    npm run dev
} else {
    Write-Host ""
    Write-Host "Pour lancer plus tard : npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Appuie sur Entree pour fermer"
}
