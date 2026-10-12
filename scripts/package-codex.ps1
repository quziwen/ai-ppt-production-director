param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutDir = ""
)
$ErrorActionPreference = "Stop"
$repo = (Resolve-Path -LiteralPath $RepoRoot).Path
if ([string]::IsNullOrWhiteSpace($OutDir)) { $OutDir = Join-Path $repo "dist\codex\ai-ppt-production-director" }
$target = [IO.Path]::GetFullPath($OutDir)
if (Test-Path -LiteralPath $target) { throw "Output already exists; choose a NEW directory: $target" }
$documents = @("SKILL.md","VERSION","README.md","LICENSE","DELIVERY.md","CHANGELOG.md","TESTING.md","RELEASE_VALIDATION.md","PUBLISHING.md","OPTIONAL_TOOLS.md","CONTRIBUTING.md","SECURITY.md","BETA_TESTING.md")
foreach ($name in $documents) {
    if (-not (Test-Path -LiteralPath (Join-Path $repo $name))) { throw "Missing release document: $name" }
}
New-Item -ItemType Directory -Path $target | Out-Null
foreach ($name in $documents) { Copy-Item -LiteralPath (Join-Path $repo $name) -Destination (Join-Path $target $name) }
foreach ($name in @("references","core","adapters","assets","examples","research")) {
    Copy-Item -LiteralPath (Join-Path $repo $name) -Destination (Join-Path $target $name) -Recurse
}
New-Item -ItemType Directory -Path (Join-Path $target "scripts") | Out-Null
Get-ChildItem -LiteralPath (Join-Path $repo "scripts") -Filter "*.cjs" -File |
    ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $target "scripts") }
Copy-Item -LiteralPath $PSCommandPath -Destination (Join-Path $target "scripts\package-codex.ps1")
Write-Output $target
