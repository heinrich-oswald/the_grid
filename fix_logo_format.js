const fs = require('fs');

// Read the current SVG content from logo files
const logoSvg = fs.readFileSync('assets/logo.png', 'utf8');
const bannerSvg = fs.readFileSync('assets/banner.png', 'utf8');

console.log('Current logo.png content preview:', logoSvg.substring(0, 100));
console.log('Current banner.png content preview:', bannerSvg.substring(0, 100));

// Create proper SVG files with correct extensions
fs.writeFileSync('assets/logo.svg', logoSvg);
fs.writeFileSync('assets/banner.svg', bannerSvg);

console.log('Created proper SVG files: logo.svg and banner.svg');

// Create simple placeholder PNG-like content using data URLs
// For now, let's create simple colored rectangles as PNG data URLs

function createSimplePngDataUrl(width, height, color, text) {
    const canvas = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${color}" rx="10"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white" dy="0.3em">${text}</text>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + Buffer.from(canvas).toString('base64');
}

// Create a simple HTML file that embeds the logos as data URLs
const htmlWithEmbeddedLogos = `<!DOCTYPE html>
<html>
<head><title>Logo Test</title></head>
<body style="background: #0b0a09; color: white; padding: 20px;">
    <h1>Embedded Logo Test</h1>
    <div>
        <h3>Original Logo (Data URL)</h3>
        <img src="${createSimplePngDataUrl(200, 100, '#4bb47e', 'THE GRID')}" alt="Logo" style="border: 2px solid white;">
    </div>
    <div>
        <h3>Original Banner (Data URL)</h3>
        <img src="${createSimplePngDataUrl(400, 100, '#0088ff', 'THE GRID BANNER')}" alt="Banner" style="border: 2px solid white;">
    </div>
</body>
</html>`;

fs.writeFileSync('embedded_logo_test.html', htmlWithEmbeddedLogos);

// Let's try a different approach - create actual binary PNG-like files
// We'll use the team event logos (which are proper PNGs) as templates

if (fs.existsSync('assets/team event logo.png')) {
    console.log('Copying team event logo as temporary fix...');
    
    // Check if team event logo is a proper PNG
    const teamEventLogo = fs.readFileSync('assets/team event logo.png');
    const teamEventBanner = fs.readFileSync('assets/team event banner.png');
    
    console.log('Team event logo first 10 bytes:', Array.from(teamEventLogo.slice(0, 10)));
    console.log('Team event banner first 10 bytes:', Array.from(teamEventBanner.slice(0, 10)));
    
    // If team event files are proper PNGs (start with PNG signature), use them temporarily
    if (teamEventLogo[0] === 137 && teamEventLogo[1] === 80 && teamEventLogo[2] === 78 && teamEventLogo[3] === 71) {
        console.log('Team event logo is a proper PNG, using it as original logo temporarily');
        fs.copyFileSync('assets/team event logo.png', 'assets/logo_temp.png');
        fs.copyFileSync('assets/team event banner.png', 'assets/banner_temp.png');
        
        // Replace the main files
        fs.copyFileSync('assets/logo_temp.png', 'assets/logo.png');
        fs.copyFileSync('assets/banner_temp.png', 'assets/banner.png');
        
        console.log('Temporarily replaced logo.png and banner.png with working PNG files');
    } else {
        console.log('Team event files also contain SVG content');
    }
}

console.log('Fix attempt completed. Check embedded_logo_test.html for data URL test.');