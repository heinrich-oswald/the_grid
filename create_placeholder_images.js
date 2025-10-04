const fs = require('fs');
const path = require('path');

// Function to create SVG placeholder images
function createPlaceholderImage(filename, width, height, text, color) {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">${text}</text>
</svg>`;
    
    fs.writeFileSync(path.join('assets', filename), svgContent);
    console.log(`Created placeholder: ${filename}`);
}

// Create placeholder images
try {
    // Create multiplier logo (distinct from original)
    createPlaceholderImage('multiplier logo.png', 400, 200, 'MULTIPLIER\nLOGO', '#4bb47e');
    
    // Create multiplier banner (distinct from original)
    createPlaceholderImage('multiplier banner.png', 1200, 400, 'MULTIPLIER\nBANNER', '#4bb47e');
    
    console.log('\n✅ Placeholder images created successfully!');
    console.log('These images are distinct from the original ones and should be visible immediately.');
    console.log('Please note: These are placeholder images. For production, replace them with your actual multiplier event images.');
} catch (error) {
    console.error('❌ Error creating placeholder images:', error.message);
}