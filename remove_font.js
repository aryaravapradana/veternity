const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('c:/PROJECTS/WEB DEV/KID/frontend/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/style=\{\{\s*fontFamily:\s*"'Stack Sans Notch', sans-serif"\s*\}\}/g, '');
    newContent = newContent.replace(/font-family:\s*'Stack Sans Notch', var\(--font-sans\);/g, "font-family: 'SFUIDisplay', sans-serif;");
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
