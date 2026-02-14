/**
 * ============================================
 * LIPEK FASHION - DEPLOYMENT SCRIPT
 * Deploys to hosting (Netlify/Vercel/FTP)
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  publicDir: path.join(__dirname, '../public'),
  deployTarget: process.env.DEPLOY_TARGET || 'netlify' // netlify, vercel, ftp
};

/**
 * Deploy to Netlify
 */
async function deployToNetlify() {
  console.log('📤 Deploying to Netlify...');
  
  try {
    execSync('npx netlify deploy --prod --dir=' + CONFIG.publicDir, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Deployed to Netlify successfully!');
  } catch (error) {
    throw new Error('Netlify deployment failed: ' + error.message);
  }
}

/**
 * Deploy to Vercel
 */
async function deployToVercel() {
  console.log('📤 Deploying to Vercel...');
  
  try {
    execSync('npx vercel --prod', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Deployed to Vercel successfully!');
  } catch (error) {
    throw new Error('Vercel deployment failed: ' + error.message);
  }
}

/**
 * Deploy via FTP (placeholder - implement with ssh2 or ftp package)
 */
async function deployViaFTP() {
  console.log('📤 Deploying via FTP...');
  console.log('⚠️  FTP deployment not implemented. Please configure in deploy.js');
}

/**
 * Main deploy function
 */
async function deploy() {
  console.log('\n');
  console.log('🚀 LIPEK FASHION - DEPLOYMENT');
  console.log('================================\n');
  
  try {
    // Check if public directory exists
    if (!await fs.pathExists(CONFIG.publicDir)) {
      throw new Error('Public directory not found. Run build first: npm run build');
    }
    
    // Deploy based on target
    switch (CONFIG.deployTarget) {
      case 'netlify':
        await deployToNetlify();
        break;
      case 'vercel':
        await deployToVercel();
        break;
      case 'ftp':
        await deployViaFTP();
        break;
      default:
        console.log('⚠️  No deployment target specified');
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deploy();
}

module.exports = deploy;