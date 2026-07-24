const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (/\.(tsx?|jsx?|css|json)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const codeFiles = getFiles('src');
let count = 0;

for (const file of codeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('.png')) {
    const updated = content
      .replace(/(\/logos\/[^\s"'`]+\.)png/gi, '$1webp')
      .replace(/(\/images\/[^\s"'`]+\.)png/gi, '$1webp')
      .replace(/(\/icons\/[^\s"'`]+\.)png/gi, '$1webp')
      .replace(/(\/mocks\/[^\s"'`]+\.)png/gi, '$1webp')
      .replace(/(\/features\/[^\s"'`]+\.)png/gi, '$1webp')
      .replace(/(\/illustrations\/[^\s"'`]+\.)png/gi, '$1webp');

    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      count++;
      console.log('Updated:', file);
    }
  }
}

console.log(`\nSuccessfully updated ${count} code files from .png to .webp references.`);
