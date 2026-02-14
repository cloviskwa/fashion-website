/**
 * ============================================
 * LIPEK FASHION - HTML INCLUDES PROCESSOR
 * Replaces {{include}} placeholders with actual content
 * Version: 1.0.0
 * ============================================
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const CONFIG = {
  srcDir: path.join(__dirname, '../src'),
  publicDir: path.join(__dirname, '../public'),
  includesDir: path.join(__dirname, '../src/includes'),
};

/**
 * Read include file content
 */
async function getIncludeContent(includeName) {
  const includePath = path.join(CONFIG.includesDir, `${includeName}.html`);
  
  try {
    if (await fs.pathExists(includePath)) {
      return await fs.readFile(includePath, 'utf8');
    }
  } catch (error) {
    console.warn(`Warning: Include file not found: ${includeName}.html`);
  }
  
  return `<!-- Include ${includeName} not found -->`;
}

/**
 * Process a single HTML file
 */
async function processFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  
  // Find all includes {{include-name}}
  const includeRegex = /{{include:([^}]+)}}/g;
  let match;
  
  while ((match = includeRegex.exec(content)) !== null) {
    const includeName = match[1].trim();
    const includeContent = await getIncludeContent(includeName);
    content = content.replace(match[0], includeContent);
  }
  
  // Write processed file to public directory
  const relativePath = path.relative(CONFIG.srcDir, filePath);
  const destPath = path.join(CONFIG.publicDir, relativePath);
  
  await fs.ensureDir(path.dirname(destPath));
  await fs.writeFile(destPath, content, 'utf8');
  
  console.log(`   Processed: ${relativePath}`);
}

/**
 * Main function
 */
async function processIncludes() {
  console.log('🔧 Processing HTML includes...');
  
  // Find all HTML files in src/pages
  const pattern = path.join(CONFIG.srcDir, 'pages/**/*.html');
  const files = glob.sync(pattern);
  
  for (const file of files) {
    await processFile(file);
  }
  
  console.log(`✅ Processed ${files.length} HTML files\n`);
}

// Run if called directly
if (require.main === module) {
  processIncludes().catch(console.error);
}

module.exports = processIncludes;