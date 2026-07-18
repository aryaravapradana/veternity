const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, '../src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace localStorage
  if (content.includes('localStorage.')) {
    content = content.replace(/localStorage\.getItem\("farmpro_session"\)/g, 'sessionStorage.getItem("farmpro_session")');
    content = content.replace(/localStorage\.setItem\("farmpro_session"/g, 'sessionStorage.setItem("farmpro_session"');
    content = content.replace(/localStorage\.removeItem\("farmpro_session"\)/g, 'sessionStorage.removeItem("farmpro_session")');
    changed = true;
  }

  // Replace js-cookie usages
  if (content.includes('Cookies.set("auth-token"')) {
    content = content.replace(/Cookies\.set\("auth-token", (.*?), \{.*?\}\);/g, 'sessionStorage.setItem("auth-token", $1);');
    // Also remove the import Cookies from "js-cookie"
    content = content.replace(/import Cookies from "js-cookie";\n/g, '');
    changed = true;
  }
  
  if (file.replace(/\\/g, '/').endsWith('src/lib/apiClient.ts')) {
    content = content.replace(/import Cookies from 'js-cookie';\n/g, '');
    content = content.replace(/const token = Cookies\.get\('auth-token'\);/g, "const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth-token') : null;");
    changed = true;
  }
  
  if (file.replace(/\\/g, '/').endsWith('settings/page.tsx')) {
    content = content.replace(/import\("js-cookie"\)\.then\(Cookies => Cookies\.default\.remove\("auth-token"\)\);/g, 'sessionStorage.removeItem("auth-token");');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
