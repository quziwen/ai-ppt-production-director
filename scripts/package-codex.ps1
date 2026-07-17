param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutDir)) {
    $OutDir = Join-Path $RepoRoot "dist\codex\ai-ppt-production-director"
}

$codexAdapter = Join-Path $RepoRoot "adapters\codex\SKILL.md"
$coreDir = Join-Path $RepoRoot "core"
$referencesDir = Join-Path $OutDir "references"

if (-not (Test-Path -LiteralPath $codexAdapter)) {
    throw "Missing Codex adapter: $codexAdapter"
}

if (-not (Test-Path -LiteralPath $coreDir)) {
    throw "Missing core directory: $coreDir"
}

Remove-Item -LiteralPath $OutDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $referencesDir | Out-Null

$skillText = Get-Content -LiteralPath $codexAdapter -Raw
$skillText = $skillText.Replace("../../core/", "references/")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $OutDir "SKILL.md"), $skillText, $utf8NoBom)

Get-ChildItem -LiteralPath $coreDir -Filter "*.md" | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $referencesDir $_.Name)
}

Write-Host "Packaged Codex skill:"
Write-Host $OutDir
