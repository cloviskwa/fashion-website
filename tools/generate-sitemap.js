/**
 * ============================================
 * LIPEK FASHION - SITEMAP GENERATOR
 * Generates XML sitemap for SEO
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const CONFIG = {
  publicDir: path.join(__dirname, '../public'),
  baseUrl: 'https://lipekfashion.com',
  exclude: ['404', '500', 'offline', 'thank-you']
};

/**
 * Generate sitemap
 */
async function generateSitemap() {
  console.log('🗺️ Generating sitemap...');
  
  try {
    // Find all HTML files
    const pattern = path.join(CONFIG.publicDir, '**/index.html');
    const files = glob.sync(pattern);
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const file of files) {
      // Get relative path
      const relativePath = path.relative(CONFIG.publicDir, file);
      const dirPath = path.dirname(relativePath);
      
      // Skip excluded paths
      if (CONFIG.exclude.some(ex => dirPath.includes(ex))) {
        continue;
      }
      
      // Build URL
      let url = CONFIG.baseUrl;
      if (dirPath !== '.') {
        url += '/' + dirPath.replace(/\\/g, '/');
      }
      url += '/';
      
      // Set priority based on depth
      const depth = dirPath.split(path.sep).length;
      let priority = '0.8';
      if (dirPath === '.') priority = '1.0';
      else if (depth === 1) priority = '0.9';
      else if (depth === 2) priority = '0.7';
      else priority = '0.6';
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>';
    
    // Write sitemap
    await fs.writeFile(path.join(CONFIG.publicDir, 'sitemap.xml'), sitemap);
    
    console.log(`   ✅ Sitemap generated with ${files.length} URLs\n`);
    
  } catch (error) {
    console.error('   ❌ Sitemap generation failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemap().catch(console.error);
}

module.exports = generateSitemap;