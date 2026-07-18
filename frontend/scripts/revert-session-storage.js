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

  // Revert sessionStorage to localStorage
  if (content.includes('sessionStorage.')) {
    content = content.replace(/sessionStorage\.getItem\("farmpro_session"\)/g, 'localStorage.getItem("farmpro_session")');
    content = content.replace(/sessionStorage\.setItem\("farmpro_session"/g, 'localStorage.setItem("farmpro_session"');
    content = content.replace(/sessionStorage\.removeItem\("farmpro_session"\)/g, 'localStorage.removeItem("farmpro_session")');
    changed = true;
  }

  if (file.replace(/\\/g, '/').endsWith('login/page.tsx')) {
    if (content.includes('sessionStorage.setItem("auth-token"')) {
      content = "import Cookies from 'js-cookie';\n" + content.replace(/sessionStorage\.setItem\("auth-token", (.*?)\);/g, 'Cookies.set("auth-token", $1, { expires: 7 });');
      changed = true;
    }
  }

  if (file.replace(/\\/g, '/').endsWith('src/lib/apiClient.ts')) {
    if (content.includes("typeof window !== 'undefined' ? sessionStorage.getItem('auth-token') : null")) {
      content = "import Cookies from 'js-cookie';\n" + content;
      content = content.replace(/const token = typeof window !== 'undefined' \? sessionStorage\.getItem\('auth-token'\) : null;/g, "const token = Cookies.get('auth-token');");
      changed = true;
    }
  }

  if (file.replace(/\\/g, '/').endsWith('settings/page.tsx')) {
    if (content.includes('sessionStorage.removeItem("auth-token")')) {
      content = content.replace(/sessionStorage\.removeItem\("auth-token"\);/g, 'import("js-cookie").then(Cookies => Cookies.default.remove("auth-token"));');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted ${file}`);
  }
}
