# Script simples para aplicar correção no VPS
$VPS_HOST = "187.77.32.191"
$VPS_USER = "root"
$VPS_PASSWORD = "900113Acps@senharoot"
$REMOTE_PATH = "/root/nutrixpertpro"

Write-Host "========================================"
Write-Host "Aplicando correção do CSS no VPS..."
Write-Host "========================================"

# Copiar arquivo via método simples - usar base64
Write-Host "1. Copiando arquivo nginx.vps.conf..."

$content = Get-Content "nginx.vps.conf" -Raw

# Criar sessão SSH
$secpasswd = ConvertTo-SecureString $VPS_PASSWORD -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($VPS_USER, $secpasswd)

$session = New-PSSession -ComputerName $VPS_HOST -Credential $credential

# Copiar conteúdo do arquivo
Invoke-Command -Session $session -ScriptBlock {
    param($path, $content)
    Set-Content -Path $path -Value $content -Force
} -ArgumentList "$REMOTE_PATH/nginx.vps.conf", $content

Remove-PSSession $session

Write-Host "Arquivo copiado!"

# Reiniciar nginx
Write-Host "2. Reiniciando nginx..."

$session = New-PSSession -ComputerName $VPS_HOST -Credential $credential
$containerId = Invoke-Command -Session $session -ScriptBlock { docker ps -q --filter name=nginx }

if ($containerId) {
    Write-Host "Container encontrado: $containerId"
    Invoke-Command -Session $session -ScriptBlock { param($id) docker restart $id } -ArgumentList $containerId
    Write-Host "Container reiniciado!"
} else {
    Write-Host "Tentando reiniciar nginx diretamente..."
    Invoke-Command -Session $session -ScriptBlock { nginx -s reload }
    Write-Host "Nginx recarregado!"
}

Remove-PSSession $session

Write-Host "========================================"
Write-Host "Correção aplicada!"
Write-Host "========================================"
Write-Host ""
Write-Host "Acesse: https://srv1354256.hstgr.cloud/patient-dashboard-v2"
