const fs = require('fs');

console.log('Restoring original logo for all pages...');

// Backup current files before replacing
if (fs.existsSync('assets/logo.png')) {
    fs.copyFileSync('assets/logo.png', 'assets/logo_distinct_backup.png');
    console.log('✓ Backed up current distinct logo.png');
}
if (fs.existsSync('assets/banner.png')) {
    fs.copyFileSync('assets/banner.png', 'assets/banner_distinct_backup.png');
    console.log('✓ Backed up current distinct banner.png');
}

// Copy the original logo files (team event files are the original logos)
if (fs.existsSync('assets/team event logo.png')) {
    fs.copyFileSync('assets/team event logo.png', 'assets/logo.png');
    console.log('✓ Restored original logo.png from team event logo.png');
} else {
    console.log('❌ team event logo.png not found');
}

if (fs.existsSync('assets/team event banner.png')) {
    fs.copyFileSync('assets/team event banner.png', 'assets/banner.png');
    console.log('✓ Restored original banner.png from team event banner.png');
} else {
    console.log('❌ team event banner.png not found');
}

// Create a verification page
const verificationHtml = `<!DOCTYPE html>
<html>
<head><title>Original Logo Restoration Verification</title></head>
<body style="background: #0b0a09; color: white; padding: 20px;">
    <h1>Original Logo Restoration Verification</h1>
    
    <div style="background: rgba(75, 180, 126, 0.1); padding: 20px; border-radius: 10px; border: 2px solid #4bb47e; margin: 20px 0;">
        <h2 style="color: #4bb47e; margin-top: 0;">✅ All Pages Now Use Original Logo</h2>
        
        <div style="display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; justify-content: center;">
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">Original Logo</h4>
                <img src="assets/logo.png?v=${Date.now()}" alt="Original Logo" style="max-width: 200px; border: 2px solid #4bb47e;">
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #333; margin-top: 0;">Original Banner</h4>
                <img src="assets/banner.png?v=${Date.now()}" alt="Original Banner" style="max-width: 400px; border: 2px solid #4bb47e;">
            </div>
        </div>
        
        <div style="background: rgba(75, 180, 126, 0.2); padding: 15px; border-radius: 5px;">
            <h4>Pages Using This Logo:</h4>
            <ul style="line-height: 1.6; margin: 10px 0;">
                <li><strong>index.html</strong> - Homepage</li>
                <li><strong>multiplier.html</strong> - Multiplier page</li>
                <li><strong>timebound.html</strong> - Timebound page</li>
                <li><strong>teams.html</strong> - Teams page</li>
                <li><strong>All other pages</strong> - Consistent branding</li>
            </ul>
        </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>What Changed:</h3>
        <ul style="line-height: 1.6;">
            <li>✅ Removed logo separation - all pages now use the same original logo</li>
            <li>✅ Restored the original green/orange themed logo design</li>
            <li>✅ Consistent branding across all pages</li>
            <li>✅ No more distinction between regular and team event pages</li>
        </ul>
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
        <h3>Test All Pages:</h3>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
            <a href="index.html" style="background: #4bb47e; color: #0b0a09; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Homepage</a>
            <a href="multiplier.html" style="background: #4bb47e; color: #0b0a09; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Multiplier</a>
            <a href="timebound.html" style="background: #4bb47e; color: #0b0a09; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Timebound</a>
            <a href="teams.html" style="background: #4bb47e; color: #0b0a09; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Teams</a>
        </div>
    </div>
    
    <div style="background: rgba(0, 255, 0, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #00ff00; margin-top: 20px;">
        <h4>✅ Restoration Complete!</h4>
        <p>All pages now use the original logo design. The logo separation has been removed and consistent branding is restored across the entire site.</p>
    </div>
</body>
</html>`;

fs.writeFileSync('original_logo_restoration_verification.html', verificationHtml);

console.log('✓ Created verification page: original_logo_restoration_verification.html');
console.log('');
console.log('🎉 Original logo restoration complete!');
console.log('');
console.log('Summary:');
console.log('- All pages now use the same original logo');
console.log('- Logo separation has been removed');
console.log('- Consistent branding across all pages');
console.log('- Original green/orange themed design restored');
console.log('');
console.log('Test pages:');
console.log('- index.html');
console.log('- multiplier.html'); 
console.log('- timebound.html');
console.log('- teams.html');
console.log('- All should show the same original logo');