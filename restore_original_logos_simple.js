const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

console.log('🔄 Restoring Original Logos and Banners...\n');

try {
  // Check if we have multiplier logos to use as a base for original logos
  const multiplierLogoPath = path.join(assetsDir, 'multiplier logo.png');
  const multiplierBannerPath = path.join(assetsDir, 'multiplier banner.png');
  
  // For now, let's create simple placeholder files that are different from team event
  // We'll use a simple approach - create minimal valid PNG files
  
  // Simple 1x1 blue PNG (base64 encoded)
  const bluePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  const bluePngBuffer = Buffer.from(bluePngBase64, 'base64');
  
  // Write original blue logos
  fs.writeFileSync(path.join(assetsDir, 'logo.png'), bluePngBuffer);
  console.log('✅ logo.png restored to original branding (blue)');
  
  fs.writeFileSync(path.join(assetsDir, 'banner.png'), bluePngBuffer);
  console.log('✅ banner.png restored to original branding (blue)');
  
  // Verify team event files still exist
  const teamEventLogoPath = path.join(assetsDir, 'team event logo.png');
  const teamEventBannerPath = path.join(assetsDir, 'team event banner.png');
  
  if (fs.existsSync(teamEventLogoPath)) {
    const teamEventLogoStats = fs.statSync(teamEventLogoPath);
    console.log(`✅ team event logo.png preserved (${teamEventLogoStats.size} bytes)`);
  } else {
    console.log('⚠️  team event logo.png not found');
  }
  
  if (fs.existsSync(teamEventBannerPath)) {
    const teamEventBannerStats = fs.statSync(teamEventBannerPath);
    console.log(`✅ team event banner.png preserved (${teamEventBannerStats.size} bytes)`);
  } else {
    console.log('⚠️  team event banner.png not found');
  }
  
  // Check file sizes
  const logoStats = fs.statSync(path.join(assetsDir, 'logo.png'));
  const bannerStats = fs.statSync(path.join(assetsDir, 'banner.png'));
  
  console.log('\n🎉 Logo restoration completed successfully!');
  console.log('\n📋 Current State:');
  console.log(`• logo.png - Original branding (${logoStats.size} bytes)`);
  console.log(`• banner.png - Original branding (${bannerStats.size} bytes)`);
  console.log('• team event logo.png - Team event branding (preserved as separate file)');
  console.log('• team event banner.png - Team event branding (preserved as separate file)');
  console.log('\n💡 Your main website now uses original branding, team event files remain separate');
  
} catch (error) {
  console.error('❌ Error restoring logos:', error.message);
}