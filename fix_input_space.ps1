# fix_input_space.ps1
# Corrige automaticamente entradas sem espaço usando contexto do projeto Nutri 4.0
# Uso: .\fix_input_space.ps1 "analiseodiretorio" → retorna "analise o diretorio"

param([string]$rawInput)

if ([string]::IsNullOrWhiteSpace($rawInput)) {
    Write-Error "Entrada vazia. Use: .\fix_input_space.ps1 'texto_colado'"
    exit 1
}

# Dicionário de palavras-chave do projeto (baseado em seus arquivos)
$keywords = @(
    "analise", "diretorio", "verificar", "status", "usuario", "paciente", "nutricionista",
    "backend", "frontend", "deploy", "fix", "check", "diagnostic", "audit", "correcao",
    "bordas", "cards", "vps", "docker", "nginx", "sqlite", "csv", "api", "login",
    "build", "test", "lint", "ollama", "ia", "relatorio", "script", "config", "env"
)

# Heurística simples: insere espaço antes de palavras-chave conhecidas
function SplitOnKeywords {
    param([string]$text, [string[]]$kwds)
    $result = $text
    foreach ($kw in $kwds) {
        # Substitui "palavra1palavra2" por "palavra1 palavra2" se palavra2 está na lista
        $pattern = "(?<=\w)($kw)"
        $result = $result -replace $pattern, " $kw"
    }
    return $result
}

# Passo 1: tentativa simples com separação por maiúsculas (CamelCase)
$fixed = $rawInput -replace '([a-z])([A-Z])', '$1 $2' `
                     -replace '([A-Z])([A-Z][a-z])', '$1 $2'

# Passo 2: usar keywords do projeto
$fixed = SplitOnKeywords -text $fixed -kwds $keywords

# Passo 3: limpeza final
$fixed = $fixed -replace '\s+', ' '  # múltiplos espaços → 1
$fixed = $fixed.Trim()

Write-Host "✅ Correção aplicada:" -ForegroundColor Green
Write-Host "Original : '$rawInput'" -ForegroundColor DarkGray
Write-Host "Corrigido: '$fixed'" -ForegroundColor Cyan

# Exporta para variável global para uso imediato (se necessário)
$global:LAST_FIXED_INPUT = $fixed