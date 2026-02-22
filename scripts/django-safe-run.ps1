# django-safe-run.ps1
# Corrige typos comuns em comandos Django e executa com segurança

param(
    [string]$Command = "runserver"
)

$corrected = $Command.ToLower()
if ($corrected -eq "runsever") {
    Write-Host "⚠️  Corrigindo typo: 'runsever' → 'runserver'" -ForegroundColor Yellow
    $corrected = "runserver"
} elseif ($corrected -eq "runsrv" -or $corrected -eq "run-srv") {
    Write-Host "⚠️  Corrigindo: '$Command' → 'runserver'" -ForegroundColor Yellow
    $corrected = "runserver"
}

Write-Host "🚀 Executando: python manage.py $corrected" -ForegroundColor Green

# Verifica se estamos no diretório backend
if (-Not (Test-Path "backend\manage.py")) {
    Write-Error "❌ manage.py não encontrado. Execute este script na raiz do projeto (C:\Nutri 4.0)"
    exit 1
}

Set-Location -Path "backend"
try {
    python manage.py $corrected
} catch {
    Write-Error "❌ Falha ao executar: python manage.py $corrected"
    Write-Error $_
} finally {
    Set-Location -Path ".."
}