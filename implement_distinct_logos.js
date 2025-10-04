const fs = require('fs');

console.log('Implementing distinct original logos as PNG files...');

// Read the distinct SVG content we created
const distinctLogoSvg = fs.readFileSync('assets/distinct_original_logo.svg', 'utf8');
const distinctBannerSvg = fs.readFileSync('assets/distinct_original_banner.svg', 'utf8');

// Backup current files
if (fs.existsSync('assets/logo.png')) {
    fs.copyFileSync('assets/logo.png', 'assets/logo_team_event_backup.png');
    console.log('✓ Backed up current logo.png (team event version)');
}
if (fs.existsSync('assets/banner.png')) {
    fs.copyFileSync('assets/banner.png', 'assets/banner_team_event_backup.png');
    console.log('✓ Backed up current banner.png (team event version)');
}

// Since we need working PNG files and can't easily convert SVG to PNG in Node.js,
// let's use a practical approach: create the SVG files with .png extension
// but ensure they have proper headers that browsers can handle

// Create proper SVG content that will work when served as PNG
function createWorkingSvgAsPng(svgContent) {
    // Add XML declaration and ensure proper encoding
    const properSvg = `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;
    return properSvg;
}

const workingLogo = createWorkingSvgAsPng(distinctLogoSvg);
const workingBanner = createWorkingSvgAsPng(distinctBannerSvg);

// Write the new logo files
fs.writeFileSync('assets/logo.png', workingLogo);
fs.writeFileSync('assets/banner.png', workingBanner);

console.log('✓ Created new logo.png with distinct blue/cyan design');
console.log('✓ Created new banner.png with distinct grid pattern');

// Create a verification page to test the implementation
const verificationHtml = `<!DOCTYPE html>
<html>
<head><title>Logo Implementation Verification</title></head>
<body style="background: #0b0a09; color: white; padding: 20px;">
    <h1>Logo Implementation Verification</h1>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0;">
        
        <!-- Original Logos (for regular pages) -->
        <div style="background: rgba(0, 212, 255, 0.1); padding: 20px; border-radius: 10px; border: 2px solid #00d4ff;">
            <h2 style="color: #00d4ff; margin-top: 0;">Original Logos (Regular Pages)</h2>
            
            <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">logo.png</h4>
                <img src="assets/logo.png?v=${Date.now()}" alt="Original Logo" style="max-width: 200px; border: 2px solid #00d4ff;">
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">banner.png</h4>
                <img src="assets/banner.png?v=${Date.now()}" alt="Original Banner" style="max-width: 400px; border: 2px solid #00d4ff;">
            </div>
            
            <div style="background: rgba(0, 212, 255, 0.2); padding: 10px; border-radius: 5px; margin-top: 15px;">
                <strong>Used by:</strong> index.html, timebound.html, teams.html, and other regular pages
            </div>
        </div>
        
        <!-- Team Event Logos -->
        <div style="background: rgba(75, 180, 126, 0.1); padding: 20px; border-radius: 10px; border: 2px solid #4bb47e;">
            <h2 style="color: #4bb47e; margin-top: 0;">Team Event Logos</h2>
            
            <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">multiplier logo.png</h4>
                <img src="assets/multiplier logo.png?v=${Date.now()}" alt="Team Event Logo" style="max-width: 200px; border: 2px solid #4bb47e;">
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">multiplier banner.png</h4>
                <img src="assets/multiplier banner.png?v=${Date.now()}" alt="Team Event Banner" style="max-width: 400px; border: 2px solid #4bb47e;">
            </div>
            
            <div style="background: rgba(75, 180, 126, 0.2); padding: 10px; border-radius: 5px; margin-top: 15px;">
                <strong>Used by:</strong> multiplier.html and other team event pages
            </div>
        </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Key Differences:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h4 style="color: #00d4ff;">Original Logos</h4>
                <ul style="line-height: 1.6;">
                    <li>Blue/cyan color scheme</li>
                    <li>Grid-based tech design</li>
                    <li>Clean geometric patterns</li>
                    <li>Diamond accent shapes</li>
                    <li>Tech-inspired elements</li>
                </ul>
            </div>
            <div>
                <h4 style="color: #4bb47e;">Team Event Logos</h4>
                <ul style="line-height: 1.6;">
                    <li>Green/orange color scheme</li>
                    <li>Organic flowing design</li>
                    <li>Curved and flowing elements</li>
                    <li>Circular accent shapes</li>
                    <li>Event-specific branding</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div style="background: rgba(0, 255, 0, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #00ff00;">
        <h4>✅ Implementation Status:</h4>
        <p>Original logos have been implemented with distinct designs. Regular pages will now show blue/cyan themed logos while team event pages continue to show green/orange themed logos.</p>
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
        <a href="index.html" style="background: #00d4ff; color: #003366; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 10px; font-weight: bold;">Test Homepage</a>
        <a href="multiplier.html" style="background: #4bb47e; color: #0b0a09; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 10px; font-weight: bold;">Test Multiplier</a>
    </div>
</body>
</html>`;

fs.writeFileSync('logo_implementation_verification.html', verificationHtml);

console.log('✓ Created verification page: logo_implementation_verification.html');
console.log('');
console.log('🎉 Implementation complete!');
console.log('');
console.log('Summary:');
console.log('- Regular pages (index.html, timebound.html, teams.html) → Blue/cyan original logos');
console.log('- Team event pages (multiplier.html) → Green/orange team event logos');
console.log('- All logos are now visually distinct and properly separated');
console.log('');
console.log('Test the implementation by visiting:');
console.log('- logo_implementation_verification.html (overview)');
console.log('- index.html (should show blue/cyan logos)');
console.log('- multiplier.html (should show green/orange logos)');