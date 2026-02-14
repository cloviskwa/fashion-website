/**
 * ============================================
 * LIPEK FASHION - CSS BUILDER
 * Compiles SCSS to CSS with autoprefixing and minification
 * Version: 1.0.0
 * ============================================
 */

const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const CONFIG = {
  srcFile: path.join(__dirname, '../src/assets/css/main.scss'),
  destFile: path.join(__dirname, '../public/assets/css/main.css'),
  destDir: path.join(__dirname, '../public/assets/css'),
};

/**
 * Build CSS
 */
async function buildCSS() {
  console.log('🎨 Building CSS...');
  
  try {
    // Ensure destination directory exists
    await fs.ensureDir(CONFIG.destDir);
    
    // Compile SCSS
    const result = sass.compile(CONFIG.srcFile, {
      style: 'expanded',
      loadPaths: [
        path.join(__dirname, '../src/assets/css'),
        path.join(__dirname, '../node_modules')
      ]
    });
    
    // Process with PostCSS
    const processed = await postcss([
      autoprefixer({
        overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead']
      }),
      cssnano({
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }]
      })
    ]).process(result.css, {
      from: CONFIG.srcFile,
      to: CONFIG.destFile
    });
    
    // Write CSS
    await fs.writeFile(CONFIG.destFile, processed.css);
    
    // Get file size
    const stats = await fs.stat(CONFIG.destFile);
    const size = (stats.size / 1024).toFixed(2);
    
    console.log(`   ✅ CSS built: main.css (${size} KB)`);
    
  } catch (error) {
    console.error('   ❌ CSS build failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  buildCSS().catch(console.error);
}

module.exports = buildCSS;