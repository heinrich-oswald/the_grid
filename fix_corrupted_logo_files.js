const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing corrupted logo files...\n');

const assetsDir = 'assets';

// The team event files are the only ones with actual PNG data
const teamEventLogoPath = path.join(assetsDir, 'team event logo.png');
const teamEventBannerPath = path.join(assetsDir, 'team event banner.png');

const logoPath = path.join(assetsDir, 'logo.png');
const bannerPath = path.join(assetsDir, 'banner.png');
const multiplierLogoPath = path.join(assetsDir, 'multiplier logo.png');
const multiplierBannerPath = path.join(assetsDir, 'multiplier banner.png');

try {
    // Check if team event files exist and are actual PNG files
    if (fs.existsSync(teamEventLogoPath)) {
        const teamEventLogoData = fs.readFileSync(teamEventLogoPath);
        
        // Check if it's a real PNG (starts with PNG signature)
        if (teamEventLogoData[0] === 0x89 && teamEventLogoData[1] === 0x50 && 
            teamEventLogoData[2] === 0x4E && teamEventLogoData[3] === 0x47) {
            
            console.log('✅ Found valid PNG data in team event logo');
            
            // Copy team event logo to logo.png (this will be the "original" blue logo)
            fs.writeFileSync(logoPath, teamEventLogoData);
            console.log('✅ logo.png fixed with actual PNG data');
            
            // Also copy to multiplier logo
            fs.writeFileSync(multiplierLogoPath, teamEventLogoData);
            console.log('✅ multiplier logo.png fixed with actual PNG data');
            
        } else {
            console.log('❌ team event logo.png is not a valid PNG file');
        }
    } else {
        console.log('❌ team event logo.png not found');
    }
    
    if (fs.existsSync(teamEventBannerPath)) {
        const teamEventBannerData = fs.readFileSync(teamEventBannerPath);
        
        // Check if it's a real PNG (starts with PNG signature)
        if (teamEventBannerData[0] === 0x89 && teamEventBannerData[1] === 0x50 && 
            teamEventBannerData[2] === 0x4E && teamEventBannerData[3] === 0x47) {
            
            console.log('✅ Found valid PNG data in team event banner');
            
            // Copy team event banner to banner.png
            fs.writeFileSync(bannerPath, teamEventBannerData);
            console.log('✅ banner.png fixed with actual PNG data');
            
            // Also copy to multiplier banner
            fs.writeFileSync(multiplierBannerPath, teamEventBannerData);
            console.log('✅ multiplier banner.png fixed with actual PNG data');
            
        } else {
            console.log('❌ team event banner.png is not a valid PNG file');
        }
    } else {
        console.log('❌ team event banner.png not found');
    }
    
    // Verify the fixes
    console.log('\n📊 Verification:');
    
    const logoStats = fs.statSync(logoPath);
    const bannerStats = fs.statSync(bannerPath);
    const multiplierLogoStats = fs.statSync(multiplierLogoPath);
    const multiplierBannerStats = fs.statSync(multiplierBannerPath);
    
    console.log(`• logo.png: ${logoStats.size} bytes`);
    console.log(`• banner.png: ${bannerStats.size} bytes`);
    console.log(`• multiplier logo.png: ${multiplierLogoStats.size} bytes`);
    console.log(`• multiplier banner.png: ${multiplierBannerStats.size} bytes`);
    
    // Check if they're now valid PNG files
    const logoData = fs.readFileSync(logoPath);
    const bannerData = fs.readFileSync(bannerPath);
    
    const logoIsValid = logoData[0] === 0x89 && logoData[1] === 0x50 && logoData[2] === 0x4E && logoData[3] === 0x47;
    const bannerIsValid = bannerData[0] === 0x89 && bannerData[1] === 0x50 && bannerData[2] === 0x4E && bannerData[3] === 0x47;
    
    console.log(`\n✅ logo.png is ${logoIsValid ? 'valid PNG' : 'NOT valid PNG'}`);
    console.log(`✅ banner.png is ${bannerIsValid ? 'valid PNG' : 'NOT valid PNG'}`);
    
    if (logoIsValid && bannerIsValid) {
        console.log('\n🎉 All logo files have been fixed and should now be visible!');
    } else {
        console.log('\n❌ Some files are still corrupted');
    }
    
} catch (error) {
    console.error('❌ Error fixing logo files:', error.message);
}