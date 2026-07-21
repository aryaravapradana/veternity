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

  // Regex to match <img ... /> and inject attributes if not present
  // It looks for <img followed by anything up to >, and checks if loading="lazy" is missing.
  newContent = newContent.replace(/<img([^>]+)>/g, (match, p1) => {
    let attrs = p1;
    if (!attrs.includes('loading="lazy"')) {
      attrs += ' loading="lazy"';
    }
    if (!attrs.includes('decoding="async"')) {
      attrs += ' decoding="async"';
    }
    return `<img${attrs}>`;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`Optimized images in: ${file}`);
  }
});

console.log(`Done. Optimized ${changedCount} files.`);
