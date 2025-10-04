const fs = require('fs');
const path = require('path');

const assetsDir = 'assets';

console.log('🔄 Switching to Team Event Logos and Banners...\n');

// Define the file replacements
const replacements = [
    { source: 'team event logo.png', target: 'logo.png' },
    { source: 'team event banner.png', target: 'banner.png' }
];

// Perform the replacements
replacements.forEach(({ source, target }) => {
    const sourcePath = path.join(assetsDir, source);
    const targetPath = path.join(assetsDir, target);
    
    try {
        // Check if source file exists
        if (!fs.existsSync(sourcePath)) {
            console.log(`❌ Source file not found: ${sourcePath}`);
            return;
        }
        
        // Check if target file exists (for backup info)
        const targetExists = fs.existsSync(targetPath);
        
        // Copy the team event file to replace the current one
        fs.copyFileSync(sourcePath, targetPath);
        
        console.log(`✅ ${target} ${targetExists ? 'replaced' : 'created'} with ${source}`);
        
        // Show file size for verification
        const stats = fs.statSync(targetPath);
        console.log(`   📁 File size: ${stats.size} bytes`);
        
    } catch (error) {
        console.log(`❌ Error replacing ${target}: ${error.message}`);
    }
});

console.log('\n🎉 Team Event logo and banner switch completed!');
console.log('\n📋 Summary:');
console.log('• logo.png now contains the team event logo');
console.log('• banner.png now contains the team event banner');
console.log('• Your website will now display team event branding');
console.log('\n💡 The original files are preserved as "team event logo.png" and "team event banner.png"');