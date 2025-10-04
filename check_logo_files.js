const fs = require('fs');
const path = require('path');

// Define paths
const assetsDir = path.join(__dirname, 'assets');

// Files to check
const filesToCheck = [
  'logo.png',
  'banner.png',
  'team event logo.png',
  'team event banner.png'
];

console.log('=== Logo File Diagnostic ===');
console.log('Checking file sizes and existence...\n');

try {
  filesToCheck.forEach(file => {
    const filePath = path.join(assetsDir, file);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`${file}:`);
      console.log(`  - Exists: Yes`);
      console.log(`  - Size: ${stats.size} bytes`);
      console.log(`  - Path: ${filePath}`);
      console.log('');
    } else {
      console.log(`${file}:`);
      console.log(`  - Exists: No`);
      console.log(`  - Path: ${filePath}`);
      console.log('');
    }
  });
  
  // Create a simple test HTML to check if browser can display the images
  const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logo File Test</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        .image-container { margin: 20px; border: 1px solid #ddd; padding: 10px; }
        img { max-width: 100%; height: auto; }
        .file-info { background-color: #f5f5f5; padding: 10px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Logo File Test</h1>
    <p>Checking if browser can display the logo files directly:</p>
    
    <div class="image-container">
        <h2>logo.png</h2>
        <img src="assets/logo.png?v=test" alt="Logo" onload="this.nextElementSibling.textContent = '✓ Loaded successfully'" onerror="this.nextElementSibling.textContent = '✗ Failed to load'">
        <div class="file-info"></div>
    </div>
    
    <div class="image-container">
        <h2>banner.png</h2>
        <img src="assets/banner.png?v=test" alt="Banner" onload="this.nextElementSibling.textContent = '✓ Loaded successfully'" onerror="this.nextElementSibling.textContent = '✗ Failed to load'">
        <div class="file-info"></div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(__dirname, 'logo_file_test.html'), testHtml);
  console.log('=== Diagnostic Complete ===');
  console.log('1. Checked file existence and sizes');
  console.log('2. Created logo_file_test.html for browser testing');
  console.log('3. Open logo_file_test.html to see if browser can display the images');
  
} catch (error) {
  console.error('Error during diagnostic:', error.message);
}