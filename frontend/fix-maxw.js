const fs = require('fs');
const path = require('path');

const TARGET_MAX_W = 'max-w-7xl';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let changed = 0;

files.forEach(file => {
  const original = fs.readFileSync(file, 'utf8');
  
  // Replace max-w-[...] with max-w-7xl in strings that also contain mx-auto
  let content = original.replace(/className=[\"']([^\"']*?)(max-w-[a-zA-Z0-9\[\]\-]+)([^\"']*?mx-auto[^\"']*)[\"']/g, (match, before, maxw, after) => {
    
    // We do NOT want to change small localized max-w containers like max-w-sm for cards
    // Let's only change max-w-2xl, max-w-3xl, max-w-4xl, max-w-5xl, max-w-6xl, max-w-[1400px], max-w-7xl
    // if they are clearly page layout wrappers. Since the user said "unify left and right padding biar semuanya konsisten",
    // and mentioned dashboard/orders is too centered.
    
    if (['max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-[1400px]'].includes(maxw)) {
      // Keep everything else the same, just swap the max-w class
      return 'className=\"' + before + TARGET_MAX_W + after + '\"';
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated: ' + file);
  }
});

console.log('Total files changed: ' + changed);
