/**
 * ============================================
 * LIPEK FASHION - JAVASCRIPT BUNDLER
 * Bundles and minifies JavaScript files
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const Terser = require('terser');

const CONFIG = {
  srcDir: path.join(__dirname, '../src/assets/js'),
  destDir: path.join(__dirname, '../public/assets/js'),
  files: [
    'config.js',
    'main.js',
    'pwa.js'
  ],
  modules: [
    'modules/header.js',
    'modules/footer.js',
    'modules/booking.js',
    'modules/gallery.js',
    'modules/blog.js',
    'modules/contact.js',
    'modules/theme.js',
    'modules/animations.js',
    'modules/forms.js',
    'modules/utils.js'
  ]
};

/**
 * Read and concatenate files
 */
async function concatenateFiles() {
  let content = '';
  
  // Add main files
  for (const file of CONFIG.files) {
    const filePath = path.join(CONFIG.srcDir, file);
    if (await fs.pathExists(filePath)) {
      content += await fs.readFile(filePath, 'utf8');
      content += '\n\n';
    }
  }
  
  // Add modules
  for (const module of CONFIG.modules) {
    const modulePath = path.join(CONFIG.srcDir, module);
    if (await fs.pathExists(modulePath)) {
      content += await fs.readFile(modulePath, 'utf8');
      content += '\n\n';
    }
  }
  
  return content;
}

/**
 * Build JavaScript
 */
async function buildJS() {
  console.log('📱 Building JavaScript...');
  
  try {
    // Ensure destination directory exists
    await fs.ensureDir(CONFIG.destDir);
    
    // Concatenate files
    const rawJS = await concatenateFiles();
    
    // Minify with Terser
    const minified = await Terser.minify(rawJS, {
      compress: true,
      mangle: true,
      output: {
        comments: false
      }
    });
    
    // Write main.js
    await fs.writeFile(path.join(CONFIG.destDir, 'main.js'), minified.code);
    
    // Copy vendor.js if exists
    const vendorSrc = path.join(CONFIG.srcDir, 'vendor.js');
    const vendorDest = path.join(CONFIG.destDir, 'vendor.js');
    
    if (await fs.pathExists(vendorSrc)) {
      await fs.copyFile(vendorSrc, vendorDest);
    }
    
    // Get file size
    const stats = await fs.stat(path.join(CONFIG.destDir, 'main.js'));
    const size = (stats.size / 1024).toFixed(2);
    
    console.log(`   ✅ JavaScript built: main.js (${size} KB)`);
    
  } catch (error) {
    console.error('   ❌ JavaScript build failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  buildJS().catch(console.error);
}

module.exports = buildJS;