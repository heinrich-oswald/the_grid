const fs = require('fs');
const path = require('path');

// Define paths
const assetsDir = path.join(__dirname, 'assets');

// Files to copy
const replacements = [
  { source: 'team event logo.png', target: 'logo.png' },
  { source: 'team event banner.png', target: 'banner.png' }
];

console.log('=== Replacing regular logos with team event versions ===');

try {
  replacements.forEach(item => {
    const sourcePath = path.join(assetsDir, item.source);
    const targetPath = path.join(assetsDir, item.target);
    
    // Check if source file exists
    if (fs.existsSync(sourcePath)) {
      // Read source file content
      const content = fs.readFileSync(sourcePath);
      
      // Write to target file
      fs.writeFileSync(targetPath, content);
      console.log(`✓ Replaced ${item.target} with ${item.source}`);
    } else {
      console.log(`✗ Source file not found: ${item.source}`);
    }
  });
  
  console.log('=== Replacement completed ===');
  console.log('Team event logos are now active!');
  
} catch (error) {
  console.error('Error during replacement:', error.message);
}