const fs = require('fs');
const path = require('path');

const TARGET_PADDING = 'px-4 md:px-8 lg:px-12';

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
  
  // Find className string containing "max-w-" and "mx-auto"
  let content = original.replace(/className=[\"']([^\"']*max-w-[a-zA-Z0-9\[\]\-]+[^\"']*mx-auto[^\"']*)[\"']/g, (match, classes) => {
    // Remove existing horizontal paddings (e.g. px-4, sm:px-6, md:px-8)
    let newClasses = classes.replace(/\b(sm:|md:|lg:|xl:)?px-[a-zA-Z0-9\[\]\-]+\b/g, '').trim();
    // Replace multiple spaces with single space
    newClasses = newClasses.replace(/\s+/g, ' ').trim();
    // Append the standard padding
    return 'className=\"' + newClasses + ' ' + TARGET_PADDING + '\"';
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated: ' + file);
  }
});

console.log('Total files changed: ' + changed);
