// Script to create distinct placeholder images to help diagnose the logo display issue
// This will create simplified versions of the logo files with different colors and text
// so you can clearly see which logo is being displayed

const fs = require('fs');
const path = require('path');

// Check if the script is being run directly
if (require.main === module) {
    console.log('=== Creating Distinct Placeholder Images ===');
    
    // Create normal logo with blue background
    createPlaceholderImage('assets/logo.png', '#2196F3', 'NORMAL');
    
    // Create multiplier logo with green background
    createPlaceholderImage('assets/multiplier logo.png', '#4CAF50', 'MULTIPLIER');
    
    // Create team event logo with orange background
    createPlaceholderImage('assets/team event logo.png', '#FF9800', 'TEAM EVENT');
    
    // Also create banner versions
    createPlaceholderBanner('assets/banner.png', '#2196F3', 'NORMAL BANNER');
    createPlaceholderBanner('assets/multiplier banner.png', '#4CAF50', 'MULTIPLIER BANNER');
    createPlaceholderBanner('assets/team event banner.png', '#FF9800', 'TEAM EVENT BANNER');
    
    console.log('=== Placeholder Images Created Successfully ===');
    console.log('Now open the test pages to see the distinct images');
    console.log('After testing, you can replace these placeholders with your actual images');
}

/**
 * Creates a simple placeholder logo image as a data URL
 * @param {string} filePath - The path to save the image
 * @param {string} bgColor - Background color
 * @param {string} text - Text to display on the image
 */
function createPlaceholderImage(filePath, bgColor, text) {
    // Simple logo dimensions
    const width = 200;
    const height = 200;
    
    // Create SVG content with distinct color and text
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white" dominant-baseline="middle">${text}</text>
    </svg>`;
    
    // Convert SVG to data URL
    const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
    
    // Write the data URL to a file with a simple HTML wrapper
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${text} Placeholder</title>
</head>
<body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0;">
    <img src="${dataUrl}" alt="${text}">
</body>
</html>`;
    
    try {
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Created placeholder: ${filePath} (${bgColor}, ${text})`);
    } catch (error) {
        console.error(`Failed to create ${filePath}:`, error);
    }
}

/**
 * Creates a simple placeholder banner image as a data URL
 * @param {string} filePath - The path to save the image
 * @param {string} bgColor - Background color
 * @param {string} text - Text to display on the banner
 */
function createPlaceholderBanner(filePath, bgColor, text) {
    // Banner dimensions (wider than logo)
    const width = 600;
    const height = 150;
    
    // Create SVG content with distinct color and text
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="32" text-anchor="middle" fill="white" dominant-baseline="middle">${text}</text>
    </svg>`;
    
    // Convert SVG to data URL
    const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
    
    // Write the data URL to a file with a simple HTML wrapper
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${text} Placeholder</title>
</head>
<body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0;">
    <img src="${dataUrl}" alt="${text}">
</body>
</html>`;
    
    try {
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Created placeholder: ${filePath} (${bgColor}, ${text})`);
    } catch (error) {
        console.error(`Failed to create ${filePath}:`, error);
    }
}

// Export functions for potential reuse
module.exports = {
    createPlaceholderImage,
    createPlaceholderBanner
};