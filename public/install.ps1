# Floci CLI Windows installer
# Usage: iwr https://floci.io/install.ps1 | iex

[CmdletBinding()]
param(
    [string]$Version = "latest",
    [string]$InstallDir = "$env:LOCALAPPDATA\floci\bin"
)

$ErrorActionPreference = "Stop"
$Repo = "floci-io/floci-cli"

function Get-LatestVersion {
    $response = Invoke-RestMethod "https://api.github.com/repos/$Repo/releases/latest"
    return $response.tag_name
}

function Main {
    Write-Host "Installing Floci CLI..." -ForegroundColor Cyan

    if ($Version -eq "latest") {
        $Version = Get-LatestVersion
    }

    $Arch = if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq "Arm64") { "arm64" } else { "amd64" }
    $Platform = "windows-$Arch"
    $FileName = "floci-$Platform.exe"
    $DownloadUrl = "https://github.com/$Repo/releases/download/$Version/$FileName"

    Write-Host "Downloading floci $Version for $Platform..."

    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    }

    $Destination = Join-Path $InstallDir "floci.exe"
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $Destination -UseBasicParsing

    # Add to PATH if not already there
    $CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($CurrentPath -notlike "*$InstallDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$InstallDir", "User")
        Write-Host "Added $InstallDir to user PATH (restart your terminal)"
    }

    Write-Host ""
    Write-Host "Floci CLI $Version installed to $Destination" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick start:"
    Write-Host "  floci start"
    Write-Host "  floci doctor"
    Write-Host '  $env:AWS_ENDPOINT_URL="http://localhost:4566"'
    Write-Host "  aws s3 mb s3://my-bucket"
}

Main
