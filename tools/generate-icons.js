/**
 * ============================================
 * LIPEK FASHION - PWA ICON GENERATOR
 * Generates PWA icons from source
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const CONFIG = {
  sourceIcon: path.join(__dirname, '../src/assets/images/pwa/icon-512x512.png'),
  destDir: path.join(__dirname, '../public/assets/images/pwa'),
  sizes: [72, 96, 128, 144, 152, 192, 384, 512],
  maskableSizes: [192, 512]
};

/**
 * Generate icons
 */
async function generateIcons() {
  console.log('📱 Generating PWA icons...');
  
  try {
    // Check if source icon exists
    if (!await fs.pathExists(CONFIG.sourceIcon)) {
      console.warn('   ⚠️  Source icon not found, skipping PWA icon generation');
      return;
    }
    
    // Ensure destination directory exists
    await fs.ensureDir(CONFIG.destDir);
    
    // Generate regular icons
    for (const size of CONFIG.sizes) {
      const destPath = path.join(CONFIG.destDir, `icon-${size}x${size}.png`);
      
      await sharp(CONFIG.sourceIcon)
        .resize(size, size)
        .png()
        .toFile(destPath);
      
      console.log(`   ✅ Generated: icon-${size}x${size}.png`);
    }
    
    // Generate maskable icons (with padding for Android)
    for (const size of CONFIG.maskableSizes) {
      const destPath = path.join(CONFIG.destDir, `maskable-icon-${size}x${size}.png`);
      
      // Add 10% padding for maskable icons
      const padding = Math.floor(size * 0.1);
      const iconSize = size - (padding * 2);
      
      await sharp(CONFIG.sourceIcon)
        .resize(iconSize, iconSize)
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(destPath);
      
      console.log(`   ✅ Generated: maskable-icon-${size}x${size}.png`);
    }
    
    console.log(`   ✅ PWA icons generated successfully\n`);
    
  } catch (error) {
    console.error('   ❌ PWA icon generation failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = generateIcons;