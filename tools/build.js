/**
 * ============================================
 * LIPEK FASHION - MAIN BUILD SCRIPT
 * Orchestrates the entire build process
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk'); // Optional: for colored output (npm install chalk)

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '../src'),
  publicDir: path.join(__dirname, '../public'),
  assetsDir: path.join(__dirname, '../src/assets'),
  pagesDir: path.join(__dirname, '../src/pages'),
  includesDir: path.join(__dirname, '../src/includes'),
  dataDir: path.join(__dirname, '../src/data'),
};

// Console colors (if chalk not installed, use plain console.log)
const color = {
  green: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
  blue: (msg) => console.log('\x1b[34m%s\x1b[0m', msg),
  yellow: (msg) => console.log('\x1b[33m%s\x1b[0m', msg),
  red: (msg) => console.log('\x1b[31m%s\x1b[0m', msg),
  cyan: (msg) => console.log('\x1b[36m%s\x1b[0m', msg),
};

/**
 * Main build function
 */
async function build() {
  console.log('\n');
  color.cyan('🚀 LIPEK FASHION - PRODUCTION BUILD');
  color.cyan('====================================\n');

  const startTime = Date.now();

  try {
    // Step 1: Clean public directory
    color.blue('📁 Step 1: Cleaning public directory...');
    await cleanPublic();
    color.green('   ✅ Public directory cleaned\n');

    // Step 2: Copy pages to public
    color.blue('📄 Step 2: Copying HTML pages...');
    await copyPages();
    color.green('   ✅ Pages copied\n');

    // Step 3: Process includes
    color.blue('🔧 Step 3: Processing HTML includes...');
    await processIncludes();
    color.green('   ✅ Includes processed\n');

    // Step 4: Build CSS
    color.blue('🎨 Step 4: Building CSS...');
    await buildCSS();
    color.green('   ✅ CSS built\n');

    // Step 5: Build JavaScript
    color.blue('📱 Step 5: Building JavaScript...');
    await buildJS();
    color.green('   ✅ JavaScript built\n');

    // Step 6: Optimize images
    color.blue('🖼️ Step 6: Optimizing images...');
    await optimizeImages();
    color.green('   ✅ Images optimized\n');

    // Step 7: Copy assets
    color.blue('📦 Step 7: Copying assets...');
    await copyAssets();
    color.green('   ✅ Assets copied\n');

    // Step 8: Generate sitemap
    color.blue('🗺️ Step 8: Generating sitemap...');
    await generateSitemap();
    color.green('   ✅ Sitemap generated\n');

    // Step 9: Generate PWA assets
    color.blue('📱 Step 9: Generating PWA assets...');
    await generatePWA();
    color.green('   ✅ PWA assets generated\n');

    // Step 10: Minify HTML
    color.blue('🔨 Step 10: Minifying HTML...');
    await minifyHTML();
    color.green('   ✅ HTML minified\n');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n');
    color.green('✅ BUILD COMPLETED SUCCESSFULLY!');
    color.cyan(`⏱️  Total time: ${duration}s`);
    color.cyan(`📁 Output directory: ${CONFIG.publicDir}`);
    console.log('\n');

  } catch (error) {
    color.red('\n❌ BUILD FAILED!');
    color.red(error.message);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Clean public directory
 */
async function cleanPublic() {
  await fs.emptyDir(CONFIG.publicDir);
  
  // Create necessary subdirectories
  await fs.ensureDir(path.join(CONFIG.publicDir, 'assets'));
  await fs.ensureDir(path.join(CONFIG.publicDir, 'assets/css'));
  await fs.ensureDir(path.join(CONFIG.publicDir, 'assets/js'));
  await fs.ensureDir(path.join(CONFIG.publicDir, 'assets/images'));
  await fs.ensureDir(path.join(CONFIG.publicDir, 'assets/fonts'));
  await fs.ensureDir(path.join(CONFIG.publicDir, 'data'));
}

/**
 * Copy pages maintaining folder structure
 */
async function copyPages() {
  const pages = await getAllPages(CONFIG.pagesDir);
  
  for (const page of pages) {
    const relativePath = path.relative(CONFIG.pagesDir, page);
    const destPath = path.join(CONFIG.publicDir, relativePath);
    
    await fs.ensureDir(path.dirname(destPath));
    await fs.copyFile(page, destPath);
  }
}

/**
 * Get all HTML pages recursively
 */
async function getAllPages(dir) {
  let results = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      const subResults = await getAllPages(fullPath);
      results = results.concat(subResults);
    } else if (item === 'index.html' || item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Process HTML includes
 */
async function processIncludes() {
  try {
    execSync('node ' + path.join(__dirname, 'process-includes.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    throw new Error('Failed to process includes: ' + error.message);
  }
}

/**
 * Build CSS
 */
async function buildCSS() {
  try {
    execSync('node ' + path.join(__dirname, 'build-css.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    throw new Error('Failed to build CSS: ' + error.message);
  }
}

/**
 * Build JavaScript
 */
async function buildJS() {
  try {
    execSync('node ' + path.join(__dirname, 'build-js.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    throw new Error('Failed to build JavaScript: ' + error.message);
  }
}

/**
 * Optimize images
 */
async function optimizeImages() {
  try {
    execSync('node ' + path.join(__dirname, 'optimize-images.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    color.yellow('   ⚠️  Image optimization skipped (optional)');
  }
}

/**
 * Copy assets (fonts, etc)
 */
async function copyAssets() {
  // Copy fonts
  const fontsSrc = path.join(CONFIG.assetsDir, 'fonts');
  const fontsDest = path.join(CONFIG.publicDir, 'assets/fonts');
  
  if (await fs.pathExists(fontsSrc)) {
    await fs.copy(fontsSrc, fontsDest);
  }
  
  // Copy data files
  const dataSrc = CONFIG.dataDir;
  const dataDest = path.join(CONFIG.publicDir, 'data');
  
  if (await fs.pathExists(dataSrc)) {
    await fs.copy(dataSrc, dataDest);
  }
  
  // Copy root files (robots.txt, etc)
  const rootFiles = ['robots.txt', 'humans.txt', 'manifest.json', 'CNAME', '.htaccess'];
  for (const file of rootFiles) {
    const srcPath = path.join(CONFIG.srcDir, file);
    const destPath = path.join(CONFIG.publicDir, file);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copyFile(srcPath, destPath);
    }
  }
  
  // Copy service worker
  const swSrc = path.join(CONFIG.srcDir, 'sw.js');
  const swDest = path.join(CONFIG.publicDir, 'sw.js');
  
  if (await fs.pathExists(swSrc)) {
    await fs.copyFile(swSrc, swDest);
  }
}

/**
 * Generate sitemap
 */
async function generateSitemap() {
  try {
    execSync('node ' + path.join(__dirname, 'generate-sitemap.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    color.yellow('   ⚠️  Sitemap generation skipped');
  }
}

/**
 * Generate PWA assets
 */
async function generatePWA() {
  try {
    execSync('node ' + path.join(__dirname, 'generate-icons.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    color.yellow('   ⚠️  PWA asset generation skipped');
  }
}

/**
 * Minify HTML
 */
async function minifyHTML() {
  try {
    execSync('node ' + path.join(__dirname, 'minify-html.js'), { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    color.yellow('   ⚠️  HTML minification skipped');
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = build;