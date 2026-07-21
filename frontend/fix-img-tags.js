const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next') && !file.includes('dist')) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        results.push(file);
      }
    });
  } catch (e) {}
  return results;
}

const files = walk('src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Fix: `/ loading="lazy">` -> ` loading="lazy" />`
  newContent = newContent.replace(/\/\s*loading="lazy">/g, ' loading="lazy" />');
  newContent = newContent.replace(/\/\s*decoding="async">/g, ' decoding="async" />');
  newContent = newContent.replace(/\/\s*loading="lazy"\s*decoding="async">/g, ' loading="lazy" decoding="async" />');

  // Any other variations: `<img ... / loading="lazy" decoding="async">` -> `<img ... loading="lazy" decoding="async" />`
  // A robust fix:
  // Find any <img ...> that ends with some malformed /> string.
  // Actually, let's just globally replace the exact broken string.
  newContent = newContent.replace(/\/ (loading="lazy"( decoding="async")?)>/g, ' $1 />');
  newContent = newContent.replace(/\/ (decoding="async"( loading="lazy")?)>/g, ' $1 />');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`Fixed images in: ${file}`);
  }
});

console.log(`Done. Fixed ${changedCount} files.`);
