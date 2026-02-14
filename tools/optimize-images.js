/**
 * ============================================
 * LIPEK FASHION - IMAGE OPTIMIZER
 * Optimizes images and converts to WebP/AVIF
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const CONFIG = {
  srcDir: path.join(__dirname, '../src/assets/images'),
  destDir: path.join(__dirname, '../public/assets/images'),
  quality: 80,
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 }
  }
};

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
  const relativePath = path.relative(CONFIG.srcDir, filePath);
  const parsedPath = path.parse(relativePath);
  
  // Skip if already in optimized folder
  if (relativePath.includes('optimized') || relativePath.includes('pwa') || relativePath.includes('social')) {
    return;
  }
  
  // Destination paths
  const webpDest = path.join(CONFIG.destDir, 'webp', parsedPath.dir, parsedPath.name + '.webp');
  const avifDest = path.join(CONFIG.destDir, 'avif', parsedPath.dir, parsedPath.name + '.avif');
  const originalDest = path.join(CONFIG.destDir, parsedPath.dir, parsedPath.base);
  
  try {
    // Ensure directories exist
    await fs.ensureDir(path.dirname(webpDest));
    await fs.ensureDir(path.dirname(avifDest));
    await fs.ensureDir(path.dirname(originalDest));
    
    // Read image
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Skip if not an image
    if (!metadata.format) return;
    
    // Resize if too large
    let pipeline = image;
    if (metadata.width > 2000) {
      pipeline = pipeline.resize(2000);
    }
    
    // Create WebP version
    await pipeline
      .webp({ quality: CONFIG.quality })
      .toFile(webpDest);
    
    // Create AVIF version
    await pipeline
      .avif({ quality: CONFIG.quality })
      .toFile(avifDest);
    
    // Copy original (already optimized)
    await fs.copyFile(filePath, originalDest);
    
    console.log(`   ✅ Optimized: ${relativePath}`);
    
  } catch (error) {
    console.error(`   ❌ Failed: ${relativePath} - ${error.message}`);
  }
}

/**
 * Main function
 */
async function optimizeImages() {
  console.log('🖼️ Optimizing images...');
  
  try {
    // Find all images
    const patterns = [
      path.join(CONFIG.srcDir, 'raw/**/*.{jpg,jpeg,png,gif}'),
      path.join(CONFIG.srcDir, 'design/**/*.{jpg,jpeg,png,gif,svg}'),
      path.join(CONFIG.srcDir, 'social/**/*.{jpg,jpeg,png}'),
      path.join(CONFIG.srcDir, 'pwa/**/*.png')
    ];
    
    let files = [];
    for (const pattern of patterns) {
      files = files.concat(glob.sync(pattern));
    }
    
    // Process each image
    for (const file of files) {
      await optimizeImage(file);
    }
    
    console.log(`✅ Optimized ${files.length} images\n`);
    
  } catch (error) {
    console.error('   ❌ Image optimization failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = optimizeImages;