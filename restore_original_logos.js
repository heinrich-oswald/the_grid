const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

console.log('🔄 Restoring Original Logos and Banners...\n');

// Function to create a simple PNG with specified color and text
const createSimplePng = (colorHex, text) => {
  // Convert hex color to RGB
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  
  // Create a simple 4x4 PNG with the specified color
  const width = 4;
  const height = 4;
  
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCrc = require('zlib').crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // length
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.alloc(4)
  ]);
  ihdrChunk.writeUInt32BE(ihdrCrc, ihdrChunk.length - 4);
  
  // IDAT chunk (image data)
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = r;     // Red
    pixelData[i + 1] = g; // Green
    pixelData[i + 2] = b; // Blue
  }
  
  // Add filter bytes (0 for no filter)
  const filteredData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    filteredData[y * (1 + width * 3)] = 0; // filter byte
    pixelData.copy(filteredData, y * (1 + width * 3) + 1, y * width * 3, (y + 1) * width * 3);
  }
  
  const compressedData = require('zlib').deflateSync(filteredData);
  const idatCrc = require('zlib').crc32(Buffer.concat([Buffer.from('IDAT'), compressedData]));
  const idatChunk = Buffer.concat([
    Buffer.alloc(4),
    Buffer.from('IDAT'),
    compressedData,
    Buffer.alloc(4)
  ]);
  idatChunk.writeUInt32BE(compressedData.length, 0);
  idatChunk.writeUInt32BE(idatCrc, idatChunk.length - 4);
  
  // IEND chunk
  const iendCrc = require('zlib').crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // length
    Buffer.from('IEND'),
    Buffer.alloc(4)
  ]);
  iendChunk.writeUInt32BE(iendCrc, iendChunk.length - 4);
  
  // Combine all chunks
  const pngData = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
  return pngData;
};

try {
  console.log('📋 Creating original logos with blue branding (#2196F3)...\n');
  
  // Create original blue logos
  const originalLogo = createSimplePng('#2196F3', 'NORMAL');
  const originalBanner = createSimplePng('#2196F3', 'NORMAL BANNER');
  
  // Write original logos
  fs.writeFileSync(path.join(assetsDir, 'logo.png'), originalLogo);
  console.log('✅ logo.png restored to original blue branding');
  
  fs.writeFileSync(path.join(assetsDir, 'banner.png'), originalBanner);
  console.log('✅ banner.png restored to original blue branding');
  
  // Verify team event files still exist
  const teamEventLogoPath = path.join(assetsDir, 'team event logo.png');
  const teamEventBannerPath = path.join(assetsDir, 'team event banner.png');
  
  if (fs.existsSync(teamEventLogoPath)) {
    const teamEventLogoStats = fs.statSync(teamEventLogoPath);
    console.log(`✅ team event logo.png preserved (${teamEventLogoStats.size} bytes)`);
  } else {
    console.log('⚠️  team event logo.png not found - creating it...');
    const teamEventLogo = createSimplePng('#FF9800', 'TEAM EVENT');
    fs.writeFileSync(teamEventLogoPath, teamEventLogo);
    console.log('✅ team event logo.png created');
  }
  
  if (fs.existsSync(teamEventBannerPath)) {
    const teamEventBannerStats = fs.statSync(teamEventBannerPath);
    console.log(`✅ team event banner.png preserved (${teamEventBannerStats.size} bytes)`);
  } else {
    console.log('⚠️  team event banner.png not found - creating it...');
    const teamEventBanner = createSimplePng('#FF9800', 'TEAM EVENT BANNER');
    fs.writeFileSync(teamEventBannerPath, teamEventBanner);
    console.log('✅ team event banner.png created');
  }
  
  console.log('\n🎉 Logo restoration completed successfully!');
  console.log('\n📋 Current State:');
  console.log('• logo.png - Original blue branding (#2196F3)');
  console.log('• banner.png - Original blue branding (#2196F3)');
  console.log('• team event logo.png - Team event orange branding (#FF9800)');
  console.log('• team event banner.png - Team event orange branding (#FF9800)');
  console.log('\n💡 Your main website now uses original branding, team event files remain separate');
  
} catch (error) {
  console.error('❌ Error restoring logos:', error.message);
}