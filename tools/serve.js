/**
 * ============================================
 * LIPEK FASHION - DEVELOPMENT SERVER
 * Serves the site with live reload
 * Version: 1.0.0
 * ============================================
 */

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_DIR = path.join(__dirname, '../src');

// Serve static files
app.use(express.static(PUBLIC_DIR));

// Handle clean URLs (serve index.html for folders)
app.get('*', (req, res) => {
  const urlPath = req.path;
  let filePath = path.join(PUBLIC_DIR, urlPath);
  
  // If path ends with /, serve index.html from that folder
  if (urlPath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  } 
  // If path doesn't have extension, try appending index.html
  else if (!path.extname(urlPath)) {
    const withIndex = path.join(filePath, 'index.html');
    const withoutIndex = filePath + '.html';
    
    if (fs.existsSync(withIndex)) {
      filePath = withIndex;
    } else if (fs.existsSync(withoutIndex)) {
      filePath = withoutIndex;
    }
  }
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404', 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n');
  console.log('🚀 Lipek Fashion - Development Server');
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${PUBLIC_DIR}`);
  console.log('\nWatching for changes...\n');
});

// Watch for changes and rebuild
const watcher = chokidar.watch(SRC_DIR, {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

let building = false;

watcher.on('change', (filePath) => {
  if (building) return;
  
  building = true;
  console.log(`📝 File changed: ${filePath}`);
  console.log('🔨 Rebuilding...');
  
  exec('npm run build', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error);
    } else {
      console.log('✅ Rebuild complete!');
    }
    building = false;
  });
});

console.log('👀 Watching for file changes...');