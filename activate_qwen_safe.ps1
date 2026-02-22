# activate_qwen_safe.ps1
# Executar este script para habilitar o alias 'qwen' seguro nesta sessão do PowerShell

Write-Host "✅ Habilitando alias 'qwen' seguro (espaços preservados)..." -ForegroundColor Green

function qwen {
    param([string]$InputObject)
    if ($InputObject) {
        & "$PSScriptRoot\qwen_safe.ps1" -InputText $InputObject
    } else {
        & "$PSScriptRoot\qwen_safe.ps1"
    }
}

Set-Alias -Name qwen -Value qwen -Force
Write-Host "✔️ Alias 'qwen' configurado. Use: qwen" -ForegroundColor Cyan