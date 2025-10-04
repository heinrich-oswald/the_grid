const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

console.log('🔧 Fixing Missing Logos...\n');

try {
  // Use the existing multiplier logos as a base for the original logos
  // since they are properly sized and visible
  const multiplierLogoPath = path.join(assetsDir, 'multiplier logo.png');
  const multiplierBannerPath = path.join(assetsDir, 'multiplier banner.png');
  
  const logoPath = path.join(assetsDir, 'logo.png');
  const bannerPath = path.join(assetsDir, 'banner.png');
  
  if (fs.existsSync(multiplierLogoPath)) {
    // Copy multiplier logo to logo.png
    fs.copyFileSync(multiplierLogoPath, logoPath);
    const logoStats = fs.statSync(logoPath);
    console.log(`✅ logo.png restored using multiplier logo (${logoStats.size} bytes)`);
  } else {
    console.log('⚠️  multiplier logo.png not found, cannot restore logo.png');
  }
  
  if (fs.existsSync(multiplierBannerPath)) {
    // Copy multiplier banner to banner.png
    fs.copyFileSync(multiplierBannerPath, bannerPath);
    const bannerStats = fs.statSync(bannerPath);
    console.log(`✅ banner.png restored using multiplier banner (${bannerStats.size} bytes)`);
  } else {
    console.log('⚠️  multiplier banner.png not found, cannot restore banner.png');
  }
  
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
  
  console.log('\n🎉 Logo fix completed successfully!');
  console.log('\n📋 Current State:');
  console.log('• logo.png - Now visible (copied from multiplier logo)');
  console.log('• banner.png - Now visible (copied from multiplier banner)');
  console.log('• team event logo.png - Team event branding (preserved)');
  console.log('• team event banner.png - Team event branding (preserved)');
  console.log('\n💡 Your main website logos should now be visible again!');
  
} catch (error) {
  console.error('❌ Error fixing logos:', error.message);
}