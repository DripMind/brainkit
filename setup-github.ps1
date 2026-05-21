# =============================================================
# ReviseAI — Setup GitHub (PowerShell)
# Glisse ce fichier dans le dossier revise-ai et double-clique
# =============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ReviseAI — Création du repo GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifie que git est installé
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé." -ForegroundColor Red
    Write-Host "   Télécharge-le sur https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Appuie sur Entrée pour quitter"
    exit 1
}

# Vérifie que gh (GitHub CLI) est installé
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  GitHub CLI (gh) n'est pas installé." -ForegroundColor Yellow
    Write-Host "   Télécharge-le sur https://cli.github.com" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Sinon, voici les commandes manuelles à faire :" -ForegroundColor White
    Write-Host ""
    Write-Host "   1. Va sur https://github.com/new" -ForegroundColor Green
    Write-Host "   2. Crée un repo nommé 'revise-ai' (privé ou public)" -ForegroundColor Green
    Write-Host "   3. Copie l'URL du repo (ex: https://github.com/TonPseudo/revise-ai.git)" -ForegroundColor Green
    Write-Host "   4. Dans ce dossier, lance ces commandes :" -ForegroundColor Green
    Write-Host ""
    Write-Host "      git init" -ForegroundColor White
    Write-Host "      git add ." -ForegroundColor White
    Write-Host "      git commit -m 'Initial commit — ReviseAI V0'" -ForegroundColor White
    Write-Host "      git branch -M main" -ForegroundColor White
    Write-Host "      git remote add origin https://github.com/TonPseudo/revise-ai.git" -ForegroundColor White
    Write-Host "      git push -u origin main" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuie sur Entrée pour quitter"
    exit 0
}

# GitHub CLI disponible — procédure automatique
Write-Host "✅ GitHub CLI détecté." -ForegroundColor Green
Write-Host ""

# Vérifie la connexion GitHub
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Connexion à GitHub requise..." -ForegroundColor Yellow
    gh auth login
}

Write-Host ""
$repoName = Read-Host "Nom du repo GitHub (défaut: revise-ai)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "revise-ai" }

$visibility = Read-Host "Visibilité : public ou private ? (défaut: private)"
if ([string]::IsNullOrWhiteSpace($visibility)) { $visibility = "private" }

Write-Host ""
Write-Host "📦 Initialisation Git..." -ForegroundColor Cyan

# Init git si pas déjà fait
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

# Ajoute un .gitignore si manquant
if (-not (Test-Path ".gitignore")) {
    @"
node_modules/
.next/
.env.local
.env*.local
*.log
.DS_Store
"@ | Out-File -Encoding utf8 ".gitignore"
    Write-Host "✅ .gitignore créé" -ForegroundColor Green
}

git add .
git commit -m "Initial commit — ReviseAI V0" 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit --allow-empty -m "Initial commit — ReviseAI V0"
}

Write-Host ""
Write-Host "🚀 Création du repo GitHub '$repoName' ($visibility)..." -ForegroundColor Cyan

gh repo create $repoName --$visibility --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Repo créé et code pushé !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    $repoUrl = gh repo view --json url -q ".url" 2>$null
    if ($repoUrl) {
        Write-Host "🔗 URL du repo : $repoUrl" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "👉 Prochaine étape : connecte ce repo sur Netlify" -ForegroundColor Yellow
    Write-Host "   https://app.netlify.com/start" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de la création. Vérifie ta connexion GitHub." -ForegroundColor Red
}

Write-Host ""
Read-Host "Appuie sur Entrée pour fermer"
