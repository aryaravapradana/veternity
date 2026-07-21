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
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const frontendFiles = walk('frontend/src');
const backendFiles = walk('backend/src');

function replaceInFiles(files, replacements) {
  let changed = 0;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    
    replacements.forEach(([search, replace]) => {
      // Create a global regex for literal replacement
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      newContent = newContent.replace(regex, replace);
    });

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      changed++;
      console.log('Updated:', file);
    }
  });
  return changed;
}

console.log('--- Frontend ---');
replaceInFiles(frontendFiles, [
  ['/dashboard', '/hub'],
  ['dashboard/ai-vet', 'hub/intelligence'], // Fallback if missed earlier
  ['/marketplace', '/market']
]);

console.log('--- Backend ---');
replaceInFiles(backendFiles, [
  ['/dashboard', '/hub'],
  ['dashboard.routes', 'hub.routes'],
  ['dashboard.controller', 'hub.controller'],
  ['dashboardRoutes', 'hubRoutes']
]);

console.log('Done.');
