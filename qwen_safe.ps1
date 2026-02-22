# qwen_safe.ps1
# Correção para o problema de espaços ao digitar no PowerShell com Qwen Code
# Uso: .\qwen_safe.ps1   → ou adicione como alias permanente (veja instruções abaixo)

param(
    [string]$InputText = $null
)

# Se input foi passado via argumento, usa direto
if ($InputText) {
    Write-Host "Enviando para Qwen (input direto):" -ForegroundColor Green
    Write-Host ">>> '$InputText'" -ForegroundColor DarkGray
    python -m qwen.code --input "$InputText"
    exit
}

# Caso contrário: modo interativo com preservação de espaços
Write-Host "Qwen Code — Modo seguro (espaços preservados)" -ForegroundColor Cyan
Write-Host "Digite sua mensagem. Pressione Enter em linha vazia para enviar." -ForegroundColor Yellow

$lines = @()
while ($true) {
    $line = Read-Host
    if ([string]::IsNullOrWhiteSpace($line)) {
        break
    }
    $lines += $line
}

$inputText = $lines -join "`n"
if ([string]::IsNullOrWhiteSpace($inputText)) {
    Write-Host "Nenhuma entrada fornecida." -ForegroundColor Red
    exit 1
}

Write-Host "Enviando para Qwen:" -ForegroundColor Green
Write-Host ">>> '$inputText'" -ForegroundColor DarkGray

# Executa o Qwen real, passando o texto exatamente como digitado
python -m qwen.code --input "$inputText"