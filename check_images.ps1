# Simple script to check if original and multiplier images are the same files

# Get file properties
try {
    $originalLogo = Get-Item "assets\logo.png"
    $multiplierLogo = Get-Item "assets\multiplier logo.png"
    $originalBanner = Get-Item "assets\banner.png"
    $multiplierBanner = Get-Item "assets\multiplier banner.png"

    # Display file sizes
    Write-Host "File Size Comparison:
==================="
    Write-Host "Original Logo: $($originalLogo.Length) bytes"
    Write-Host "Multiplier Logo: $($multiplierLogo.Length) bytes"
    Write-Host "Original Banner: $($originalBanner.Length) bytes"
    Write-Host "Multiplier Banner: $($multiplierBanner.Length) bytes"
    Write-Host ""

    # Check if files are identical
    if ($originalLogo.Length -eq $multiplierLogo.Length) {
        Write-Host "❌ WARNING: Original logo and multiplier logo have the same file size!"
        Write-Host "They might be identical files or very similar files."
    } else {
        Write-Host "✅ Original logo and multiplier logo have different file sizes."
    }
    
    if ($originalBanner.Length -eq $multiplierBanner.Length) {
        Write-Host "❌ WARNING: Original banner and multiplier banner have the same file size!"
        Write-Host "They might be identical files or very similar files."
    } else {
        Write-Host "✅ Original banner and multiplier banner have different file sizes."
    }
} catch {
    Write-Host "Error: Could not find one or more image files."
    Write-Host "Make sure all image files exist in the assets folder."
}