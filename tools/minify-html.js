/**
 * ============================================
 * LIPEK FASHION - HTML MINIFIER
 * Minifies all HTML files in public directory
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { minify } = require('html-minifier');

const CONFIG = {
  publicDir: path.join(__dirname, '../public'),
  minifyOptions: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    sortAttributes: true,
    sortClassName: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
    removeAttributeQuotes: false
  }
};

/**
 * Minify HTML files
 */
async function minifyHTML() {
  console.log('🔨 Minifying HTML...');
  
  try {
    // Find all HTML files
    const pattern = path.join(CONFIG.publicDir, '**/*.html');
    const files = glob.sync(pattern);
    
    let minifiedCount = 0;
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      
      // Skip if already minified (optional check)
      if (content.includes('<!--')) {
        const minified = minify(content, CONFIG.minifyOptions);
        await fs.writeFile(file, minified, 'utf8');
        minifiedCount++;
      }
    }
    
    console.log(`   ✅ Minified ${minifiedCount} HTML files\n`);
    
  } catch (error) {
    console.error('   ❌ HTML minification failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  minifyHTML().catch(console.error);
}

module.exports = minifyHTML;