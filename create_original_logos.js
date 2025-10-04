const fs = require('fs');

// Create original logo SVG (different from team event)
const originalLogoSVG = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0088ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8800ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#logoGrad)" rx="20"/>
  <text x="100" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">THE</text>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">GRID</text>
  <circle cx="100" cy="140" r="3" fill="white"/>
  <circle cx="110" cy="140" r="3" fill="white"/>
  <circle cx="120" cy="140" r="3" fill="white"/>
  <circle cx="90" cy="140" r="3" fill="white"/>
  <circle cx="80" cy="140" r="3" fill="white"/>
</svg>`;

// Create original banner SVG (different from team event)
const originalBannerSVG = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
      <stop offset="25%" style="stop-color:#0088ff;stop-opacity:1" />
      <stop offset="75%" style="stop-color:#8800ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff0088;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="200" fill="url(#bannerGrad)" rx="10"/>
  <text x="400" y="80" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">THE GRID</text>
  <text x="400" y="120" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white">COMPETITIVE GAMING PLATFORM</text>
  <g transform="translate(50, 150)">
    <circle cx="0" cy="0" r="4" fill="white" opacity="0.8"/>
    <circle cx="20" cy="0" r="4" fill="white" opacity="0.6"/>
    <circle cx="40" cy="0" r="4" fill="white" opacity="0.4"/>
    <circle cx="60" cy="0" r="4" fill="white" opacity="0.2"/>
  </g>
  <g transform="translate(690, 150)">
    <circle cx="0" cy="0" r="4" fill="white" opacity="0.2"/>
    <circle cx="20" cy="0" r="4" fill="white" opacity="0.4"/>
    <circle cx="40" cy="0" r="4" fill="white" opacity="0.6"/>
    <circle cx="60" cy="0" r="4" fill="white" opacity="0.8"/>
  </g>
</svg>`;

// Function to convert SVG to PNG-like data URL
function svgToPngDataUrl(svgContent) {
    const base64 = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

// Create PNG files with SVG content (browsers will render SVG as images)
function createPngFromSvg(svgContent, filename) {
    // For web compatibility, we'll save as SVG but with .png extension
    // This works because browsers can display SVG content as images
    fs.writeFileSync(filename, svgContent);
    console.log(`Created ${filename}`);
}

// Backup current files first
console.log('Backing up current logo files...');
if (fs.existsSync('assets/logo.png')) {
    fs.copyFileSync('assets/logo.png', 'assets/logo_backup_team_event.png');
    console.log('Backed up logo.png to logo_backup_team_event.png');
}
if (fs.existsSync('assets/banner.png')) {
    fs.copyFileSync('assets/banner.png', 'assets/banner_backup_team_event.png');
    console.log('Backed up banner.png to banner_backup_team_event.png');
}

// Create new original logos
console.log('Creating new original logos...');
createPngFromSvg(originalLogoSVG, 'assets/original_logo.png');
createPngFromSvg(originalBannerSVG, 'assets/original_banner.png');

// Replace the main logo files with original versions
fs.copyFileSync('assets/original_logo.png', 'assets/logo.png');
fs.copyFileSync('assets/original_banner.png', 'assets/banner.png');

console.log('Successfully created original logos and updated main logo files!');
console.log('');
console.log('Current logo setup:');
console.log('- logo.png & banner.png: Original logos for regular pages');
console.log('- team event logo.png & team event banner.png: Team event logos');
console.log('- multiplier logo.png & multiplier banner.png: Team event logos (for multiplier.html)');
console.log('');
console.log('Backup files created:');
console.log('- logo_backup_team_event.png: Previous team event logo');
console.log('- banner_backup_team_event.png: Previous team event banner');