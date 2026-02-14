// ============================================
// CSS BUILD SCRIPT
// Compiles SCSS to CSS with optimizations
// ============================================

const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

async function buildCSS() {
  console.log('🎨 Building CSS...');
  
  // Source and destination paths
  const srcFile = path.join(__dirname, '../src/assets/css/main.scss');
  const destFile = path.join(__dirname, '../public/assets/css/main.css');
  
  try {
    // Compile SCSS to CSS
    const result = sass.compile(srcFile, {
      style: 'expanded',
      sourceMap: false,
      loadPaths: [
        path.join(__dirname, '../src/assets/css')
      ]
    });
    
    // Run PostCSS plugins (autoprefixer, minify)
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
      from: srcFile,
      to: destFile
    });
    
    // Ensure destination directory exists
    await fs.ensureDir(path.dirname(destFile));
    
    // Write compiled CSS
    await fs.writeFile(destFile, processed.css);
    
    // Write sourcemap (optional)
    // await fs.writeFile(destFile + '.map', processed.map);
    
    console.log('✅ CSS built successfully!');
    console.log(`📁 Output: ${destFile}`);
    
    // Get file size
    const stats = await fs.stat(destFile);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`📦 Size: ${size} KB`);
    
  } catch (error) {
    console.error('❌ CSS build failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  buildCSS();
}

module.exports = buildCSS;