# Script para organizar as imagens da Sarambi
# Execute no PowerShell: .\setup-imagens.ps1

param(
    [string]$PastaOrigem = ""
)

$destino = "$PSScriptRoot\public\images"

if (-not $PastaOrigem) {
    Write-Host "== Sarambi Intimates - Organizador de Imagens ==" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Informe a pasta onde estao suas fotos da Sarambi:"
    $PastaOrigem = Read-Host "Caminho da pasta"
}

if (-not (Test-Path $PastaOrigem)) {
    Write-Host "Pasta nao encontrada: $PastaOrigem" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Imagens encontradas em: $PastaOrigem" -ForegroundColor Green
$imagens = Get-ChildItem $PastaOrigem -Include "*.jpg","*.jpeg","*.png","*.webp" -Recurse | Sort-Object Length -Descending

$i = 1
foreach ($img in $imagens) {
    Write-Host "  [$i] $($img.Name) ($([math]::Round($img.Length/1KB)) KB)"
    $i++
}

Write-Host ""
Write-Host "As imagens serao copiadas para: $destino" -ForegroundColor Yellow
Write-Host "Renomeie as imagens conforme o arquivo LEIA-ME.txt em public/images/"
Write-Host ""
Write-Host "Abrindo a pasta destino para voce copiar manualmente..."
Start-Process explorer.exe $destino
