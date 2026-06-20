# FolioForge - Push to GitHub
# Double-click this file or run in PowerShell

Set-Location $PSScriptRoot

# Remove broken .git if exists
if (Test-Path ".git") {
    Write-Host "Removing old .git folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}

# Init git
git init
git branch -M main

# Set remote
git remote add origin https://github.com/piyawat211149-commits/FolioForge.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: FolioForge portfolio builder"

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Done! Check https://github.com/piyawat211149-commits/FolioForge" -ForegroundColor Green
Read-Host "Press Enter to close"
