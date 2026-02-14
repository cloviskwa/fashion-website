const fs = require('fs');
const path = require('path');

const srcRoot = path.join(__dirname, '..', 'src', 'pages');
const outRoot = path.join(__dirname, '..', 'public');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcRoot, outRoot);

const blogDest = path.join(outRoot, 'blogs');
fs.mkdirSync(blogDest, { recursive: true });
fs.copyFileSync(path.join(srcRoot, 'blog', 'index.html'), path.join(blogDest, 'index.html'));

console.log('Build complete: src/pages copied to public');
